// src/pages/GrantsPage.js
'use client'
import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import MainSidebar from '../sidebar/page';
import type {Grant} from "@/prisma";
import Link from 'next/link';



import styles from "./page.module.css";
 
const GrantsPage = () => {
  const [grants, setGrants] = useState([]); // State to store grants data
 
  useEffect(() => {
    const fetchGrants = async () => {
      try {
        const response = await axios.get('/api/grant/getGrants'); // Endpoint to fetch grants
        setGrants(response.data); // Set grants data from the API response
        // Log the fetched grant data
        console.log('Fetched Grants:', response.data);
      } catch (error) {
        console.error('Error fetching grants:', error);
        // Optionally handle error or set default state
      }
    };
 
    fetchGrants();
  }, []); // Dependency array left empty to run only once on component mount
 
  return (
<div className={styles.grantsPage}>
<MainSidebar />
<GrantsSidebar />
<div className={styles.grantsContent}>
<Breadcrumb />
<Header />
<SearchBar />
<GrantsTable grants={grants} />
</div>
</div>
  );
};
 
const GrantsSidebar = () => (
<div className={styles.grantsSidebar}>
<ul>
<li className={styles.active}>Grants List</li>
<li>Add a New Grant</li>
</ul>
</div>
);
 
const Breadcrumb = () => (
<div className={styles.breadcrumb}>
    Home - Grants
</div>
);
 
const Header = () => (
<div className="header">
<h1>Grants</h1>
<div className={styles.headerButtons}>
<button>Add A New Grant</button>
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

//This table dynamically creates rows with each grant
const GrantsTable = ({ grants }:{grants:Grant[]}) => (
  <div className={styles.grantsTableContainer}>
  <table className={styles.grantsTable}>
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
  <td>${grant.AskAmount || "0.00"}</td>
  <td>${grant.AmountAwarded || "0.00"}</td>
  <td>{grant.FundingRestrictions || "None"}</td>
  <td>{grant.EndOfGrantReportDueDate?.toLocalString() || "N/A"}</td>
  <td>{grant.DueDate?.toLocaleString() || "N/A"} </td>
  <td>{grant.AwardDate?.toLocalString() || "Not Awarded Yet"}</td>
  </tr>
          ))}
  </tbody>
  </table>
  </div>
  );
  
export default GrantsPage;