import React from 'react';

const MainSidebar = ({ children: any }:) => {
  return (
    <div className= "main-sidebar">
      <ul>
        <li>Dashboard</li>
        <li>Constituents</li>
        <li>Donations</li>
        {/* other main navigation items */}
      </ul>
      {any} {/* Render children components */}
    </div>
  );
};

export default MainSidebar;

