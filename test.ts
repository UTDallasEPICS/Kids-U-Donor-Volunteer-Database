import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    //Grant stuff below this block. This is constituents and organization mock data.

    /*const newConstituent = await prisma.constituent.create({
        data: {
          FirstName: 'first',
          LastName: 'last',
          StreetAddress: '123 Something St.',
          City: 'SomewhereCity',
          State:'SomeState',
          Zipcode: 'SomeZipcode',
          Country: 'SomeCountry',
          EmailAddress: 'email@example.com'
        },
        select: {
          FirstName: true,
          LastName: true
        }
      })
      const createManyOrg = await prisma.organization.createMany({
        data: [
          { StreetAddress: '123 Something St.', City: 'SomewhereCity', State:'SomeState', 
            Zipcode: 'SomeZipcode', Country: 'SomeCountry', OrganizationName: 'SomeOrganization' },
          { StreetAddress: '456 Test Rd.', City: 'TestCity', State:'TestState', 
            Zipcode: 'TestZipcode', Country: 'TestCountry', OrganizationName: 'TestOrganization'},
          { StreetAddress: '789 A St.', City: 'ACity', State:'AState', 
            Zipcode: 'AZipcode', Country: 'ACountry', OrganizationName: 'AOrganization' },
          { StreetAddress: '789 A St.', City: 'ACity', State:'AState', 
            Zipcode: 'AZipcode', Country: 'ACountry', OrganizationName: 'AOrganization' },
        ],
        skipDuplicates: true,
      })
      const organizations = await prisma.organization.findMany()
      console.log(JSON.stringify(organizations));*/

      //Two grants for now.
      const createManyGrants = await prisma.grant.createMany({
        data: [
          {GrantName: "Mock Grant One",
          FundingAreas: ["Education"],
          KidsUProgram: ["Afterschool Tutoring"],
          FundingRestrictions: "None",
          ContactType: "Email Grant",
          GrantOpeningDates: [new Date("2023-01-01"), new Date("2023-02-01"), new Date("2023-03-01")],
          EndOfGrantReportDueDate: new Date("2025-01-31"),
          GrantDueDate: new Date("2024-09-15"),
          AskDate: new Date("2023-06-15"),
          AwardDate: null,
          ReportingDates: [new Date("2024-01-15"), new Date("2024-07-15")],
          TypeOfReporting: "Quarterly",
          DateToReapplyForGrant: new Date("2025-06-01"),
          WaitingPeriodToReapply: 2,
          AskAmount: 50000.00,
          AwardStatus: "Declined",
          AmountAwarded: 0.00},

          {GrantName: "Mock Grant Two",
          FundingAreas: ["Education"],
          KidsUProgram: ["Youth Empowerment"], 
          FundingRestrictions: "None",
          ContactType: "Email Grant", 
          GrantOpeningDates: [new Date("2023-04-01"), new Date("2023-05-01"), new Date("2023-06-01")], 
          EndOfGrantReportDueDate: new Date("2025-03-31"),
          GrantDueDate: new Date("2026-04-06"),
          AskDate: new Date("2023-07-15"), 
          AwardDate: null,
          ReportingDates: [new Date("2024-04-15"), new Date("2024-10-15")],
          TypeOfReporting: "Biannually", 
          DateToReapplyForGrant: new Date("2025-07-01"),
          WaitingPeriodToReapply: 3, 
          AskAmount: 6500.00, 
          AwardStatus: "Pending", 
          AmountAwarded: 0.00,}
        ]
      })
}

main()
    .catch( e => { throw e })
    .finally( async () => await prisma.$disconnect() )

