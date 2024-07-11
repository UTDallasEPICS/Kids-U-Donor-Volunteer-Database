'use client' 
//import { useState } from 'react';
import React from 'react';
import Link from 'next/link';

// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter, Route, and Routes
// import GrantsPage from './pages/GrantsPage'; // Import the GrantsPage component
// import GrantDetailPage from './pages/GrantDetailPage';  // Import the GrantDetailPage component

const home = () => {
  return (
    <div>
      <Link href= './GrantsPage'>
        Go to Grants Page
      </Link>
    </div>
  )
}


export default home