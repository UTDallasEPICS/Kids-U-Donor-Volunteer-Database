// src/pages/GrantsPage.js
'use client'
import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import MainSidebar from '../sidebar/page';
import type {Grant} from "@/prisma";
import Link from 'next/link';



// import styles from "./page.module.css";
 
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
<div className={"flex font-sans"}>
<MainSidebar />

<div className="flex-grow p-5">
<Breadcrumb />
<Header />
<SearchBar />
<GrantsTable grants={grants} />
</div>
</div>
  );
};
 

 
const Breadcrumb = () => (
<div className="mb-5 text-sm text-gray-600 flex items-center space-x-2">
    <span className="hover:text-blue-500 cursor-pointer transition-colors duration-200">Home</span>
    <span className="text-gray-400">/</span>
    <span className="font-semibold text-gray-700">Grants</span>
</div>
);
 
const Header = () => (
<div className="flex justify-between items-center mb-5">
<h1 className="text-2xl font-bold text-gray-800">Grants</h1>
<div className="px-4 py-2 ml-2">
<button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">Add A New Grant</button>
</div>
</div>
);
 
const SearchBar = () => (
<div className="flex mb-5">
<input type="text" placeholder="Quick Search" 
className="p-2 border border-gray-300 rounded-l-md focus:outline focus:ring-2 focus:ring-blue-500" />
<button className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors duration-200">Go</button>
<button className="px-4 py-2 ml-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200">Advanced</button>
</div>
);

//This table dynamically creates rows with each grant
const GrantsTable = ({ grants }:{grants:Grant[]}) => (
  <div className="overflow-x-auto">
  <table className="w-full border-collapse mb-5">
  <thead>
  <tr>
  <th className="border border-gray-300 p-2 bg-gray-100">Organization</th>
  <th className="border border-gray-300 p-2 bg-gray-100">Grant Name</th>
  <th className="border border-gray-300 p-2 bg-gray-100">Grant Status</th>
  <th className="border border-gray-300 p-2 bg-gray-100">Requested Amount</th>
  <th className="border border-gray-300 p-2 bg-gray-100">Awarded Amount</th>
  <th className="border border-gray-300 p-2 bg-gray-100">Restriction</th>
  <th className="border border-gray-300 p-2 bg-gray-100">Report Due Date</th>
  <th className="border border-gray-300 p-2 bg-gray-100">Due Date</th>
  <th className="border border-gray-300 p-2 bg-gray-100">Award Date</th>
  </tr>
  </thead>
  <tbody>
         {grants.map((grant) => (
  <tr key={grant.GrantID}>
  <td className="border border-gray-300 p-2">{grant.Representative ? grant.Representative[0].FirstName : "N/A"}</td>
  <td className="border border-gray-300 p-2">
  <Link href={`/grant/${grant.GrantID}`}>{grant.GrantName}</Link>
  </td>
  <td className="border border-gray-300 p-2">{grant.AwardStatus || "Pending"}</td>
  <td className="border border-gray-300 p-2">${grant.AskAmount || "0.00"}</td>
  <td className="border border-gray-300 p-2">${grant.AmountAwarded || "0.00"}</td>
  <td className="border border-gray-300 p-2">{grant.FundingRestrictions || "None"}</td>
  <td className="border border-gray-300 p-2">{grant.EndOfGrantReportDueDate?.toLocaleString() || "N/A"}</td>
  <td className="border border-gray-300 p-2">{grant.DueDate?.toLocaleString() || "N/A"} </td>
  <td className="border border-gray-300 p-2">{grant.AwardDate?.toLocaleString() || "Not Awarded Yet"}</td>
  </tr>
          ))}
  </tbody>
  </table>
  </div>
  );
  
export default GrantsPage;