"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import logo from '/app/logo.png';


export default function AdminDashboard() {
  const [totalVolunteers, setTotalVolunteers] = useState<number | null>(null);
  const [totalDonors, setTotalDonors] = useState<number | null>(null);
  const [totalGrants, setTotalGrants] = useState<number | null>(null);
  const [volunteerHours, setVolunteerHours] = useState<number | null>(null);
  const [averageDonation, setAverageDonation] = useState<number | null>(null);
  const [pendingGrants, setPendingGrants] = useState<number | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");


  useEffect(() => {
    Promise.all([
      fetch('/api/admin/dashboard/box1').then(res => res.json()),
      fetch('/api/admin/dashboard/box2').then(res => res.json()),
      fetch('/api/admin/dashboard/box7/hours').then(res => res.json()),
      fetch('/api/admin/dashboard/box7/donation').then(res => res.json()),
      fetch('/api/admin/dashboard/box7/grants').then(res => res.json()),
      fetch('/api/admin/dashboard/box6').then(res => res.json()),
    ]).then(([volunteers, donors, hours, donation, grants, tasksData]) => {
      setTotalVolunteers(volunteers.total);
      setTotalDonors(donors.total);
      setVolunteerHours(hours.total);
      setAverageDonation(donation.average);
      setPendingGrants(grants.total);
      setTasks(tasksData);
    }).catch(err => console.error('Failed to fetch dashboard data:', err));
  }, []);


  const handleAddTask = async () => {
    if (newTask.trim()) {
      const res = await fetch('/api/admin/dashboard/box6', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask, completed: false })
      });
      const createdTask = await res.json();
      setTasks([...tasks, createdTask]);
      setNewTask("");
    }
  };


  const handleToggle = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const res = await fetch(`/api/admin/dashboard/box6/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: task.title, completed: !task.completed })
    });
    const updatedTask = await res.json();
    setTasks(tasks.map(t => t.id === id ? updatedTask : t));
  };


  const handleDelete = async (id: number) => {
    await fetch(`/api/admin/dashboard/box6/${id}`, { method: "DELETE" });
    setTasks(tasks.filter(task => task.id !== id));
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Top Row */}
      <div className="flex items-center gap-6 mb-6">
        {/* Stats Cards */}
        <div className="flex-1 grid grid-cols-3 gap-5">
          {/* Total Grants */}
          <div className="bg-[#7FA7D8] rounded-3xl p-7 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-2">{totalGrants !== null ? totalGrants : '0'}</p>
                <p className="text-base">Total Grants</p>
              </div>
              <div className="bg-white/30 p-3 rounded-xl">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>


          {/* Total Donors */}
          <div className="bg-[#4C7AB8] rounded-3xl p-7 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-2">{totalDonors !== null ? totalDonors : '0'}</p>
                <p className="text-base">Total Donors</p>
              </div>
              <div className="bg-white/30 p-3 rounded-xl">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>


          {/* Total Volunteers */}
          <div className="bg-[#2D4A7C] rounded-3xl p-7 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold mb-2">{totalVolunteers !== null ? totalVolunteers : '0'}</p>
                <p className="text-base">Total Volunteers</p>
              </div>
              <div className="bg-white/30 p-3 rounded-xl">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>


        {/* Logo */}
        <div className="w-64 flex-shrink-0 flex justify-end">
          <Image
            src={logo}
            alt="Kids University Logo"
            width={220}
            height={101}
            className="object-contain"
          />
        </div>
      </div>


      {/* Campaign Metrics*/}
      <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-max gap-5 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Campaign Performance</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="35" fill="none" stroke="#D1D5DB" strokeWidth="20" strokeDasharray="27 190" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="#DC2626" strokeWidth="20" strokeDasharray="14 190" strokeDashoffset="-27" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="#991B1B" strokeWidth="20" strokeDasharray="21 190" strokeDashoffset="-41" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="#3B82F6" strokeWidth="20" strokeDasharray="20 190" strokeDashoffset="-62" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="#60A5FA" strokeWidth="20" strokeDasharray="13 190" strokeDashoffset="-82" />
              </svg>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
              <span className="text-gray-700">Special Projects 27%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
              <span className="text-gray-700">Tutoring 14%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-900 rounded-sm"></div>
              <span className="text-gray-700">Corporate Events 21%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              <span className="text-gray-700">General 20%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
              <span className="text-gray-700">Holiday Events 13%</span>
            </div>
          </div>
        </div>


        {/* Key Metrics */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-5">Key Metrics</h3>
          <div className="space-y-5">
            <div>
              <p className="text-sm text-gray-600 mb-1">Volunteer Hours Logged</p>
              <p className="text-3xl font-bold text-gray-900">{volunteerHours !== null ? `${volunteerHours} hrs` : '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Donation Amount</p>
              <p className="text-3xl font-bold text-gray-900">{averageDonation !== null ? `$${averageDonation.toFixed(0)}` : '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Grant Applications</p>
              <p className="text-3xl font-bold text-gray-900">{pendingGrants !== null ? pendingGrants : '-'}</p>
            </div>
          </div>
        </div>


        {/* Tasks */}
        <div className="bg-white rounded-2xl p-6 shadow-sm row-span-2 flex flex-col">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Tasks</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              placeholder="Add a task"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={handleAddTask}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Add
            </button>
          </div>
          
          <div className="flex-1 space-y-2 overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No tasks yet</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg group">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <span className={`flex-1 text-sm ${task.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                    {task.title}
                  </span>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-gray-300 hover:text-red-500 text-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Volunteer Hours Progress Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm col-span-2 self-start">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Volunteer Hours</h3>
          <p className="text-sm text-gray-600 mb-3">
            {volunteerHours !== null ? volunteerHours : 0}/10,000 hrs
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-[#4C7AB8] h-4 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(((volunteerHours || 0) / 10000) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}