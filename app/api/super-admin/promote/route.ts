import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/utils/db";

interface MiddlewareUserPayload {
    userId: string;
    email: string;
    role: "VOLUNTEER" | "ADMIN" | "SUPER_ADMIN";
}

type TargetRole = "VOLUNTEER" | "ADMIN" | "SUPER_ADMIN";

function getRequestUserPayload(request: NextRequest): MiddlewareUserPayload | null {
    const payloadHeader = request.headers.get("x-user-payload");
    if (!payloadHeader) return null;

    try {
        const payload = JSON.parse(payloadHeader) as MiddlewareUserPayload;
        return payload;
    } catch {
        return null;
    }
}

async function ensureUserPerson(user: {
    id: string;
    email: string;
    role: "VOLUNTEER" | "ADMIN" | "SUPER_ADMIN";
    personId: string | null;
}) {
    if (user.personId) return user.personId;

    let person = await prisma.person.findUnique({
        where: { emailAddress: user.email },
    });

    if (!person) {
        let firstName = "User";
        let lastName = "Account";
        let phoneNumber: string | null = null;

        if (user.role === "ADMIN") {
            const adminProfile = await prisma.admin.findFirst({
                where: {
                    email: user.email,
                    isDeleted: false,
                },
                select: {
                    firstName: true,
                    lastName: true,
                },
            });

            if (adminProfile) {
                firstName = adminProfile.firstName;
                lastName = adminProfile.lastName;
            }
        }

        if (user.role === "VOLUNTEER") {
            const volunteerProfile = await prisma.volunteer.findFirst({
                where: {
                    emailAddress: user.email,
                    isDeleted: false,
                },
                select: {
                    firstName: true,
                    lastName: true,
                    phoneNumber: true,
                },
            });

            if (volunteerProfile) {
                firstName = volunteerProfile.firstName;
                lastName = volunteerProfile.lastName;
                phoneNumber = volunteerProfile.phoneNumber ?? null;
            }
        }

        person = await prisma.person.create({
            data: {
                firstName,
                lastName,
                emailAddress: user.email,
                phoneNumber,
            },
        });
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { personId: person.id },
    });

    return person.id;
}

export async function GET(request: NextRequest) {
    try {
        const requestor = getRequestUserPayload(request);
        if (requestor?.role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                deletedAt: true,
                person: {
                    select: {
                        firstName: true,
                        lastName: true,
                        superAdmin: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                email: "asc",
            },
        });

        const emailsWithoutPersonName = users
            .filter((user) => !user.person?.firstName && !user.person?.lastName)
            .map((user) => user.email);

        const [admins, volunteers] = await Promise.all([
            prisma.admin.findMany({
                where: {
                    email: {
                        in: emailsWithoutPersonName,
                    },
                },
                select: {
                    email: true,
                    firstName: true,
                    lastName: true,
                },
            }),
            prisma.volunteer.findMany({
                where: {
                    emailAddress: {
                        in: emailsWithoutPersonName,
                    },
                },
                select: {
                    emailAddress: true,
                    firstName: true,
                    lastName: true,
                },
            }),
        ]);

        const adminByEmail = new Map(
            admins.map((admin) => [admin.email.toLowerCase(), admin])
        );

        const volunteerByEmail = new Map(
            volunteers.map((volunteer) => [volunteer.emailAddress.toLowerCase(), volunteer])
        );

        const manageableUsers = users
            .filter((user) => user.id !== requestor.userId)
            .map((user) => ({
                id: user.id,
                email: user.email,
                role: user.role,
                firstName:
                    user.person?.firstName ??
                    adminByEmail.get(user.email.toLowerCase())?.firstName ??
                    volunteerByEmail.get(user.email.toLowerCase())?.firstName ??
                    "",
                lastName:
                    user.person?.lastName ??
                    adminByEmail.get(user.email.toLowerCase())?.lastName ??
                    volunteerByEmail.get(user.email.toLowerCase())?.lastName ??
                    "",
                isDeleted: Boolean(user.deletedAt),
            }));

        return NextResponse.json({ users: manageableUsers }, { status: 200 });
    } catch (error) {
        console.error("Error fetching promotable users:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest){
try {
const requestor = getRequestUserPayload(request);
if (requestor?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

const {userID, targetRole} = await request.json();
const normalizedTargetRole: TargetRole = ["VOLUNTEER", "ADMIN", "SUPER_ADMIN"].includes(targetRole)
    ? targetRole
    : "SUPER_ADMIN";

if (!userID || typeof userID !== "string") {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
}

if (userID === requestor.userId && normalizedTargetRole !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "You cannot demote your own super admin account" }, { status: 400 });
}

const user = await prisma.user.findUnique({
        where: {id: userID},
        select: {
            id: true,
            email: true,
            role: true,
            personId: true,
            deletedAt: true,
        },
});

if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404});
}

if (user.deletedAt) {
    return NextResponse.json({ error: "User account is deleted. Restore the account first." }, { status: 400 });
}

const personId = await ensureUserPerson(user);

const existingSuperAdmin = await prisma.superAdmin.findUnique({
    where: { personId },
    select: { id: true },
});

if (user.role === normalizedTargetRole) {
    return NextResponse.json({ message: `User is already ${normalizedTargetRole}` }, { status: 200 });
}

if (normalizedTargetRole === "SUPER_ADMIN") {
    const [, superAdmin] = await prisma.$transaction([
            prisma.user.update({
                    where: {id: userID},
                    data: {role: "SUPER_ADMIN"}
            }),
            prisma.superAdmin.upsert({
                    where: { personId },
                    update: {},
                    create: {
                            personId,
                    },
            }),
    ]);

    return NextResponse.json({ message: "User promoted to SUPER_ADMIN successfully", id: superAdmin.id }, { status: 200 });
}

await prisma.$transaction(async (tx) => {
    await tx.user.update({
        where: { id: userID },
        data: { role: normalizedTargetRole },
    });

    if (existingSuperAdmin) {
        await tx.superAdmin.delete({ where: { personId } });
    }
});

return NextResponse.json({ message: `User role updated to ${normalizedTargetRole}` }, { status: 200 });
  } catch (error) {
    console.error("Error creating super admin account:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
    try {
        const requestor = getRequestUserPayload(request);
        if (requestor?.role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { userID } = await request.json();
        if (!userID || typeof userID !== "string") {
            return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
        }

        if (userID === requestor.userId) {
            return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userID },
            select: {
                id: true,
                email: true,
                personId: true,
                deletedAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.deletedAt) {
            return NextResponse.json({ message: "User account is already deleted" }, { status: 200 });
        }

        await prisma.user.update({
            where: { id: userID },
            data: {
                deletedAt: new Date(),
            },
        });

        return NextResponse.json({ message: "User account soft-deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user account:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const requestor = getRequestUserPayload(request);
        if (requestor?.role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { userID } = await request.json();
        if (!userID || typeof userID !== "string") {
            return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userID },
            select: {
                id: true,
                deletedAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!user.deletedAt) {
            return NextResponse.json({ message: "User account is already active" }, { status: 200 });
        }

        await prisma.user.update({
            where: { id: userID },
            data: { deletedAt: null },
        });

        return NextResponse.json({ message: "User account restored successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error restoring user account:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}