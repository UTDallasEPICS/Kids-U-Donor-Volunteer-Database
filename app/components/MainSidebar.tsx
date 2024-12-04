import React from "react";
import Link from "next/link";

export default function MainSidebar() {
  return (
    <div className="bg-gray-800 text-white w-[8rem] min-h-screen flex flex-col">
      <ul className="flex flex-col space-y-4 p-2">
        <li className="hover:bg-gray-600 p-1 rounded cursor-pointer">
          <Link href="/">Dashboard</Link>
        </li>
        <li className="hover:bg-gray-600 p-1 rounded cursor-pointer">
          <Link href="/Constituents">Constituents</Link>
        </li>
        <li className="hover:bg-gray-600 p-1 rounded cursor-pointer">
          <Link href="/Donations">Donations</Link>
        </li>
        <li className="hover:bg-gray-600 p-1 rounded cursor-pointer">
          <Link href="/Grants">Grants</Link>
        </li>
        <li className="hover:bg-gray-600 p-1 rounded cursor-pointer">
          <Link href="/Volunteers">Volunteers</Link>
        </li>
      </ul>
    </div>
  );
}
