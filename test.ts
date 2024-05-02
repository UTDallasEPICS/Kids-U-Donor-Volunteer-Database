import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// Make sure to empty database before using.

async function main() {
    //Grant stuff below this block. This is constituents and organization mock data.

    //Create one mock constituient.
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

      //Create multiple organizations.
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

      //Create multiple grants.
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
          AmountAwarded: 0.00,},
          
          {GrantName: "Mock Grant Three",
          FundingAreas: ["Education"],
          KidsUProgram: ["After School Tutoring"], 
          FundingRestrictions: "A mock restriction",
          ContactType: "John Smith", 
          GrantOpeningDates: [new Date("2000-08-12"), new Date("2001-05-01"), new Date("2023-06-01")], 
          EndOfGrantReportDueDate: new Date("2007-09-23"),
          GrantDueDate: new Date("2008-02-17"),
          AskDate: new Date("2001-08-15"), 
          AwardDate: new Date("2001-06-01"),
          ReportingDates: [new Date("2004-04-01"), new Date("2005-10-15")],
          TypeOfReporting: "Yearly", 
          DateToReapplyForGrant: new Date("2009-12-01"),
          WaitingPeriodToReapply: 2, 
          AskAmount: 16500.00, 
          AwardStatus: "Accepted", 
          AmountAwarded: 1000.00,},

          {GrantName: "Mock Grant Four",
          FundingAreas: ["Education"],
          KidsUProgram: ["Youth Empowerment"], 
          FundingRestrictions: "None",
          ContactType: "Email Grant", 
          GrantOpeningDates: [new Date("2030-06-24"), new Date("2035-07-21"), new Date("2040-08-16")], 
          EndOfGrantReportDueDate: new Date("2040-12-20"),
          GrantDueDate: new Date("2040-12-21"),
          AskDate: new Date("2031-07-16"), 
          AwardDate: new Date("2031-10-24"),
          ReportingDates: [new Date("2035-04-15"), new Date("2037-11-15")],
          TypeOfReporting: "Biannually", 
          DateToReapplyForGrant: new Date("2045-07-25"),
          WaitingPeriodToReapply: 3, 
          AskAmount: 30000.00, 
          AwardStatus: "Accepted", 
          AmountAwarded: 15000.00},

          {GrantName: "Mock Grant Five",
          FundingAreas: ["Education"],
          KidsUProgram: ["Marketing Video"], 
          FundingRestrictions: "None",
          ContactType: "Company Website", 
          GrantOpeningDates: [new Date("2026-05-01"), new Date("2027-06-01"), new Date("2028-07-01")], 
          EndOfGrantReportDueDate: new Date("2028-04-31"),
          GrantDueDate: new Date("2029-05-05"),
          AskDate: new Date("2026-08-25"), 
          AwardDate: null,
          ReportingDates: [new Date("2027-04-25"), new Date("2027-10-25")],
          TypeOfReporting: "Biannually", 
          DateToReapplyForGrant: new Date("2028-07-30"),
          WaitingPeriodToReapply: 1, 
          AskAmount: 20000.00, 
          AwardStatus: "Pending", 
          AmountAwarded: 0.00,},

          {GrantName: "Mock Grant Six",
          FundingAreas: ["Education"],
          KidsUProgram: ["New Site"], 
          FundingRestrictions: "None",
          ContactType: "Email Grant", 
          GrantOpeningDates: [new Date("2010-10-10"), new Date("2011-11-11"), new Date("2012-12-12")], 
          EndOfGrantReportDueDate: new Date("2013-01-13"),
          GrantDueDate: new Date("2014-02-14"),
          AskDate: new Date("2010-09-09"), 
          AwardDate: null,
          ReportingDates: [new Date("2011-05-05"), new Date("2012-06-06")],
          TypeOfReporting: "Quarterly", 
          DateToReapplyForGrant: new Date("2014-03-14"),
          WaitingPeriodToReapply: 5, 
          AskAmount: 18000.00, 
          AwardStatus: "Declined", 
          AmountAwarded: 0.00,},

          {GrantName: "Mock Grant Seven",
          FundingAreas: ["Education"],
          KidsUProgram: ["After School Tutoring"], 
          FundingRestrictions: "Another mock restriction",
          ContactType: "Jane Doe", 
          GrantOpeningDates: [new Date("2008-04-16"), new Date("2009-06-18"), new Date("2010-08-20")], 
          EndOfGrantReportDueDate: new Date("2012-12-24"),
          GrantDueDate: new Date("2014-02-14"),
          AskDate: new Date("2008-09-05"), 
          AwardDate: new Date("2009-08-16"),
          ReportingDates: [new Date("2009-05-05"), new Date("2010-06-06")],
          TypeOfReporting: "Biannually", 
          DateToReapplyForGrant: new Date("2015-09-23"),
          WaitingPeriodToReapply: 2, 
          AskAmount: 13500.00, 
          AwardStatus: "Awarded", 
          AmountAwarded: 10000.00,}
        ]
      })
}

main()
    .catch( e => { throw e })
    .finally( async () => await prisma.$disconnect() )

