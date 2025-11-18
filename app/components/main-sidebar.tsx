"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SubmenuItem = {
  name: string;
  reference: string;
};

type SidebarItem = {
  name: string;
  reference: string;
  hasSubmenu?: boolean;
  submenuItems?: SubmenuItem[];
};

type MainSidebarProps = {
  items: SidebarItem[];
};

const iconMap: { [key: string]: React.ReactNode } = {
  "Dashboard": (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  "Donations": (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  "Donors": (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  "Grants": (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  "Volunteers": (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
};

export default function MainSidebar({ items }: MainSidebarProps) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  const toggleDropdown = (itemName: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const isSubmenuActive = (submenuItems?: SubmenuItem[]) => {
    if (!submenuItems) return false;
    return submenuItems.some(subItem => pathname === subItem.reference);
  };

  if (!items || !Array.isArray(items)) {
    return <div>No sidebar items</div>;
  }

  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto z-40 flex flex-col">
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item, index) => {
          const isActive = pathname === item.reference || (item.reference === "./" && pathname === "/admin");
          const hasActiveSubmenu = isSubmenuActive(item.submenuItems);
          const isDropdownOpen = openDropdowns.has(item.name);
          const shouldHighlight = isActive || hasActiveSubmenu;
          
          return (
            <div key={index}>
              <div className={`rounded-lg overflow-hidden ${
                shouldHighlight ? "bg-blue-50" : ""
              }`}>
                <button
                  onClick={() => item.hasSubmenu ? toggleDropdown(item.name) : window.location.href = item.reference}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                    shouldHighlight
                      ? "text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  } ${!shouldHighlight ? "rounded-lg" : ""}`}
                >
                  <span className={shouldHighlight ? "text-blue-600" : "text-gray-400"}>
                    {iconMap[item.name] || "📄"}
                  </span>
                  <span className="text-sm flex-1 text-left">{item.name}</span>
                  
                  {item.hasSubmenu && (
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-90" : ""
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>

                {/* Dropdown Submenu */}
                {item.hasSubmenu && item.submenuItems && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isDropdownOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pb-2 px-2 space-y-1">
                      {item.submenuItems.map((subItem, subIndex) => {
                        const isSubActive = pathname === subItem.reference;
                        return (
                          <Link
                            key={subIndex}
                            href={subItem.reference}
                            className={`block px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                              isSubActive
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-blue-100/50 hover:text-gray-900"
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          © 2025 Kids University
        </p>
        <p className="text-xs text-gray-400 text-center mt-1">
          All rights reserved
        </p>
      </div>
    </aside>
  );
}
