import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const newConstituent = await prisma.constituent.create({
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
      console.log(JSON.stringify(organizations));
}

main()
    .catch( e => { throw e })
    .finally( async () => await prisma.$disconnect() )

