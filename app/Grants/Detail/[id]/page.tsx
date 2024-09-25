"use client";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

const GrantDetailPage = () => {
  const { id } = useParams();
  const [grantDetails, setGrantDetails] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrantDetails = async () => {
      try {
        const response = await axios.get(`/api/grants/${id}`);
        setGrantDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching grant details:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchGrantDetails();
    }
  }, [id]);

  const handleEditClick = () => {
    setIsEditing((prevState) => !prevState);
  };

  const handleSaveClick = async () => {
    console.log("Save button clicked"); // Add this line
    try {
      const response = await axios.put(`/api/grant/updateGrant?id=${id}`, {
        updatedData: grantDetails,
      });
      console.log("Updated grant details:", response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating grant details:", error);
      // Handle error
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setGrantDetails((prevGrantDetails: any) => {
      if (Array.isArray(prevGrantDetails[name])) {
        // If the field is an array, split the value by comma
        const values = value.split(",");
        // Check if each item can be parsed as a Date object
        const updatedValues = values.map((item: any) => {
          const date = new Date(item.trim());
          return isNaN(date.getTime()) ? item.trim() : date.toISOString(); // If it's not a valid date, keep it as string
        });
        return {
          ...prevGrantDetails,
          [name]: updatedValues,
        };
      } else if (value instanceof Date) {
        // If the value is a Date object, convert it to an ISO 8601 string
        return {
          ...prevGrantDetails,
          [name]: value.toISOString(),
        };
      } else {
        // For other cases, directly update the value
        return {
          ...prevGrantDetails,
          [name]: value,
        };
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!grantDetails) {
    return <div>Grant not found</div>;
  }

  return (
    <div className="flex font-sans">
      <div className="flex-grow p-5">
        <Breadcrumb />
        <Header
          handleEditClick={handleEditClick}
          handleSaveClick={handleSaveClick}
          isEditing={isEditing}
        />
        <SearchBar />
        <DetailsTable
          grantDetails={grantDetails}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};

const Breadcrumb = () => <div className="mb-5">Home - Grants</div>;

const Header = ({ handleEditClick, isEditing, handleSaveClick }: any) => (
  <div className="flex justify-between items-center mb-5">
    <h1>Grants</h1>
    <div className="flex justify-between items-center mb-5">
      {isEditing ? (
        <>
          <button onClick={handleSaveClick} className="p-2 ml-2">
            Save
          </button>
          <button onClick={handleEditClick} className="p-2 ml-2">
            Cancel Edit
          </button>
        </>
      ) : (
        <button onClick={handleEditClick} className="p-2 ml-2">
          Edit Grant Details
        </button>
      )}
    </div>
  </div>
);

const SearchBar = () => (
  <div className="flex mb-5">
    <input type="text" placeholder="Quick Search" className="p-2 mr-2" />
    <button className="p-2">Go</button>
    <button className="p-2 ml-2">Advanced</button>
  </div>
);

const DetailsTable = ({ grantDetails, isEditing, handleInputChange }: any) => {
  const fields = [
    { label: "Grant Name", name: "GrantName", join: false },
    { label: "Organization", name: "Organization", join: false },
    { label: "Funding Area", name: "FundingAreas", join: true },
    { label: "KidsU Program", name: "KidsUProgram", join: true },
    { label: "Contact Type", name: "ContactType", join: true },
    { label: "Funding Restrictions", name: "FundingRestrictions" },
    {
      label: "Grant Opening Dates",
      name: "GrantOpeningDates",
      join: true,
      isDate: true,
    },
    {
      label: "End of Grant Report Due Date",
      name: "EndOfGrantReportDueDate",
      isDate: true,
    },
    { label: "Ask Date", name: "AskDate", isDate: true },
    { label: "Award Date", name: "AwardDate", isDate: true },
    {
      label: "Reporting Dates",
      name: "ReportingDates",
      join: true,
      isDate: true,
    },
    {
      label: "Date to Reapply to Grant",
      name: "DateToReapplyForGrant",
      isDate: true,
    },
    { label: "Waiting Period to Reapply", name: "WaitingPeriodToReapply" },
    {
      label: "Grant Period",
      name: "GrantPeriod",
      join: true,
      joinDash: true,
      isDate: true,
    },
    { label: "Ask Amount", name: "AskAmount", isDollar: true },
    { label: "Award Status", name: "AwardStatus" },
    { label: "Amount Awarded", name: "AmountAwarded", isDollar: true },
    { label: "Representative", name: "Representative", join: true },
  ];

  // Define the number of columns in each row
  const columnsPerRow = 3;

  // Chunk the fields array into arrays of fields based on the number of columns
  const fieldRows = [];
  for (let i = 0; i < fields.length; i += columnsPerRow) {
    fieldRows.push(fields.slice(i, i + columnsPerRow));
  }

  // Calculate the width for each column
  const columnWidth = `${100 / columnsPerRow}%`;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse mb-5">
        <tbody>
          {fieldRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((field, columnIndex) => (
                <td key={columnIndex} style={{ width: columnWidth }}>
                  <div className="font-bold mb-1 text-left">{field.label}</div>
                  {isEditing ? (
                    <input
                      type="text"
                      name={field.name}
                      value={grantDetails[field.name]}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="p-2 bg-gray-100">
                      {Array.isArray(grantDetails[field.name])
                        ? field.join
                          ? field.joinDash
                            ? grantDetails[field.name]
                                .map((date: any) =>
                                  field.isDate
                                    ? new Date(date).toLocaleString()
                                    : date
                                )
                                .join(" - ")
                            : grantDetails[field.name]
                                .map((value: any) =>
                                  field.isDate
                                    ? new Date(value).toLocaleString()
                                    : value
                                )
                                .join(", ")
                          : grantDetails[field.name]
                              .map((value: any) =>
                                field.isDate
                                  ? new Date(value).toLocaleString()
                                  : value
                              )
                              .join(", ")
                        : field.isDate
                          ? new Date(grantDetails[field.name]).toLocaleString()
                          : grantDetails[field.name]}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GrantDetailPage;
