const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createConstituent = async (data) => {
  try {
    const newConstituent = await prisma.constituent.create({
      data: {
        FirstName: data.FirstName,
        LastName: data.LastName,
        StreetAddress: data.StreetAddress,
        City: data.City,
        State: data.State,
        Zipcode: data.Zipcode,
        Country: data.Country,
        EmailAddress: data.EmailAddress,
        PhoneNumber: data.PhoneNumber,
        AreaCode: data.AreaCode,
      },
    });
    return newConstituent;
  } catch (error) {
    throw new Error(`Unable to create constituent: ${error}`);
  }
};

const getConstituents = async () => {
  try {
    const constituents = await prisma.constituent.findMany();
    return constituents;
  } catch (error) {
    throw new Error(`Unable to fetch constituents: ${error}`);
  }
};

const getConstituentById = async (id) => {
  try {
    const constituent = await prisma.constituent.findUnique({
      where: { ConstituentID: id },
    });
    return constituent;
  } catch (error) {
    throw new Error(`Unable to fetch constituent: ${error}`);
  }
};

const updateConstituent = async (id, data) => {
  try {
    const updatedConstituent = await prisma.constituent.update({
      where: { ConstituentID: id },
      data: {
        FirstName: data.FirstName,
        LastName: data.LastName,
        StreetAddress: data.StreetAddress,
        City: data.City,
        State: data.State,
        Zipcode: data.Zipcode,
        Country: data.Country,
        EmailAddress: data.EmailAddress,
        PhoneNumber: data.PhoneNumber,
        AreaCode: data.AreaCode,
      },
    });
    return updatedConstituent;
  } catch (error) {
    throw new Error(`Unable to update constituent: ${error}`);
  }
};

const deleteConstituent = async (id) => {
  try {
    await prisma.constituent.delete({
      where: { ConstituentID: id },
    });
    return 'Constituent deleted successfully';
  } catch (error) {
    throw new Error(`Unable to delete constituent: ${error}`);
  }
};

module.exports = {
  createConstituent,
  getConstituents,
  getConstituentById,
  updateConstituent,
  deleteConstituent,
};
