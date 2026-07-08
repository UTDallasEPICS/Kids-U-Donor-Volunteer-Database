import prisma from "@/app/utils/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return new Response(JSON.stringify({ message: "Invalid volunteer ID" }), {
      status: 400,
    });
  }

  try {
    const volunteer = await prisma.volunteer.findUnique({
      where: { id },
      include: {
        volunteerEvents: true,
        eventHoursLogged: true,
        application: true,
        EmergencyContact: true,
        VolunteerAttendance: true,
        EventRegistration: true,
        MailRecipient: true,
        backgroundCheck: true,
      },
    });

    if (!volunteer) {
      return new Response(JSON.stringify({ message: "Volunteer not found" }), {
        status: 404,
      });
    }

    const parseJsonArr = (v: string | string[]) => { if (Array.isArray(v)) return v; try { return JSON.parse(v); } catch { return []; } };
    const result = {
      ...volunteer,
      preferredRoles: parseJsonArr(volunteer.preferredRoles),
      availability: parseJsonArr(volunteer.availability),
      location: parseJsonArr(volunteer.location),
      preferredEvents: parseJsonArr(volunteer.preferredEvents),
    };

    return new Response(JSON.stringify({ volunteer: result }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching volunteer details:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
