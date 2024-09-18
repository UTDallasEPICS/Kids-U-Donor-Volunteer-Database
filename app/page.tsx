'use client' 
//import { useState } from 'react';
import React from 'react';
import Link from 'next/link';

// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter, Route, and Routes
// import GrantsPage from './pages/GrantsPage'; // Import the GrantsPage component
// import GrantDetailPage from './pages/GrantDetailPage';  // Import the GrantDetailPage component

const home = () => {
  return (
    <div className="flex justify-between items-center mb-5">
      <Link href= './GrantsPage'>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">Go to Grants Page</button>
      </Link>
    </div>
  )
}


export default home