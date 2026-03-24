"use client"; 

import React, { useState } from "react";

import {
  Avatar,
  Box,
  TextField,
  Typography,
  Breadcrumbs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TableFooter,
  FormControl,
  Select,
  Button,

} from "@mui/material"


type User = {
  id: string;
  email: string;
  role: "Volunteer" | "Admin" | "Super_Admin";
}
export default function Promote(user: User) {
  const [users, setUsers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/super-admin/promote");
        const data = await response.json();
        setUsers(data.users);
        setLoading(false);
      } catch (error) {
          console.error("Error fetching grant details:", error);;
          setLoading(false);
      }
    }
  }

    return (
    //header//
    <>
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          Promote User to Super Admin
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Grant Super Admin access to an Admin or Volunteer.
        </Typography>
      </Box>

      //the white box container//
      <Paper elevation={1} sx={{borderRadius: 3, overflow: "hidden"}}>
        
    );


    

      function setToast(arg0: { message: string; type: "success" | "error"; }) {
        throw new Error("Function not implemented.");
      }

  