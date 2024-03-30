import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getOrganization(OrganizationName: string){
    const organization = await prisma.organization.findUnique({
        where: {
        OrganizationName: OrganizationName,
        },
      })
    return organization;
} 

export async function getAllOrganizations(){
    const organizations = await prisma.organization.findMany();
    return organizations;
}