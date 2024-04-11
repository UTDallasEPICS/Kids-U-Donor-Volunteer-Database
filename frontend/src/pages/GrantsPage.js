// src/pages/GrantsPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import MainSidebar from '../components/MainSidebar';  // Import MainSidebar
import './GrantsPage.css';

const GrantsPage = () => {
  return (
    <div className="grants-page">
      <MainSidebar />
      <GrantsSidebar />
      <div className="grants-content">
        <Breadcrumb />
        <Header />
        <SearchBar />
        <GrantsTable />
      </div>
    </div>
  );
};


const GrantsSidebar = () => (
  <div className="grants-sidebar">
    <ul>
      <li className="active">Grants List</li>
      <li>Add a New Grant</li>
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
        <tr>
        <td>
          {/* Make the Grant Name clickable */}
          <Link to="/grant/1">We Give Foundation</Link>
        </td>
        </tr>
        {/* Other data rows */}
      </tbody>
    </table>
  </div>
);


export default GrantsPage;
