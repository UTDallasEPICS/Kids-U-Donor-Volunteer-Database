'use client' 
//import { useState } from 'react';
import React from 'react';
import Link from 'next/link';

// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter, Route, and Routes
// import GrantsPage from './pages/GrantsPage'; // Import the GrantsPage component
// import GrantDetailPage from './pages/GrantDetailPage';  // Import the GrantDetailPage component

export default function Home() {
  return (
    <div>
      <Link href= './pages/GrantsPage'>
        <a>Go to Grants Page</a>
      </Link>
    </div>
  )
}



