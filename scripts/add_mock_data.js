const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Adding mock data to database...\n");

  // First, check if there's an existing volunteer or create one
  let volunteer = await prisma.volunteer.findFirst();

  if (!volunteer) {
    console.log("Creating a mock volunteer...");
    volunteer = await prisma.volunteer.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        middleInitial: "A",
        addressLine: "123 Main St",
        city: "Dallas",
        state: "TX",
        zipCode: "75201",
        phoneNumber: "555-123-4567",
        emailAddress: "john.doe@example.com",
        volunteerPreference: "Weekends",
        preferredRoles: ["Tutor", "Mentor"],
        availability: ["Saturday", "Sunday"],
        location: ["Main Campus"],
        preferredEvents: ["Tutoring", "Sports"],
      },
    });
    console.log(`Created volunteer: ${volunteer.firstName} ${volunteer.lastName} (ID: ${volunteer.id})\n`);
  } else {
    console.log(`Using existing volunteer: ${volunteer.firstName} ${volunteer.lastName} (ID: ${volunteer.id})\n`);
  }

  // Create mock events
  console.log("Creating mock events...");
  const eventsData = [
    {
      name: "Weekend Tutoring Session",
      schedule: new Date("2026-03-01T10:00:00"),
      description: "Help students with homework and academic support",
    },
    {
      name: "Spring Sports Day",
      schedule: new Date("2026-03-15T09:00:00"),
      description: "Annual spring sports activities for kids",
    },
    {
      name: "Reading Workshop",
      schedule: new Date("2026-02-20T14:00:00"),
      description: "Interactive reading session for elementary students",
    },
    {
      name: "Art & Crafts Day",
      schedule: new Date("2026-02-10T11:00:00"),
      description: "Creative art activities for children",
    },
    {
      name: "STEM Learning Camp",
      schedule: new Date("2026-01-25T09:00:00"),
      description: "Science and technology exploration for young minds",
    },
  ];

  const createdEvents = [];
  for (const eventData of eventsData) {
    const existingEvent = await prisma.event.findFirst({
      where: { name: eventData.name },
    });

    if (existingEvent) {
      console.log(`  Event already exists: ${existingEvent.name}`);
      createdEvents.push(existingEvent);
    } else {
      const event = await prisma.event.create({ data: eventData });
      console.log(`  Created event: ${event.name} (ID: ${event.id})`);
      createdEvents.push(event);
    }
  }

  // Create volunteer attendance records with hours
  console.log("\nCreating volunteer attendance records with hours...");
  const attendanceData = [
    {
      hoursWorked: 4.5,
      checkInTime: new Date("2026-01-25T09:00:00"),
      checkOutTime: new Date("2026-01-25T13:30:00"),
      volunteerId: volunteer.id,
      eventId: createdEvents[4].id, // STEM Learning Camp
    },
    {
      hoursWorked: 3.0,
      checkInTime: new Date("2026-02-10T11:00:00"),
      checkOutTime: new Date("2026-02-10T14:00:00"),
      volunteerId: volunteer.id,
      eventId: createdEvents[3].id, // Art & Crafts Day
    },
    {
      hoursWorked: 2.5,
      checkInTime: new Date("2026-02-20T14:00:00"),
      checkOutTime: new Date("2026-02-20T16:30:00"),
      volunteerId: volunteer.id,
      eventId: createdEvents[2].id, // Reading Workshop
    },
  ];

  let totalHoursAdded = 0;
  for (const attendance of attendanceData) {
    // Check if attendance already exists for this volunteer/event combo
    const existingAttendance = await prisma.volunteerAttendance.findFirst({
      where: {
        volunteerId: attendance.volunteerId,
        eventId: attendance.eventId,
      },
    });

    if (existingAttendance) {
      console.log(`  Attendance already exists for event ${attendance.eventId}`);
    } else {
      const record = await prisma.volunteerAttendance.create({ data: attendance });
      console.log(`  Created attendance: ${attendance.hoursWorked} hours for event ${attendance.eventId}`);
      totalHoursAdded += attendance.hoursWorked;
    }
  }

  // Summary
  console.log("\n=== Summary ===");
  console.log(`Events created/found: ${createdEvents.length}`);
  console.log(`New hours added: ${totalHoursAdded}`);

  // Get total hours for the volunteer
  const totals = await prisma.volunteerAttendance.aggregate({
    where: { volunteerId: volunteer.id },
    _sum: { hoursWorked: true },
  });
  console.log(`Total volunteer hours in DB: ${totals._sum.hoursWorked || 0}`);

  console.log("\nDone!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
