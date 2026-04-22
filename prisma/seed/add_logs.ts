//This is to create mock data
import { Prisma, PrismaClient } from "@prisma/client";

export async function seedAttendanceLogs(prisma: PrismaClient) {
  const volunteers = await prisma.volunteer.findMany({
    select: { id: true, firstName: true, lastName: true },
  });

  if (volunteers.length === 0) {
    console.log("No volunteers found. Creating a mock volunteer first...");
    const volunteer = await prisma.volunteer.create({
      data: {
        firstName: "Diya",
        lastName: "Bhattarai",
        addressLine: "123 Main St",
        city: "Houston",
        state: "TX",
        zipCode: "77001",
        phoneNumber: "555-0100",
        emailAddress: "diya@example.com",
        registration: true,
      },
    });
    volunteers.push(volunteer);
  }

  let events = await prisma.event.findMany({
    select: { id: true, name: true },
  });

  if (events.length === 0) {
    console.log("No events found. Creating mock events...");
    const event1 = await prisma.event.create({
      data: {
        name: "After School Tutoring",
        schedule: new Date("2026-02-10T15:00:00Z"),
        description: "Help kids with homework and tutoring sessions",
      },
    });
    const event2 = await prisma.event.create({
      data: {
        name: "Weekend Community Cleanup",
        schedule: new Date("2026-02-15T09:00:00Z"),
        description: "Community cleanup event at the park",
      },
    });
    const event3 = await prisma.event.create({
      data: {
        name: "Food Drive",
        schedule: new Date("2026-02-20T10:00:00Z"),
        description: "Monthly food drive for families in need",
      },
    });
    events = [event1, event2, event3];
  }

  const mockLogs: Prisma.VolunteerAttendanceCreateManyInput[] = [];
  const volunteerId = volunteers[0].id;

  for (const event of events) {
    mockLogs.push(
      {
        volunteerId,
        eventId: event.id,
        checkInTime: new Date("2026-02-03T09:00:00Z"),
        checkOutTime: new Date("2026-02-03T13:00:00Z"),
        hoursWorked: 4,
      },
      {
        volunteerId,
        eventId: event.id,
        checkInTime: new Date("2026-02-05T14:00:00Z"),
        checkOutTime: new Date("2026-02-05T17:30:00Z"),
        hoursWorked: 3.5,
      },
      {
        volunteerId,
        eventId: event.id,
        checkInTime: new Date("2026-02-10T08:30:00Z"),
        checkOutTime: new Date("2026-02-10T12:00:00Z"),
        hoursWorked: 3.5,
      },
      {
        volunteerId,
        eventId: event.id,
        checkInTime: new Date("2026-02-12T10:00:00Z"),
        checkOutTime: new Date("2026-02-12T15:00:00Z"),
        hoursWorked: 5,
      },
      {
        volunteerId,
        eventId: event.id,
        checkInTime: new Date("2026-02-17T09:00:00Z"),
        checkOutTime: new Date("2026-02-17T11:30:00Z"),
        hoursWorked: 2.5,
      },
      {
        volunteerId,
        eventId: event.id,
        checkInTime: new Date("2026-02-19T13:00:00Z"),
        checkOutTime: new Date("2026-02-19T18:00:00Z"),
        hoursWorked: 5,
      }
    );
  }

  if (volunteers.length > 1) {
    for (let i = 1; i < Math.min(volunteers.length, 4); i++) {
      const vol = volunteers[i];
      const event = events[i % events.length];
      mockLogs.push(
        {
          volunteerId: vol.id,
          eventId: event.id,
          checkInTime: new Date("2026-02-04T09:00:00Z"),
          checkOutTime: new Date("2026-02-04T14:00:00Z"),
          hoursWorked: 5,
        },
        {
          volunteerId: vol.id,
          eventId: event.id,
          checkInTime: new Date("2026-02-11T10:00:00Z"),
          checkOutTime: new Date("2026-02-11T16:00:00Z"),
          hoursWorked: 6,
        },
        {
          volunteerId: vol.id,
          eventId: event.id,
          checkInTime: new Date("2026-02-18T08:00:00Z"),
          checkOutTime: new Date("2026-02-18T12:30:00Z"),
          hoursWorked: 4.5,
        }
      );
    }
  }
  let insertedCount = 0;
  for (const log of mockLogs) {
    const existing = await prisma.volunteerAttendance.findFirst({
      where: {
        volunteerId: log.volunteerId,
        eventId: log.eventId,
        checkInTime: log.checkInTime,
        checkOutTime: log.checkOutTime,
      },
      select: { id: true },
    });

    if (existing) {
      continue;
    }

    await prisma.volunteerAttendance.create({ data: log });
    insertedCount += 1;
  }

  console.log(`Successfully created ${insertedCount} volunteer attendance logs!`);

  const allLogs = await prisma.volunteerAttendance.findMany({
    include: {
      volunteer: { select: { firstName: true, lastName: true } },
      event: { select: { name: true } },
    },
    orderBy: { checkInTime: "desc" },
  });

  console.log("\n📋 Attendance Log Summary:");
  console.log("─".repeat(80));
  for (const log of allLogs) {
    console.log(
      `${log.volunteer.firstName} ${log.volunteer.lastName} | ${log.event.name} | ` +
        `In: ${log.checkInTime.toLocaleString()} | Out: ${log.checkOutTime.toLocaleString()} | ` +
        `Hours: ${log.hoursWorked}`
    );
  }
}
