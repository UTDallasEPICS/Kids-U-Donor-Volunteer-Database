// organizationController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createOrganization = async (data) => {
  try {
    const newOrganization = await prisma.organization.create({
      data: {
        WebsiteForFunder: data.WebsiteForFunder,
        StreetAddress: data.StreetAddress,
        City: data.City,
        State: data.State,
        Zipcode: data.Zipcode,
        Country: data.Country,
        OrganizationName: data.OrganizationName,
        PortalForGrantApplication: data.PortalForGrantApplication,
        NotesAboutLoginInfo: data.NotesAboutLoginInfo,
      },
    });
    return newOrganization;
  } catch (error) {
    throw new Error(`Unable to create organization: ${error}`);
  }
};

const getOrganizations = async () => {
  try {
    const organizations = await prisma.organization.findMany();
    return organizations;
  } catch (error) {
    throw new Error(`Unable to fetch organizations: ${error}`);
  }
};

const getOrganizationById = async (id) => {
  try {
    const organization = await prisma.organization.findUnique({
      where: { OrganizationID: id },
    });
    return organization;
  } catch (error) {
    throw new Error(`Unable to fetch organization: ${error}`);
  }
};

const updateOrganization = async (id, data) => {
  try {
    const updatedOrganization = await prisma.organization.update({
      where: { OrganizationID: id },
      data: {
        WebsiteForFunder: data.WebsiteForFunder,
        StreetAddress: data.StreetAddress,
        City: data.City,
        State: data.State,
        Zipcode: data.Zipcode,
        Country: data.Country,
        OrganizationName: data.OrganizationName,
        PortalForGrantApplication: data.PortalForGrantApplication,
        NotesAboutLoginInfo: data.NotesAboutLoginInfo,
      },
    });
    return updatedOrganization;
  } catch (error) {
    throw new Error(`Unable to update organization: ${error}`);
  }
};

const deleteOrganization = async (id) => {
  try {
    await prisma.organization.delete({
      where: { OrganizationID: id },
    });
    return 'Organization deleted successfully';
  } catch (error) {
    throw new Error(`Unable to delete organization: ${error}`);
  }
};

module.exports = {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
};
