// src/pages/GrantsPage.js
import React from 'react';
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

const MainSidebar = () => (
  <div className="main-sidebar">
    <ul>
      <li>Dashboard</li>
      <li>Constituents</li>
      <li>Donations</li>
      {/* other main navigation items */}
    </ul>
  </div>
);

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
    Home > Grants
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
          <th>Organization</th>
          <th>Grant Name</th>
          <th>Grant Status</th>
          <th>Requested Amount</th>
          <th>Awarded Amount</th>
          <th>Restriction</th>
          <th>Submission Date</th>
          <th>Due Date</th>
          <th>Award Date</th>
          <th>Linked Donations</th>
          <th>Outstanding Fund Amount</th>
        </tr>
      </thead>
      <tbody>
        {/* Data rows will be dynamically generated from data */}
      </tbody>
    </table>
  </div>
);

export default GrantsPage;
