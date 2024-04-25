// src/pages/GrantsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MainSidebar from '../components/MainSidebar';
import './GrantsPage.css';
 
const GrantsPage = () => {
  const [grants, setGrants] = useState([]); // State to store grants data
 
  useEffect(() => {
    const fetchGrants = async () => {
      try {
        const response = await axios.get('/api/grant/getGrants'); // Endpoint to fetch grants
        setGrants(response.data); // Set grants data from the API response
      } catch (error) {
        console.error('Error fetching grants:', error);
        // Optionally handle error or set default state
      }
    };
 
    fetchGrants();
  }, []); // Dependency array left empty to run only once on component mount
 
  return (
<div className="grants-page">
<MainSidebar />
<GrantsSidebar />
<div className="grants-content">
<Breadcrumb />
<Header />
<SearchBar />
<GrantsTable grants={grants} />
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
const GrantsTable = ({ grants }) => (
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
  <th>Report Due Date</th>
  <th>Due Date</th>
  <th>Award Date</th>
  </tr>
  </thead>
  <tbody>
         {grants.map((grant) => (
  <tr key={grant.GrantID}>
  <td>{grant.Representative ? grant.Representative[0] : "N/A"}</td>
  <td>
  <Link to={`/grant/${grant.GrantID}`}>{grant.GrantName}</Link>
  </td>
  <td>{grant.AwardStatus || "Pending"}</td>
  <td>${grant.AskAmount ? grant.AskAmount?.toFixed(2) : "0.00"}</td>
  <td>${grant.AmountAwarded ? grant.AwardedAmount?.toFixed(2) : "0.00"}</td>
  <td>{grant.FundingRestrictions || "None"}</td>
  <td>{grant.EndOfGrantReportDueDate || "N/A"}</td>
  <td>{grant.DueDate || "N/A"}</td>
  <td>{grant.AwardDate || "Not Awarded Yet"}</td>
  </tr>
          ))}
  </tbody>
  </table>
  </div>
  );
  
export default GrantsPage;