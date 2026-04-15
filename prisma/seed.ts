import { PrismaClient } from "@prisma/client";
import { seedMockLocations } from "./seed/add_mock_locations";
import { seedMockVolunteerData } from "./seed/add_mock_data";
import { seedVolunteerApplications } from "./seed/add_application";
import { seedBackgroundChecks } from "./seed/add_bgc_mock_data";
import { seedAttendanceLogs } from "./seed/add_logs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed flow...\n");

  await seedMockLocations(prisma);
  await seedMockVolunteerData(prisma);
  await seedVolunteerApplications(prisma);
  await seedBackgroundChecks(prisma);
  await seedAttendanceLogs(prisma);

  console.log("\nDatabase seed flow completed.");
}

main()
  .catch((error) => {
    console.error("Seed flow failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
