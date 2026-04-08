const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Adding mock locations...\n");

  const locations = [
    {
      name: "Kids-U Main Campus",
      address: "1234 Education Blvd",
      city: "Dallas",
      state: "TX",
      zipCode: "75201",
      phoneNumber: "214-555-0101",
      emailAddress: "main@kidsu.org",
      hours: "Mon-Fri 8am-6pm",
    },
    {
      name: "Kids-U North Center",
      address: "5678 Learning Lane",
      city: "Plano",
      state: "TX",
      zipCode: "75024",
      phoneNumber: "214-555-0202",
      emailAddress: "north@kidsu.org",
      hours: "Mon-Sat 9am-5pm",
    },
    {
      name: "Kids-U South Campus",
      address: "9101 Scholar Street",
      city: "Irving",
      state: "TX",
      zipCode: "75038",
      phoneNumber: "214-555-0303",
      emailAddress: "south@kidsu.org",
      hours: "Tue-Sat 10am-6pm",
    },
  ];

  for (const loc of locations) {
    const existing = await prisma.location.findFirst({ where: { name: loc.name } });
    if (existing) {
      console.log(`Skipping "${loc.name}" — already exists.`);
      continue;
    }
    const created = await prisma.location.create({ data: loc });
    console.log(`Created: ${created.name} (ID: ${created.id})`);
  }

  console.log("\nDone.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
