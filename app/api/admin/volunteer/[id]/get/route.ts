import prisma from "@/app/utils/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

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
      },
    });

    if (!volunteer) {
      return new Response(JSON.stringify({ message: "Volunteer not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ volunteer }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching volunteer details:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
