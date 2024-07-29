//Grant Details Page
'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import formatDate from '../utils/dateUtils';


import styles from "./page.module.css";
import MainSidebar from '../sidebar/page';

const GrantDetailPage = () => {
  const { id } = useParams();
  const [grantDetails, setGrantDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrantDetails = async () => {
      try {
        const response = await axios.get(`/api/grant/getGrant?id=${id}`);
        setGrantDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching grant details:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchGrantDetails();
    }
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(prevState => !prevState);
  };

  const handleSaveClick = async () => {
    console.log("Save button clicked"); // Add this line
    try {
      const response = await axios.put(`/api/grant/updateGrant?id=${id}`, {
        updatedData: grantDetails
      });
      console.log("Updated grant details:", response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating grant details:', error);
      // Handle error
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGrantDetails(prevGrantDetails => {
      if (Array.isArray(prevGrantDetails[name])) {
        // If the field is an array, split the value by comma
        const values = value.split(',');
        // Check if each item can be parsed as a Date object
        const updatedValues = values.map(item => {
          const date = new Date(item.trim());
          return isNaN(date.getTime()) ? item.trim() : date.toISOString(); // If it's not a valid date, keep it as string
        });
        return {
          ...prevGrantDetails,
          [name]: updatedValues
        };
      } else if (value instanceof Date) {
        // If the value is a Date object, convert it to an ISO 8601 string
        return {
          ...prevGrantDetails,
          [name]: value.toISOString()
        };
      } else {
        // For other cases, directly update the value
        return {
          ...prevGrantDetails,
          [name]: value
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
    <div className={styles.grantsPage}>
      <MainSidebar />
      <GrantDetailsSidebar grantName={grantDetails.GrantName} />
      <div className={styles.grantsContent}>
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

const GrantDetailsSidebar = ({ grantName }) => (
  <div className={styles.grantsDetailsSidebar}>
    <ul>
      <li className={styles.active}>{grantName}</li>
      <li><Link to="/">Grants List</Link></li>
      <li>Grants Budget</li>
      <li>Grant Expenses</li>
      <li>Grant Notes</li>
      <li>Add a New Task</li>
      <li>Add a New Budget</li>
      <li>Add a New Expense</li>
      <li>Add a New Notes</li>
    </ul>
  </div>
);

const Breadcrumb = () => (
  <div className={styles.breadCrumb}>
    Home - Grants
  </div>
);

const Header = ({ handleEditClick, isEditing, handleSaveClick }) => (
  <div className={styles.header}>
    <h1>Grants</h1>
    <div className={styles.headerButtons}>
      {isEditing ? (
        <>
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleEditClick}>Cancel Edit</button>
        </>
      ) : (
        <button onClick={handleEditClick}>Edit Grant Details</button>
      )}
    </div>
  </div>
);

const SearchBar = () => (
  <div className={styles.searchBar}>
    <input type="text" placeholder="Quick Search" />
    <button>Go</button>
    <button>Advanced</button>
  </div>
);



const DetailsTable = ({ grantDetails, isEditing, handleInputChange }) => {
  const fields = [
    { label: 'Grant Name', name: 'GrantName', join: false },
    { label: 'Organization', name: 'Organization', join: false },
    { label: 'Funding Area', name: 'FundingAreas', join: true },
    { label: 'KidsU Program', name: 'KidsUProgram', join: true },
    { label: 'Contact Type', name: 'ContactType', join: true },
    { label: 'Funding Restrictions', name: 'FundingRestrictions' },
    { label: 'Grant Opening Dates', name: 'GrantOpeningDates', join: true , isDate: true},
    { label: 'End of Grant Report Due Date', name: 'EndOfGrantReportDueDate', isDate: true },
    { label: 'Ask Date', name: 'AskDate', isDate: true },
    { label: 'Award Date', name: 'AwardDate', isDate: true },
    { label: 'Reporting Dates', name: 'ReportingDates', join: true, isDate:true },
    { label: 'Date to Reapply to Grant', name: 'DateToReapplyForGrant', isDate: true },
    { label: 'Waiting Period to Reapply', name: 'WaitingPeriodToReapply' },
    { label: 'Grant Period', name: 'GrantPeriod', join: true, joinDash: true, isDate: true },
    { label: 'Ask Amount', name: 'AskAmount', isDollar: true },
    { label: 'Award Status', name: 'AwardStatus' },
    { label: 'Amount Awarded', name: 'AmountAwarded', isDollar: true },
    { label: 'Representative', name: 'Representative', join: true },
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
    <div className={styles.gDetailsTableContainer}>
      <table className={styles.gDetailsTable}>
        <tbody>
          {fieldRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((field, columnIndex) => (
                <td key={columnIndex} style={{ width: columnWidth }}>
                  <div className={styles.label}>{field.label}</div>
                  {isEditing ? (
                    <input
                      type="text"
                      name={field.name}
                      value={grantDetails[field.name]}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className={styles.textBox}>
                      {Array.isArray(grantDetails[field.name]) ? (
                        field.join ? (
                          field.joinDash ? (
                            grantDetails[field.name].map(date => field.isDate ? formatDate(date) : date).join(' - ')
                          ) : (
                            grantDetails[field.name].map(value => field.isDate ? formatDate(value) : value).join(', ')
                          )
                        ) : (
                          grantDetails[field.name].map(value => field.isDate ? formatDate(value) : value).join(', ')
                        )
                      ) : (
                        field.isDate ? formatDate(grantDetails[field.name]) : grantDetails[field.name]
                        
                      )}
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
