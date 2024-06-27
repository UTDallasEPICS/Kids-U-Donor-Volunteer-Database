import React from "react"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter, Route, and Routes
import GrantsPage from './pages/GrantsPage'; // Import the GrantsPage component
import GrantDetailPage from './pages/GrantDetailPage'; // Import the GrantDetailPage component

const Home = () => {
  return (
    <Router> {/* Wrap your components with the Router component */}
    <div className="App">
      <Routes> {/* Use the Routes component */}
        <Route path="/" element={<GrantsPage />} /> {/* Define the route for the GrantsPage */}
        <Route path="/grant/:id" element={<GrantDetailPage />} /> {/* Define the route for the GrantDetailPage */}
      </Routes>
    </div>
  </Router>
  )
}

export default Home