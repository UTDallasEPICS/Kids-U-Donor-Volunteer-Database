"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {Checkbox, TextField, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { PieChart } from "@mui/x-charts/PieChart";
import LinearProgress from "@mui/material/LinearProgress/LinearProgress";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import IconButton from '@mui/material/IconButton';


const theme = createTheme({
  palette: {
    primary: {
      main: "#FFEAF1",
    },
    secondary: {
      main: "#FFF2D8",
    },
    success: {
      main: "#D5FFDE",
    },
    info: {
      main: "#ECCBFF",
    },
    warning: {
      main: "#D093FF",
    },
    text: {
      primary: "#000000",
    },
  },
});



function TasksBox() {
  type Task = {
    id: number;
    title: string;
    completed: boolean;
  };  
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  // Fetch tasks from API on mount
  useEffect(() => {
    fetch('/api/admin/dashboard/box6')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Failed to fetch tasks:", err));
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim()) {
      const res = await fetch('/api/admin/dashboard/box6', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask, completed: false })
      });
      const createdTask = await res.json();
      console.log('Created task:', createdTask); 
      setTasks([...tasks, createdTask]);
      setNewTask("");
    }
  };

  const handleToggle = async (id: any) => {
    const task = tasks.find(t => t.id === id);
    if (!task) {
      // Optionally show a warning or just return
      console.warn(`Task with id ${id} not found.`);
      return;
    }
    const res = await fetch(`/api/admin/dashboard/box6/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: task.title, completed: !task.completed })
    });
    const updatedTask = await res.json();
    setTasks(tasks.map(t => t.id === id ? updatedTask : t));
  };

  const handleDelete = async (id: any) => {
    await fetch(`/api/admin/dashboard/box6/${id}`, { method: "DELETE" });
    setTasks(tasks.filter(task => task.id !== id));
  };
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", marginBottom: 2 }}>
        Tasks
      </Typography>
      <Box>
        <TextField
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Add a task"
          size="small"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTask();
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#08111f' },
              '&:hover fieldset': { borderColor: '#2d4e8a' },
              '&.Mui-focused fieldset': { borderColor: '#08111f' },
            },
          }}
        />
        <Button
          onClick={handleAddTask}
          variant="contained"
          sx={{
            backgroundColor: "#08111f",
            color: "#fff",
            borderRadius: "16px",
            textTransform: "none",
            marginLeft: 1,
            "&:hover": { backgroundColor: "#112244" },
          }}
        >Add</Button>
      </Box>
      {tasks.map(task => (
        <Box key={task.id} display="flex" alignItems="center" mb={1}>
          <Checkbox checked={task.completed} onChange={() => handleToggle(task.id)} />
          <Typography
            variant="body1"
            sx={{ textDecoration: task.completed ? "line-through" : "none" }}
          >
            {task.title}
          </Typography>
          <IconButton
            onClick={() => handleDelete(task.id)}
            size="small"
            sx={{
              color: '#08111f',
              marginLeft: 'auto',
              borderRadius: '50%',
            }}
            aria-label="delete"
          >
            <span style={{ fontSize: 18, fontWeight: 'bold', lineHeight: 1 }}>×</span>
          </IconButton>
        </Box>
      ))}
    </Box>
  );

}


export default function Home() {
  
  //for box 1
  const [totalVolunteers, setTotalVolunteers] = React.useState<number | null>(null);
    React.useEffect(() => {
      fetch('/api/admin/dashboard/box1')
        .then(res => res.json())
        .then(data => setTotalVolunteers(data.total))
        .catch(() => setTotalVolunteers(null));
    }, []);
    //for box 2
    const [totalDonors, setTotalDonors] = React.useState<number | null>(null);
    React.useEffect(() => {
      fetch('/api/admin/dashboard/box2')
        .then(res => res.json())
        .then(data => setTotalDonors(data.total))
        .catch(() => setTotalDonors(null));
    }, []);
    //for box 3
    const [totalGrants, setTotalGrants] = React.useState<number | null>(null);
    React.useEffect(() => {
      fetch('/api/admin/dashboard/box2')
        .then(res => res.json())
        .then(data => setTotalGrants(data.total))
        .catch(() => setTotalGrants(null));
    }, []);
    //for boxes 4 & 5
    type Event = {
      id: string;
      name: string;
      schedule: string;
    };
    const [events, setEvents] = useState<Event[]>([]);
    useEffect(() => {
      fetch('/api/admin/dashboard/box4')
        .then(res => res.json())
        .then(data => setEvents(data))
        .catch(() => setEvents([]));;
    }, []);
    //for box 7
    const [volunteerHours, setVolunteerHours] = React.useState<number | null>(null);
    const [averageDonation, setAverageDonation] = React.useState<number | null>(null);
    const [pendingGrants, setPendingGrants] = React.useState<number | null>(null);

    React.useEffect(() => {
      fetch('/api/admin/dashboard/box7/hours')
        .then(res => res.json())
        .then(data => setVolunteerHours(data.total))
        .catch(() => setVolunteerHours(null));
    }, []);

    React.useEffect(() => {
      fetch('/api/admin/dashboard/box7/donation')
        .then(res => res.json())
        .then(data => setAverageDonation(data.average))
        .catch(() => setAverageDonation(null));
    }, []);

    React.useEffect(() => {
      fetch('/api/admin/dashboard/box7/grants')
        .then(res => res.json())
        .then(data => setPendingGrants(data.total))
        .catch(() => setPendingGrants(null));
    }, []);
    //for box8
    const [fundraising, setFundraising] = React.useState<{ raised: number, goal: number } | null>(null);

    React.useEffect(() => {
      fetch('/api/admin/dashboard/box8')
        .then(res => res.json())
        .then(data => setFundraising(data))
        .catch(() => setFundraising(null));
    }, []);
    
    

  return (
    <ThemeProvider theme={theme}>
      <Box>
        {/* Box 1: Total Volunteers */}
        <Box
          sx={{
            width: 230,
            height: 137,
            borderRadius: 0,
            bgcolor: "primary.main",
            position: "absolute",
            top: "60%",
            left: "70%",
            transform: "translate(-315%, -255%)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", padding: 2, color: "text.primary" }}>
            {totalVolunteers !== null ? totalVolunteers : "-"}
          </Typography>
          <Typography variant="subtitle1" sx={{ paddingLeft: 2, color: "text.primary" }}>
            Total Volunteers
          </Typography>
        </Box>

        {/* Box 2: Total Donors */}
        <Box
          sx={{
            width: 230,
            height: 137,
            borderRadius: 0,
            bgcolor: "secondary.main",
            position: "absolute",
            top: "60%",
            left: "70%",
            transform: "translate(-205%, -255%)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", padding: 2, color: "text.primary" }}>
            {totalDonors !== null ? totalDonors : "-"}
          </Typography>
          <Typography variant="subtitle1" sx={{ paddingLeft: 2, color: "text.primary" }}>
            Total Donors
          </Typography>
        </Box>

        {/* Box 3: Total Grants */}
        <Box
          sx={{
            width: 230,
            height: 137,
            borderRadius: 0,
            bgcolor: "success.main",
            position: "absolute",
            top: "60%",
            left: "70%",
            transform: "translate(-95%, -255%)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", padding: 2, color: "text.primary" }}>
            {totalGrants !== null ? totalGrants : "-"}
          </Typography>
          <Typography variant="subtitle1" sx={{ paddingLeft: 2, color: "text.primary" }}>
            Total Grants
          </Typography>
        </Box>

        {/* Box 4: Upcoming Events */}
        <Box
          sx={{
            width: 357,
            minHeight: 137,
            bgcolor: "info.main",
            position: "absolute",
            top: "60%",
            left: "70%",
            transform: "translate(14%, -255%)",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)",
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", marginBottom: 1 }}>
            Upcoming Events
          </Typography>
          {events.length === 0 ? (
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              No upcoming events
            </Typography>
          ) : (
            events.map(event => {
              const eventDate = new Date(event.schedule);
              const now = new Date();
              const daysLeft = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <Box key={event.id} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body1" sx={{ color: "text.primary", fontWeight: "bold" }}>
                    {event.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    {daysLeft > 0 ? `In ${daysLeft} day${daysLeft > 1 ? "s" : ""}` : "Today"}
                  </Typography>
                </Box>
              );
            })
          )}
        </Box>

      
          {/* Box 5: Days Till Next Event */}
        <Box
            sx={{
              width: 106,
              height: 137,
              bgcolor: "warning.main",
              position: "absolute",
              top: "60%",
              left: "70%",
              transform: "translate(275%, -255%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              //boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)",
              padding: 1,
              gap: 0.5,
            }}
          >
            <CalendarTodayIcon sx={{ fontSize: 36, color: "text.primary", mb: 0.5 }} />
            <Typography
              variant="caption"
              sx={{
                color: "text.primary",
                fontWeight: 500,
                fontSize: 12,
                textAlign: "center",
                letterSpacing: 1,
              }}
            >
              Next Event In:
            </Typography>
            {events.length === 0 ? (
              <Typography
                variant="h5"
                sx={{
                  color: "text.primary",
                  fontWeight: "bold",
                  textAlign: "center",
                  mt: 1,
                }}
              >
                --
              </Typography>
            ) : (
              (() => {
                const eventDate = new Date(events[0].schedule);
                const now = new Date();
                const daysLeft = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <Typography
                    variant="h3"
                    sx={{
                      color: "text.primary",
                      fontWeight: "bold",
                      textAlign: "center",
                      mt: 1,
                      fontSize: 36,
                    }}
                  >
                    {daysLeft}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: "text.primary",
                        fontWeight: "normal",
                        fontSize: 14,
                        ml: 0.5,
                      }}
                    >
                      days
                    </Typography>
                  </Typography>
                );
              })()
            )}
          </Box>
          



        {/* Box 6: Tasks */}
        <Box
          sx={{
            width: 360,
            height: 489,
            borderRadius: 0,
            bgcolor: "#FFFFFF",
            position: "absolute",
            top: "60%",
            left: "70%",
            transform: "translate(10%, -38%)",
            boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)",
            overflowY: "auto",
            padding: 2,
          }}
        >
          <TasksBox />
        </Box>


        {/* Box 7: Key Metrics */}
        <Box
            sx={{
            width: 357,
            height: 333,
            bgcolor: "#FFFFFF",
            position: "absolute",
            top: "60%",
            left: "70%",
            transform: "translate(-97%, -56%)",
            boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", marginBottom: 2 }}>
            Key Metrics
          </Typography>

          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "text.primary" }}>
              Volunteer Hours Logged
            </Typography>
            <Typography variant="h5" sx={{ color: "text.primary" }}>
              {volunteerHours !== null ? `${volunteerHours} hrs` : "-"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "text.primary" }}>
              Average Donation Amount
            </Typography>
            <Typography variant="h5" sx={{ color: "text.primary" }}>
              {averageDonation !== null ? `$${averageDonation.toFixed(2)}` : "-"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "text.primary" }}>
              Pending Grant Applications
            </Typography>
            <Typography variant="h5" sx={{ color: "text.primary" }}>
              {pendingGrants !== null ? pendingGrants : "-"}
            </Typography>
          </Box>
        </Box>


        {/* Box 8: Campaign Performance */}
        <Box
          sx={{
            width: 357,
            height: 333,
            bgcolor: "#FFFFFF",
            position: "absolute",
            top: "60%",
            left: "70%",
            transform: "translate(-203%, -56%)",
            boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              marginBottom: "16px",
            }}
          >
            Campaign Performance
          </Typography>

          <PieChart
            width={370}
            height={200}
            series={[
              {
                data: [
                  { id: 1, value: 20, label: "Medical" },
                  { id: 2, value: 20, label: "General" },
                  { id: 3, value: 20, label: "Education" },
                  { id: 4, value: 20, label: "Clothing" },
                  { id: 5, value: 20, label: "Holiday Event" },
                ],
              },
            ]}
            legend={{ hidden: true }}
          />
          <Box>
            <Typography variant="body2" sx={{ color: "text.primary", marginBottom: 1 }}>
              <Box
                component="span"
                sx={{ backgroundColor: "#00BCD4", width: 12, height: 12, display: "inline-block", marginRight: 1 }}
              />{" "}
              Medical
            </Typography>
            <Typography variant="body2" sx={{ color: "text.primary", marginBottom: 1 }}>
              <Box
                component="span"
                sx={{ backgroundColor: "#2196F3", width: 12, height: 12, display: "inline-block", marginRight: 1 }}
              />{" "}
              General
            </Typography>
            <Typography variant="body2" sx={{ color: "text.primary", marginBottom: 1 }}>
              <Box
                component="span"
                sx={{ backgroundColor: "#9C27B0", width: 12, height: 12, display: "inline-block", marginRight: 1 }}
              />{" "}
              Education
            </Typography>
            <Typography variant="body2" sx={{ color: "text.primary", marginBottom: 1 }}>
              <Box
                component="span"
                sx={{ backgroundColor: "#673AB7", width: 12, height: 12, display: "inline-block", marginRight: 1 }}
              />{" "}
              Clothing
            </Typography>
            <Typography variant="body2" sx={{ color: "text.primary", marginBottom: 1 }}>
              <Box
                component="span"
                sx={{ backgroundColor: "#3F51B5", width: 12, height: 12, display: "inline-block", marginRight: 1 }}
              />{" "}
              Holiday Event
            </Typography>
          </Box>
        </Box>

        {/* Box 9: Fundraising Progress */}
        <Box
            sx={{
            width: 735,
            height: 135,
            bgcolor: "#FFFFFF",
            position: "absolute",
            top: "60%",
            left: "70%",
            transform: "translate(-98.5%, 120%)",
            boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)",
            padding: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", marginBottom: 2 }}>
            Fundraising Progress
          </Typography>
          <Typography variant="body1" sx={{ color: "text.primary", marginBottom: 1 }}>
            {fundraising
              ? `$${fundraising.raised.toLocaleString()} raised out of $${fundraising.goal.toLocaleString()} goal`
              : "Loading..."}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={fundraising ? (fundraising.raised / fundraising.goal) * 100 : 0}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: "#E0E0E0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#76C7C0",
              },
            }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

