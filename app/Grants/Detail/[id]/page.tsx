"use client";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Box , TextField, MenuItem, Select, Divider, InputAdornment  } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const GrantDetailPage = () => {
  const { id } = useParams();
  const [grantDetails, setGrantDetails] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrantDetails = async () => {
      try {
        const response = await axios.get(`/api/grants/${id}`);
        setGrantDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching grant details:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchGrantDetails();
    }
  }, [id]);

  const handleEditClick = () => {
    setIsEditing((prevState) => !prevState);
  };

  const handleSaveClick = async () => {
    console.log("Save button clicked"); // Add this line
    try {
      const response = await axios.put(`/api/grant/updateGrant?id=${id}`, {
        updatedData: grantDetails,
      });
      console.log("Updated grant details:", response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating grant details:", error);
      // Handle error
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setGrantDetails((prevGrantDetails: any) => {
      if (Array.isArray(prevGrantDetails[name])) {
        // If the field is an array, split the value by comma
        const values = value.split(",");
        // Check if each item can be parsed as a Date object
        const updatedValues = values.map((item: any) => {
          const date = new Date(item.trim());
          return isNaN(date.getTime()) ? item.trim() : date.toISOString(); // If it's not a valid date, keep it as string
        });
        return {
          ...prevGrantDetails,
          [name]: updatedValues,
        };
      } else if (value instanceof Date) {
        // If the value is a Date object, convert it to an ISO 8601 string
        return {
          ...prevGrantDetails,
          [name]: value.toISOString(),
        };
      } else {
        // For other cases, directly update the value
        return {
          ...prevGrantDetails,
          [name]: value,
        };
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!grantDetails) {
    return <div>Grant not found</div>;
  }

  return (
    <div className="flex font-sans">
      <div className="flex-grow p-5">
        <Breadcrumb />
        <Header
          handleEditClick={handleEditClick}
          handleSaveClick={handleSaveClick}
          isEditing={isEditing}
        />
        {/*<SearchBar />*/}
        <DetailsTable
          grantDetails={grantDetails}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};

const Breadcrumb = () => <div className="mb-5">Home / Grants / Grant Details</div>;

const Header = ({ handleEditClick, isEditing, handleSaveClick }: any) => (
  <div className="flex justify-between items-center mb-5">
    <h1>Grant Details</h1>
    <div className="flex justify-between items-center mb-5">
      {isEditing ? 
      (
        <>
          <button onClick={handleSaveClick} className="p-2 ml-2">
            Save
          </button>
          <button onClick={handleEditClick} className="p-2 ml-2">
            Cancel Edit
          </button>
        </>
      ) : (
        <button onClick={handleEditClick} className="p-2 ml-2">
          Edit Grant Details
        </button>
      )}
    </div>
  </div>
);

{/*<Grid size={{ xs: 3, sm: 3 , md: 4 }}>
          <DatePicker
    label="Grant Period Start"
    onChange={(newValue: dayjs | null) =>
      handleInputChange({
        target: { name: "grantPeriodStart", value: newValue },
      })
    }
    // Directly using TextField as input component
    slotProps={{
      textField: {
        id: "grant-Period-Start-Text-Field",
        label: "Grant Period Start",
        variant: "outlined",
        sx: { width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' } }
      }
    }}
  />
  </Grid> */}




          

const DetailsTable = ({ grantDetails, isEditing, handleInputChange }: any) => {
  
  const status = [
    {
      value: 'loiSubmittedStatus',
      label: 'LOI Submitted',
    },
    {
      value: 'porposalSubmittedStatus',
      label: 'Proposal Submitted',
    },
    {
      value: 'awardedStatus',
      label: 'Awarded',
    },
    {
      value: 'declinedStatus',
      label: 'Declined',
    },
    {
      value: 'pedningStatus',
      label: 'Pending',
    }
  ];

  const quarter = [
    {
      value: 'Q1Status',
      label: '1',
    },
    {
      value: 'Q2Status',
      label: '2',
    },
    {
      value: 'Q3Status',
      label: '3',
    },
    {
      value: 'Q4Status',
      label: '4',
    },
  ];

  const multiyear = [
    {
      value: 'yesMultiYear',
      label: 'Yes',
    },
    {
      value: 'noMultiYear',
      label: 'No',
    },
  ];

  const purpose = [
    {
      value: 'afterSchoolPurpose',
      label: 'After-School Tutoring Program',
    },
    {
      value: 'summerPurpose',
      label: 'Summer Program',
    },
    {
      value: 'FACEpurpose',
      label: 'Family & Community Engagement (FACE)',
    },
    {
      value: 'nutritionPurpose',
      label: 'Nutrition and Meal Programs',
    },
    {
      value: 'communitySafetyPurpose',
      label: 'Community Safety Initiatives ',
    },
  ]

  
  return (
    
      <Box sx = {{ flexGrow : '2' }}>

        <Grid container spacing={5}>
            <Grid size={{ xs: 3, sm: 3 , md: 4 }}>
              <TextField 
                id="organization-Text-Field" 
                label="Organization" 
                variant="outlined" 
                sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' } }}/>
            </Grid>

        {/*----------------------------------------------------------------*/}

          <Grid size={{ xs: 3, sm: 3 , md: 4 }}>
            <TextField 
              id="grant-Name-Text-Field" 
              label="Grant Name" 
              variant="outlined" 
              sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' } }}/>
          </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3 , md: 4 }}>
            <TextField 
              id="amount-Requested-Text-Field" 
              label="Grant Amount Requested" 
              variant="outlined" 
              sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' } }}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                },
              }}
              />
          </Grid>

        {/*----------------------------------------------------------------*/}

          <Grid size={{ xs: 3, sm: 3 , md: 4 }}>
            <TextField 
              id="Status-Text-Field"
              label="Grant Status"
              variant = "outlined"
              sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' } }}
              select>
                {status.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
                ))} 
            </TextField>
          </Grid>

        {/*----------------------------------------------------------------*/}

          <Grid size={{ xs: 3, sm: 3 , md: 4 }}>
            <TextField 
              id="grant-Status-Text-Field" 
              label="Grant Purpose" 
              variant="outlined"
              sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' } }}
              select>

              {purpose.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
                ))} 
            </TextField>
          </Grid>

          {/*----------------------------------------------------------------*/}

          <Grid size={{ xs: 3, sm: 3 , md: 4 }}>
            <TextField 
              id="grant-Period-Start-Text-Field" 
              label="Grant Period Start" 
              type = "date"
              variant="outlined" 
              sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' } }}
              defaultValue={new Date().toISOString().split('T')[0]}
              />
          </Grid>

          {/*----------------------------------------------------------------*/}

          <Grid size={{ xs: 3, sm: 3 , md: 4 }}>
            <TextField 
              id="grant-Period-End-Text-Field" 
              label="Grant Period End " 
              type = "date"
              variant="outlined" 
              sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' } }}
              defaultValue={new Date().toISOString().split('T')[0]}
              />
          </Grid>
          
          {/*----------------------------------------------------------------*/}

          <Grid size={{ xs: 3, sm: 3 , md: 4 }}>
            <TextField 
              id="quarter-Text-Field" 
              label="Quarter" 
              variant="outlined"
              sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' } }}
              select>

              {quarter.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
                ))} 
            </TextField>
          </Grid>

          {/*----------------------------------------------------------------*/}

          <Grid size={{ xs: 3, sm: 3 , md: 4 }}>
            <TextField 
              id="multi-Year-Text-Field" 
              label="MultiYear" 
              variant="outlined"
              sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' } }}
              select>

              {multiyear.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
                ))} 
            </TextField>
          </Grid>

          {/*----------------------------------------------------------------*/}

          <Grid size={{ xs: 3, sm: 3 , md: 4 }}>
            <TextField 
              id="proposal-Submission-Date-Text-Field" 
              label="Proposal Submission Date " 
              variant="outlined" 
              type="date"
              sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' } }}
              defaultValue={new Date().toISOString().split('T')[0]}
              />
          </Grid>

          {/*----------------------------------------------------------------*/}

          <Grid size={{ xs: 3, sm: 3 , md: 4 }}>
            <TextField 
              id="award-Notification-Date-Text-Field" 
              label="Award Notification Date" 
              variant="outlined" 
              type="date"
              sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' } }}
              defaultValue={new Date().toISOString().split('T')[0]}
              />
          </Grid>

          {/*----------------------------------------------------------------*/}

          


        </Grid>
      </Box>

      
  );
};


const GrantorDetailsTable = ({ grantDetails, isEditing, handleInputChange }: any) => {


  return(

  <Box sx = {{ flexGrow : '2' }}>
            <Grid container spacing={5}>

    <Grid item xs={12}>
    <Divider sx={{ my: 2 }} />
  </Grid>
  </Grid>

  </Box>




  );
};


export default GrantDetailPage;