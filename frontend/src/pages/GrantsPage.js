// src/pages/GrantsPage.js
//This is the GrantLists page
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import MainSidebar from '../components/MainSidebar';  // Import MainSidebar
import './GrantsPage.css';
import mockGrantData from './mockGrantData'; //import mockgrantdata

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

//This table dynamically creates rows with each grant
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
        {mockGrantData.map((grant) => (
          <tr key={grant.GrantID}>
            <td>{/* Render organization name here */}</td>
            <td>
              {/* Make the Grant Name clickable with dynamic URL based on grant ID*/}
              <Link to={`/grant/${grant.GrantID}`}>{grant.GrantName}</Link>
            </td>
            <td>{/* Render grant status here */}</td>
            <td>{/* Render requested amount here */}</td>
            <td>{/* Render awarded amount here */}</td>
            <td>{/* Render restriction here */}</td>
            <td>{/* Render submission date here */}</td>
            <td>{/* Render due date here */}</td>
            <td>{/* Render award date here */}</td>
            <td>{/* Render linked donations here */}</td>
            <td>{/* Render outstanding fund amount here */}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


export default GrantsPage;