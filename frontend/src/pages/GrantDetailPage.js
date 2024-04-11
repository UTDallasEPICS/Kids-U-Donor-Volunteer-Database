import React from 'react';
import { useParams } from 'react-router-dom';
import './GrantDetailPage.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import MainSidebar from '../components/MainSidebar';  // Import MainSidebar

const GrantDetailPage = () => {
  // Access the ID from the URL parameters
  

  return (
    <div className="grants-page">
      <MainSidebar />
      <GrantDetailsSidebar />
      <div className="grants-content">
        <Breadcrumb />
        <Header />
        <SearchBar />
        <GrantsTable />
      </div>
    </div>
  );
};


const GrantDetailsSidebar = () => (
  <div className="grant-details-sidebar">
    <ul>
      <li className="active">SELECTED FOUNDATION NAME</li> {/* selected foundation name should populate here */}
      <li>{/* Make the Grants List clickable */}
          <Link to="/">Grants List</Link></li>
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

const GrantsTable = () => (
  <div className="grants-table-container">
    <table className="grants-table">
      <thead>
        <tr>
          {/* Table headers */}
        </tr>
      </thead>
      <tbody>
        {/* Add a row for "We Give Foundation" */}
        <tr>
          <td>Organization</td>
          <td>Grant Status</td>
          <td>Requested Amount</td>
          <td>Awarded Amount</td>
          <td>Restriction</td>
          <td>Submission Date</td>
          <td>Due Date</td>
          <td>Award Date</td>
          <td>Linked Donations</td>
          <td>Outstanding Fund Amount</td>
        </tr>
        {/* Other data rows */}
      </tbody>
    </table>
  </div>
);



export default GrantDetailPage;
