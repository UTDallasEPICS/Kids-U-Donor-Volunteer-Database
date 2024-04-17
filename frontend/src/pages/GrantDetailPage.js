// src/pages/GrantDetailsPage.js
//Grant Details Page

import React from 'react';
import { useParams } from 'react-router-dom';
import './GrantDetailPage.css';
import { Link } from 'react-router-dom';
import MainSidebar from '../components/MainSidebar';
import mockGrantData from './mockGrantData';

const GrantDetailPage = () => {
  // Access the ID from the URL parameters
  const { id } = useParams();

  // Find the grant with the matching ID
  const grant = mockGrantData.find(grant => grant.GrantID === id);

  if (!grant) {
    return <div>Grant not found</div>;
  }

  return (
    <div className="grants-page">
      <MainSidebar />
      <GrantDetailsSidebar grantName={grant.GrantName} /> {/*Puts the name of the Grant on the side bar and highlights it*/}
      <div className="grants-content">
        <Breadcrumb />
        <Header />
        <SearchBar />
        <DetailsTable grant={grant} />
      </div>
    </div>
  );
};

const GrantDetailsSidebar = ({ grantName }) => (
  <div className="grant-details-sidebar">
    <ul>
      <li className="active">{grantName}</li>
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
  <div className="breadcrumb">
    Home - Grants
  </div>
);

const Header = () => (
  <div className="header">
    <h1>Grants</h1>
    <div className="header-buttons">
      <button>Add A New Grant</button>
    </div>
  </div>
);

const SearchBar = () => (
  <div className="search-bar">
    <input type="text" placeholder="Quick Search" />
    <button>Go</button>
    <button>Advanced</button>
  </div>
);


const formatDate = (dateString) => {
  if (!dateString) return "N/A"; // Check if dateString is null
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${month}/${day}/${year}`;
};

//Details Table that fills in each text box with the respective grant info
const DetailsTable = ({ grant }) => (
  <div className="gDetails-table-container">
    <table className="gDetails-table">
      <tbody>
        <tr>
          <td>
            <div className="label">Grant Name</div>
            <div className="text-box">{grant.GrantName}</div>
          </td>
          <td>
            <div className="label">Organization</div>
            <div className="text-box">{/* Populate organization here */}</div>
          </td>
          <td>
            <div className="label">Funding Area</div>
            <div className="text-box">{grant.FundingAreas.join(', ')}</div>
          </td>
        </tr>
        <tr>
          <td>
            <div className="label">KidsU Program</div>
            <div className="text-box">{grant.KidsUProgram.join(', ')}</div>
          </td>
          <td>
            <div className="label">Contact Type</div>
            <div className="text-box">{grant.ContactType}</div>
          </td>
          <td>
            <div className="label">Funding Restrictions</div>
            <div className="text-box">{grant.FundingRestrictions}</div>
          </td>
        </tr>
        <tr>
          <td>
            <div className="label">Grant Opening Dates</div>
            <div className="text-box">{grant.GrantOpeningDates.map(date => formatDate(date)).join(', ')}</div>
          </td>
          <td>
            <div className="label">End of Grant Report Due Date</div>
            <div className="text-box">{formatDate(grant.EndOfGrantReportDueDate)}</div>
          </td>
          <td>
            <div className="label">Ask Date</div>
            <div className="text-box">{formatDate(grant.AskDate)}</div>
          </td>
        </tr>
        <tr>
          <td>
            <div className="label">Award Date</div>
            <div className="text-box">{formatDate(grant.AwardDate)}</div>
          </td>
          <td>
            <div className="label">Reporting Dates</div>
            <div className="text-box">{grant.ReportingDates.map(date => formatDate(date)).join(', ')}</div>
          </td>
          <td>
            <div className="label">Date to Reapply to Grant</div>
            <div className="text-box">{formatDate(grant.DateToReapplyForGrant)}</div>
          </td>
        </tr>
        <tr>
          <td>
            <div className="label">Waiting Period to Reapply</div>
            <div className="text-box">{grant.WaitingPeriodToReapply}</div>
          </td>
          <td>
            <div className="label">Funding Restrictions</div>
            <div className="text-box">{grant.FundingRestrictions}</div>
          </td>
          <td>
            <div className="label">Ask Amount</div>
            <div className="text-box">{grant.AskAmount}</div>
          </td>
        </tr>
        <tr>
          <td>
            <div className="label">Award Status</div>
            <div className="text-box">{grant.AwardStatus}</div>
          </td>
          <td>
            <div className="label">Amount Awarded</div>
            <div className="text-box">{grant.AmountAwarded}</div>
          </td>
          <td>
            <div className="label">Representative</div>
            <div className="text-box">{grant.Representative.join(', ')}</div>
          </td>
        </tr>
        {/* Add more rows as needed */}
      </tbody>
    </table>
  </div>
);


export default GrantDetailPage;
