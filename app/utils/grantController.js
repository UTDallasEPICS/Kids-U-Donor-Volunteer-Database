// grantController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createGrant = async (data) => {
  try {
    const newGrant = await prisma.grant.create({
      data: {
        GrantName: data.GrantName,
        Years: data.Years,
        FundingAreas: { set: data.FundingAreas },
        KidsUProgram: { set: data.KidsUProgram },
        GrantOpeningDates: { set: data.GrantOpeningDates },
        AskDate: data.AskDate,
        AwardDate: data.AwardDate,
        ReportingDates: { set: data.ReportingDates },
        TypeOfReporting: data.TypeOfReporting,
        DateToReapplyForGrant: data.DateToReapplyForGrant,
        WaitingPeriodToReapply: data.WaitingPeriodToReapply,
        FundingRestrictions: data.FundingRestrictions,
        AskAmount: data.AskAmount,
        AmountAwarded: data.AmountAwarded,
        EndOfGrantReportDueDate: data.EndOfGrantReportDueDate,
        Representative: {
          connect: data.Representative.map((rep) => ({
            RepresentativeID: rep.RepresentativeID,
          })),
        },
      },
    });
    return newGrant;
  } catch (error) {
    throw new Error(`Unable to create grant: ${error}`);
  }
};

const getGrants = async () => {
  try {
    const grants = await prisma.grant.findMany();
    return grants;
  } catch (error) {
    throw new Error(`Unable to fetch grants: ${error}`);
  }
};

const getGrantById = async (id) => {
  try {
    const grant = await prisma.grant.findUnique({
      where: { GrantID: id },
      include: { Representative: true },
    });
    return grant;
  } catch (error) {
    throw new Error(`Unable to fetch grant: ${error}`);
  }
};

const updateGrant = async (id, data) => {
  try {
    const updatedGrant = await prisma.grant.update({
      where: { GrantID: id },
      data: {
        GrantName: data.GrantName,
        Years: data.Years,
        FundingAreas: { set: data.FundingAreas },
        KidsUProgram: { set: data.KidsUProgram },
        GrantOpeningDates: { set: data.GrantOpeningDates },
        AskDate: data.AskDate,
        AwardDate: data.AwardDate,
        ReportingDates: { set: data.ReportingDates },
        TypeOfReporting: data.TypeOfReporting,
        DateToReapplyForGrant: data.DateToReapplyForGrant,
        WaitingPeriodToReapply: data.WaitingPeriodToReapply,
        FundingRestrictions: data.FundingRestrictions,
        AskAmount: data.AskAmount,
        AmountAwarded: data.AmountAwarded,
        EndOfGrantReportDueDate: data.EndOfGrantReportDueDate,
        Representative: {
          set: data.Representative.map((rep) => ({
            RepresentativeID: rep.RepresentativeID,
          })),
        },
      },
    });
    return updatedGrant;
  } catch (error) {
    throw new Error(`Unable to update grant: ${error}`);
  }
};

const deleteGrant = async (id) => {
  try {
    await prisma.grant.delete({
      where: { GrantID: id },
    });
    return 'Grant deleted successfully';
  } catch (error) {
    throw new Error(`Unable to delete grant: ${error}`);
  }
};

module.exports = {
  createGrant,
  getGrants,
  getGrantById,
  updateGrant,
  deleteGrant,
};
