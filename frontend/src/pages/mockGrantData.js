// mockGrantData.js
// This is mock Grant Data to populate our fields before the Axios integration

const mockGrantData = [
    {
      GrantID: "1",
      GrantName: "Mock Grant One",
      FundingAreas: ["Education"],
      KidsUProgram: ["Afterschool Tutoring"],
      FundingRestrictions: "None",
      ContactType: "Email Grant",
      GrantOpeningDates: ["2023-01-01T00:00:00Z", "2023-02-01T00:00:00Z", "2023-03-01T00:00:00Z"],
      EndOfGrantReportDueDate: "2025-01-31T00:00:00Z",
      AskDate: "2023-06-15T00:00:00Z",
      AwardDate: null,
      ReportingDates: ["2024-01-15T00:00:00Z", "2024-07-15T00:00:00Z"],
      TypeOfReporting: "Quarterly",
      DateToReapplyForGrant: "2025-06-01T00:00:00Z",
      WaitingPeriodToReapply: 2,
      AskAmount: 50000.00,
      AwardStatus: "Declined",
      AmountAwarded: 0.00,
      Representative: ["John Doe"],
    },

    {
        GrantID: "2",
        GrantName: "Mock Grant Two",
        FundingAreas: ["Education"],
        KidsUProgram: ["Youth Empowerment"], 
        FundingRestrictions: "None",
        ContactType: "Email Grant", 
        GrantOpeningDates: ["2023-04-01T00:00:00Z", "2023-05-01T00:00:00Z", "2023-06-01T00:00:00Z"], 
        EndOfGrantReportDueDate: "2025-03-31T00:00:00Z",
        AskDate: "2023-07-15T00:00:00Z", 
        AwardDate: null,
        ReportingDates: ["2024-04-15T00:00:00Z", "2024-10-15T00:00:00Z"],
        TypeOfReporting: "Biannually", 
        DateToReapplyForGrant: "2025-07-01T00:00:00Z",
        WaitingPeriodToReapply: 3, 
        AskAmount: 5000.00, 
        AwardStatus: "Pending", 
        AmountAwarded: 0.00,
        Representative: ["Jane Smith"], 
      }
    // Add more grant objects as needed
  ];
  
  
  export default mockGrantData;