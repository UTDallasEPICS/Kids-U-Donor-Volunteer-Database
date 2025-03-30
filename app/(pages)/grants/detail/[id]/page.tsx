"use client";
import React from "react";
import { useEffect, useState } from "react";
import type { Grant } from "@/prisma";
import { useParams } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  Breadcrumbs,
  CircularProgress,
  MenuItem,
  InputAdornment,
} from "@mui/material"
import Grid from '@mui/material/Grid2';
import Link from "next/link"


const GrantDetailPage = () => {
  const { id } = useParams();
  const [grantDetails, setGrantDetails] = useState<Grant[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSave, setShowSave] = useState(false);
  const [showEdit, setShowEdit] = useState(true);
  const [showCancelEdit, setShowCancelEdit] = useState(false);

  useEffect(() => {
    const fetchGrantDetails = async () => {
      try {
        const response = await fetch(`/api/grants/${id}/get`);
        const result = await response.json();
        setGrantDetails(result.data);
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
    setShowEdit(false);
    setShowSave(true);
    setShowCancelEdit(true);
  };

  const handleSaveClick = async () => {
    setShowEdit(true);
    setShowSave(false);
    setShowCancelEdit(false);
    try {
      //const response = await axios.put(`/api/grant/updateGrant?id=${id}`, {
      //  updatedData: grantDetails,
      //});
      //console.log("Updated grant details:", response.data);
      const response = await fetch(`/api/grants/${id}/patch`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(grantDetails) });
      const result = await response.json();
      setGrantDetails(result.data);
      console.log(result.data)
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating grant details:", error);
      // Handle error
    }
  };

  const handleCancelEditClick = () => {
    setShowEdit(true);
    setShowSave(false);
    setShowCancelEdit(false);
    setIsEditing(false);
  }

  //Old handleInputChange, not really sure how this works

  /*const handleInputChange = (e: any) => {
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
  };*/

  //Only works for status at the moment, was supposed to be dynamic and work for all textfields
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setGrantDetails((prevState) => ({
      ...prevState,
      status: value,
    }));
  };

  if (loading) {
    return <CircularProgress style={styles.center} />
  }

  if (!grantDetails) {
    return <div>Grant not found</div>;
  }

  return (
    <Box>
      <Box>
        <Breadcrumbs style={styles.breadcrumb}>
          <Link href={"/"} style={{ textDecoration: 'underline', }}>Dashboard</Link>
          <Typography>Grants</Typography>
          <Link href={"/grants"} style={{ textDecoration: 'underline', }}>Grant List</Link>
          <Typography>Grant Details</Typography>
        </Breadcrumbs>
      </Box>
      <Box>
        <Grid container spacing={2} alignItems="center" marginLeft={2} marginTop={2} marginBottom={2}>
          {showSave && <Button
            variant="contained"
            onClick={handleSaveClick}
          >
            <Typography>Save</Typography>
          </Button>
          }
          {showEdit && <Button
            variant="contained"
            onClick={handleEditClick}
          >
            <Typography>Edit</Typography>
          </Button>
          }
          {showCancelEdit && <Button
            variant="contained"
            onClick={handleCancelEditClick}
          >
            <Typography>Cancel Edit</Typography>
          </Button>
          }
        </Grid>
      </Box>
      <Box flexGrow={1} p={2}>
        <DetailsTable
          grantDetails={grantDetails}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
        />
      </Box>
    </Box>
  );
};

const DetailsTable = ({ grantDetails, isEditing, handleInputChange }: any) => {

  const status = [
    {
      value: 'LOI Submitted',
      label: 'LOI Submitted',
    },
    {
      value: 'Proposal Submitted',
      label: 'Proposal Submitted',
    },
    {
      value: 'Awarded',
      label: 'Awarded',
    },
    {
      value: 'Declined',
      label: 'Declined',
    },
    {
      value: 'Pending',
      label: 'Pending',
    }
  ];

  const renewalStatus = [
    {
      value: 'Submitted',
      label: 'Submitted',
    },
    {
      value: 'Awarded',
      label: 'Awarded',
    },
    {
      value: 'Declined',
      label: 'Declined',
    },
    {
      value: 'Pending',
      label: 'Pending',
    }
  ];

  const quarter = [
    {
      value: '1',
      label: '1',
    },
    {
      value: '2',
      label: '2',
    },
    {
      value: '3',
      label: '3',
    },
    {
      value: '4',
      label: '4',
    },
  ];

  const trueFalse = [
    {
      value: 'true',
      label: 'true',
    },
    {
      value: 'false',
      label: 'false',
    },
  ];

  //Need to make the next few dynamic so kids-u can add more purposes, useArea, fundingArea
  const purpose = [
    {
      value: 'After-School Tutoring Program',
      label: 'After-School Tutoring Program',
    },
    {
      value: 'Summer Program',
      label: 'Summer Program',
    },
    {
      value: 'Family & Community Engagement',
      label: 'Family & Community Engagement',
    },
    {
      value: 'Nutrition and Meal Programs',
      label: 'Nutrition and Meal Programs',
    },
    {
      value: 'Community Safety Initiatives',
      label: 'Community Safety Initiatives',
    },
    {
      value: 'General',
      label: 'General',
    },
  ]

  const fundingArea = [
    {
      value: 'After-school Tutoring',
      label: 'After-School Tutoring',
    },
    {
      value: 'Summer Programs',
      label: 'Summer Programs',
    },
    {
      value: 'Family & Community Engagement',
      label: 'Family & Community Engagement',
    },
    {
      value: 'General',
      label: 'General',
    },
  ]

  const useArea = [
    {
      value: 'Educational Programming',
      label: 'Educational Programming',
    },
    {
      value: 'Social-Emotional Learning',
      label: 'Social-Emotional Learning',
    },
    {
      value: 'Community Safety',
      label: 'Community Safety',
    },
    {
      value: 'Nutrition Programs',
      label: 'Nutrition Programs',
    },
    {
      value: 'General',
      label: 'General',
    },
  ]


  return (

    <Box sx={{ flexGrow: '2' }}>
      <Grid container spacing={5} alignItems="center" marginLeft={2} marginTop={1} marginBottom={1}>
        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="grantor-Text-Field"
            label="Grantor"
            variant="outlined"
            value={grantDetails?.representativeGrant?.[0]?.representative?.grantor?.organization?.name || ''}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }} />
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="representative-Text-Field"
            label="Representative"
            variant="outlined"
            value={grantDetails?.representativeGrant?.[0]?.representative?.person?.firstName + " " +
              grantDetails?.representativeGrant?.[0]?.representative?.person?.lastName || ''}      
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }} />
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="representative-Email-Text-Field"
            label="Representative Email"
            variant="outlined"
            value={grantDetails?.representativeGrant?.[0]?.representative?.person?.emailAddress}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }} />
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="representative-Phone-Number-Text-Field"
            label="Representative Phone Number"
            variant="outlined"
            defaultValue={grantDetails?.representativeGrant?.[0]?.representative?.person?.phoneNumber ?? "N/A"}

            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }} />
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="grant-Name-Text-Field"
            label="Grant Name"
            variant="outlined"
            value={grantDetails.name}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }} />
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="Status-Text-Field"
            label="Grant Status"
            variant="outlined"
            value={grantDetails.status}
            disabled={!isEditing}
            onChange={handleInputChange}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
            select>
            {status.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="award-Notification-Date-Text-Field"
            label="Award Notification Date"
            variant="outlined"
            type="date"
            value={grantDetails.awardNotificationDate ? new Date(grantDetails.awardNotificationDate).toISOString().split('T')[0] : ""}
            disabled={!isEditing}
            InputLabelProps={{
              shrink: grantDetails.renewalApplicationDate === null,
            }}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
          />
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="amount-Requested-Text-Field"
            label="Grant Amount Requested"
            variant="outlined"
            value={grantDetails.amountRequested}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              },
            }}
          />
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="amount-Awarded-Text-Field"
            label="Grant Amount Awarded"
            variant="outlined"
            value={grantDetails.amountAwarded}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              },
            }}
          />
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="grant-Purpose-Text-Field"
            label="Grant Purpose"
            variant="outlined"
            value={grantDetails.purpose}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
            select>

            {purpose.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="grant-Funding-Area-Text-Field"
            label="Grant Funding Area"
            variant="outlined"
            value={grantDetails.fundingArea}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
            select>

            {fundingArea.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="grant-Use-Area-Text-Field"
            label="Grant Use Area"
            variant="outlined"
            value={grantDetails.useArea}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
            select>

            {useArea.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="grant-Period-Start-Text-Field"
            label="Grant Period Start"
            type="date"
            variant="outlined"
            value={new Date(grantDetails.startDate).toISOString().split('T')[0]}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
          />
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="grant-Period-End-Text-Field"
            label="Grant Period End "
            type="date"
            variant="outlined"
            value={new Date(grantDetails.endDate).toISOString().split('T')[0]}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
          />
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="quarter-Text-Field"
            label="Quarter"
            variant="outlined"
            value={grantDetails.quarter}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
            select>

            {quarter.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="multi-Year-Text-Field"
            label="MultiYear?"
            variant="outlined"
            value={grantDetails.isMultipleYears}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
            select>

            {trueFalse.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="acknowledgement-Sent-Text-Field"
            label="Acknowledgement Sent"
            variant="outlined"
            value={grantDetails.acknowledgementSent}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
            select>

            {trueFalse.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="application-Type-Text-Field"
            label="Application Type"
            variant="outlined"
            value={grantDetails.applicationType}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }} />
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="proposal-Due-Date-Text-Field"
            label="Proposal Due Date"
            variant="outlined"
            type="date"
            value={new Date(grantDetails.proposalDueDate).toISOString().split('T')[0]}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
          />
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="internal-Proposal-Due-Date-Text-Field"
            label="Internal Proposal Due Date"
            variant="outlined"
            type="date"
            value={grantDetails.internalProposalDueDate ? new Date(grantDetails.internalProposalDueDate).toISOString().split('T')[0] : ""}
            disabled={!isEditing}
            InputLabelProps={{
              shrink: grantDetails.renewalApplicationDate === null,
            }}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
          />
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="proposal-Submission-Date-Text-Field"
            label="Proposal Submission Date "
            variant="outlined"
            type="date"
            value={grantDetails.proposalSubmissionDate ? new Date(grantDetails.proposalSubmissionDate).toISOString().split('T')[0] : ""}
            disabled={!isEditing}
            InputLabelProps={{
              shrink: grantDetails.renewalApplicationDate === null,
            }}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
          />
        </Grid>

        {/*----------------------------------------------------------------*/}
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <TextField
            id="grant-Proposal-Summary-Text-Field"
            label="Grant Proposal Summary"
            variant="outlined"
            value={grantDetails.proposalSummary}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
          >
          </TextField>
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
          <TextField
            id="grant-Funding-Restrictions-Text-Field"
            label="Grant Funding Restrictions"
            variant="outlined"
            value={grantDetails.fundingRestrictions}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
          >
          </TextField>
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
          <TextField
            id="grant-Matching-Requirements-Text-Field"
            label="Grant Matching Requirements"
            variant="outlined"
            value={grantDetails.fundingRestrictions}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
          >
          </TextField>
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="internal-Owner-Text-Field"
            label="Internal Owner"
            variant="outlined"
            value={grantDetails.internalOwner}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }} />
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="is-Eligible-For-Renewal-Text-Field"
            label="Eligible For Renewal?"
            variant="outlined"
            value={grantDetails.isEligibleForRenewal}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
            select>

            {trueFalse.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="renewal-Application-Date-Text-Field"
            label="Renewal Application Date"
            variant="outlined"
            type="date"
            value={grantDetails.renewalApplicationDate ? new Date(grantDetails.renewalApplicationDate).toISOString().split('T')[0] : ""}
            disabled={!isEditing}
            InputLabelProps={{
              shrink: grantDetails.renewalApplicationDate === null,
            }}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
          />
        </Grid>

        {/*----------------------------------------------------------------*/}

        <Grid size={{ xs: 3, sm: 3, md: 4 }}>
          <TextField
            id="renewal-Status-Text-Field"
            label="Grant Renewal Status"
            variant="outlined"
            value={grantDetails.renewalStatus ? grantDetails.renewalStatus : ""}
            disabled={!isEditing}
            sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
            select>
            {renewalStatus.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/*----------------------------------------------------------------*/}
      </Grid>
    </Box >
  );
};

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    marginLeft: "auto",
    marginRight: "auto",
  },
  breadcrumb: {
    marginLeft: "5px",
    marginTop: "8px"
  }
};

export default GrantDetailPage;