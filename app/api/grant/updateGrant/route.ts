// Import necessary modules
const { PrismaClient } = require('@prisma/client');
const { URL } = require('url');

// Instantiate Prisma client
const prisma = new PrismaClient();

// Define your update function
export async function PUT(Request: Request): Promise<Response> {
  try {
    // Extract the ID from the request parameters
    const url = new URL(Request.url);
    const id = url.searchParams.get('id');

    // Extract the updated data from the request body
    const requestBody = await Request.json();
    const updatedData = requestBody.updatedData; 
    console.log(updatedData);

    let GrantDueDate = updatedData.GrantDueDate;
    GrantDueDate = new Date(GrantDueDate);
    if(GrantDueDate.toString() == "Invalid Date"){
      GrantDueDate = new Date("1970-01-01");
    }
    updatedData.GrantDueDate = GrantDueDate;

    let GrantOpeningDatesArray = [];
    console.log(updatedData.GrantOpeningDates);
    console.log(updatedData.GrantOpeningDates.length)
    for (let i =0; i < updatedData.GrantOpeningDates.length; i++){
      let GrantOpeningDates = new Date(updatedData.GrantOpeningDates[i])
      if(GrantOpeningDates.toString() == "Invalid Date"){
        GrantOpeningDates = new Date("1970-01-01");
      }
      GrantOpeningDatesArray.push(GrantOpeningDates);
    }
    console.log(GrantOpeningDatesArray);
    updatedData.GrantOpeningDates = GrantOpeningDatesArray;

    let AskDate = updatedData.AskDate;
    AskDate = new Date(AskDate);
    if(AskDate.toString() == "Invalid Date"){
      AskDate = new Date("1970-01-01");
    }
    updatedData.AskDate = AskDate;

    let AwardDate = updatedData.AwardDate;
    AwardDate = new Date(AwardDate);
    if(AwardDate.toString() == "Invalid Date"){
      AwardDate = new Date("1970-01-01");
    }
    updatedData.AwardDate = AwardDate;

    let ReportingDatesArray = [];
    console.log(updatedData.ReportingDates.length);
    for (let i =0; i < updatedData.ReportingDates.length; i++){
      let ReportingDates = new Date(updatedData.ReportingDates[i])
      if(ReportingDates.toString() == "Invalid Date"){
        ReportingDates = new Date("1970-01-01");
      }
      ReportingDatesArray.push(ReportingDates);
    }
    console.log(ReportingDatesArray)
    updatedData.ReportingDates = ReportingDatesArray;

    let DateToReapplyForGrant = updatedData.DateToReapplyForGrant;
    DateToReapplyForGrant = new Date(DateToReapplyForGrant);
    if(DateToReapplyForGrant.toString() == "Invalid Date"){
      DateToReapplyForGrant= new Date("1970-01-01");
    }
    updatedData.DateToReapplyForGrant = DateToReapplyForGrant;

    let WaitingPeriodToReapply = updatedData.WaitingPeriodToReapply;
    WaitingPeriodToReapply = parseInt(WaitingPeriodToReapply);
    if(isNaN(WaitingPeriodToReapply)){
      WaitingPeriodToReapply = 0;
    }
    updatedData.WaitingPeriodToReapply = WaitingPeriodToReapply;

    let AskAmount = updatedData.AskAmount;
    AskAmount = parseFloat(AskAmount);
    if(isNaN(AskAmount)){
      AskAmount = 0.0;
    }
    updatedData.AskAmount = AskAmount;

    let AmountAwarded = updatedData.AmountAwarded;
    AskAmount = parseFloat(AmountAwarded);
    if(isNaN(AmountAwarded)){
      AmountAwarded = 0.0;
    }
    updatedData.AmountAwarded = AskAmount;

    let EndOfGrantReportDueDate = updatedData.EndOfGrantReportDueDate;
    EndOfGrantReportDueDate = new Date(EndOfGrantReportDueDate);
    if(EndOfGrantReportDueDate.toString() == "Invalid Date"){
      EndOfGrantReportDueDate= new Date("1970-01-01");
    }
    updatedData.EndOfGrantReportDueDate = EndOfGrantReportDueDate;



    // Update the data in the database
    const updatedGrant = await prisma.Grant.update({
      where: {
        GrantID: id // Specify the condition to find the grant (e.g., by ID)
      },
      data: updatedData // Specify the updated data object
    });

    // Send the updated data as a response
    return Response.json(updatedGrant);
  } catch (error) {
    // Handle errors
    console.error('Error updating data:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}
