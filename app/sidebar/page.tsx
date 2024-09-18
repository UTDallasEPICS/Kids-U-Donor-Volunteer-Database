import React from 'react';

const MainSidebar = ({ children }: any) => {
  return (
    <div className= "main-sidebar bg-gray-800 text-white w-40 min-h-screen flex flex-col">
      <ul className="flex flex-col space-y-4 p-4">
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Dashboard</li>
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Constituents</li>
        <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Donations</li>
        {/* other main navigation items */}
      </ul>
      <div className="flex-grow p-4"></div>
      {children} {/* Render children components */}
    </div>
  );
};

export default MainSidebar;

