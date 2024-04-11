// representativeController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createRepresentative = async (data) => {
  try {
    const newRepresentative = await prisma.representative.create({
      data: {
        RepresentativeFirstName: data.RepresentativeFirstName,
        RepresentativeLastName: data.RepresentativeLastName,
        RepresentativeEmail: data.RepresentativeEmail,
        RepresentativePhone: data.RepresentativePhone,
        PositionInCompany: data.PositionInCompany,
        Organization: {
          connect: { OrganizationID: data.OrganizationID },
        },
      },
    });
    return newRepresentative;
  } catch (error) {
    throw new Error(`Unable to create representative: ${error}`);
  }
};

const getRepresentatives = async () => {
  try {
    const representatives = await prisma.representative.findMany();
    return representatives;
  } catch (error) {
    throw new Error(`Unable to fetch representatives: ${error}`);
  }
};

const getRepresentativeById = async (id) => {
  try {
    const representative = await prisma.representative.findUnique({
      where: { RepresentativeID: id },
    });
    return representative;
  } catch (error) {
    throw new Error(`Unable to fetch representative: ${error}`);
  }
};

const updateRepresentative = async (id, data) => {
  try {
    const updatedRepresentative = await prisma.representative.update({
      where: { RepresentativeID: id },
      data: {
        RepresentativeFirstName: data.RepresentativeFirstName,
        RepresentativeLastName: data.RepresentativeLastName,
        RepresentativeEmail: data.RepresentativeEmail,
        RepresentativePhone: data.RepresentativePhone,
        PositionInCompany: data.PositionInCompany,
        Organization: {
          connect: { OrganizationID: data.OrganizationID },
        },
      },
    });
    return updatedRepresentative;
  } catch (error) {
    throw new Error(`Unable to update representative: ${error}`);
  }
};

const deleteRepresentative = async (id) => {
  try {
    await prisma.representative.delete({
      where: { RepresentativeID: id },
    });
    return 'Representative deleted successfully';
  } catch (error) {
    throw new Error(`Unable to delete representative: ${error}`);
  }
};

module.exports = {
  createRepresentative,
  getRepresentatives,
  getRepresentativeById,
  updateRepresentative,
  deleteRepresentative,
};
