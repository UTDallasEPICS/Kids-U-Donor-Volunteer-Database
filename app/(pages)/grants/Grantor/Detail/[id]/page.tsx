"use client";
import React from "react";
import { useEffect, useState } from "react";
import type { Grantor } from "@/prisma";
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

const GrantorDetailPage = () => {
    const { id } = useParams();
    const [grantorDetails, setGrantorDetails] = useState<Grantor[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showSave, setShowSave] = useState(false);
    const [showEdit, setShowEdit] = useState(true);
    const [showCancelEdit, setShowCancelEdit] = useState(false);

    useEffect(() => {
        const fetchGrantorDetails = async () => {
            try {
                const response = await fetch(`/api/grantors/${id}/get`);
                const result = await response.json();
                setGrantorDetails(result.data);
                console.log(result.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching grant details:", error);
                setLoading(false);
            }
        };

        if (id) {
            fetchGrantorDetails();
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
            //const response = await fetch(`/api/grantors/${id}/patch`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(grantDetails) });
            // const result = await response.json();
            //setGrantDetails(result.data);
            //console.log(result.data)
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

    //Only works for nothing at the moment, was supposed to be dynamic and work for all textfields
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        setGrantorDetails((prevState) => ({
            ...prevState,
            //status: value,
        }));
    };

    if (loading) {
        return <CircularProgress style={styles.center} />
    }

    if (!grantorDetails) {
        return <div>Grantor not found</div>;
    }

    return (
        <Box>
            <Box>
                <Breadcrumbs style={styles.breadcrumb}>
                    <Link href={"/"} style={{ textDecoration: 'underline', }}>Dashboard</Link>
                    <Typography>Grants</Typography>
                    <Link href={"/grants"} style={{ textDecoration: 'underline', }}>Grantor List</Link>
                    <Typography>Grantor Details</Typography>
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
                    grantorDetails={grantorDetails}
                    isEditing={isEditing}
                    handleInputChange={handleInputChange}
                />
            </Box>
        </Box>
    );
};

const DetailsTable = ({ grantorDetails, isEditing, handleInputChange }: any) => {

    const addressType = [
        {
            value: 'Business',
            label: 'Business',
        },
        {
            value: 'Personal',
            label: 'Personal',
        },
        {
            value: 'P.O. Box',
            label: 'P.O. Box',
        },
    ];

    const grantorType = [
        {
            value: 'Private Foundation',
            label: 'Private Foundation',
        },
        {
            value: 'Corporate Partner',
            label: 'Corporate Partner',
        },
        {
            value: 'Federal Government',
            label: 'Federal Governmen',
        },
        {
            value: 'State Government',
            label: 'State Government',
        },
        {
            value: 'Local Government',
            label: 'Local Government',
        },
        {
            value: 'Individual Major Donor',
            label: 'Individual Major Donor',
        },
    ];

    const communicationPreference = [
        {
            value: 'Email',
            label: 'Email',
        },
        {
            value: 'Phone',
            label: 'Phone',
        },
        {
            value: 'In-person',
            label: 'In-person',
        },
        {
            value: 'Event Participation',
            label: 'Event Participation',
        },
    ];

    const recognitionPreference = [
        {
            value: 'Public Recognition',
            label: 'Public Recognition',
        },
        {
            value: 'Anonymous',
            label: 'Anonymous',
        },
    ];

    return (

        <Box sx={{ flexGrow: '2' }}>
            <Grid container spacing={5} alignItems="center" marginLeft={2} marginTop={1} marginBottom={1}>
                <Grid size={{ xs: 3, sm: 3, md: 4 }}>
                    <TextField
                        id="grantor-Name-Text-Field"
                        label="Grantor Name"
                        variant="outlined"
                        value={grantorDetails.organization.name}
                        disabled={!isEditing}
                        sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }} />
                </Grid>

                {/*----------------------------------------------------------------*/}

                <Grid size={{ xs: 3, sm: 3, md: 4 }}>
                    <TextField
                        id="grantor-Address-Line-1-Text-Field"
                        label="Address Line 1"
                        variant="outlined"
                        value={grantorDetails.organization.address.addressLine1}
                        disabled={!isEditing}
                        sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }} />
                </Grid>

                {/*----------------------------------------------------------------*/}

                <Grid size={{ xs: 3, sm: 3, md: 4 }}>
                    <TextField
                        id="grantor-Address-Line-2-Text-Field"
                        label="Address Line 2"
                        variant="outlined"
                        value={grantorDetails.organization.address.addressLine2}
                        disabled={!isEditing}
                        sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }} />
                </Grid>

                {/*----------------------------------------------------------------*/}

                <Grid size={{ xs: 3, sm: 3, md: 4 }}>
                    <TextField
                        id="grantor-City-Text-Field"
                        label="City"
                        variant="outlined"
                        value={grantorDetails.organization.address.city}
                        disabled={!isEditing}
                        sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }} />
                </Grid>

                {/*----------------------------------------------------------------*/}

                <Grid size={{ xs: 3, sm: 3, md: 4 }}>
                    <TextField
                        id="grantor-City-Text-Field"
                        label="State"
                        variant="outlined"
                        value={grantorDetails.organization.address.state}
                        disabled={!isEditing}
                        sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }} />
                </Grid>

                {/*----------------------------------------------------------------*/}

                <Grid size={{ xs: 3, sm: 3, md: 4 }}>
                    <TextField
                        id="grantor-Zipcode-Text-Field"
                        label="Zipcode"
                        variant="outlined"
                        value={grantorDetails.organization.address.zipCode}
                        disabled={!isEditing}
                        sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }} />
                </Grid>

                {/*----------------------------------------------------------------*/}

                <Grid size={{ xs: 3, sm: 3, md: 4 }}>
                    <TextField
                        id="grantor-Address-Type-Text-Field"
                        label="Address Type"
                        variant="outlined"
                        value={grantorDetails.organization.address.type}
                        disabled={!isEditing}
                        sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
                        select>
                        {addressType.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/*----------------------------------------------------------------*/}

                <Grid size={{ xs: 3, sm: 3, md: 4 }}>
                    <TextField
                        id="grantor-Type-Text-Field"
                        label="Grantor Type"
                        variant="outlined"
                        value={grantorDetails.type}
                        disabled={!isEditing}
                        sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
                        select>
                        {grantorType.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/*----------------------------------------------------------------*/}

                <Grid size={{ xs: 3, sm: 3, md: 4 }}>
                    <TextField
                        id="grantor-Website-Link-Text-Field"
                        label="Grantor Website Link"
                        variant="outlined"
                        value={grantorDetails.websiteLink}
                        disabled={!isEditing}
                        sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }} />
                </Grid>

                {/*----------------------------------------------------------------*/}

                <Grid size={{ xs: 3, sm: 3, md: 4 }}>
                    <TextField
                        id="grantor-Communication-Preference-Text-Field"
                        label="Communication Preference"
                        variant="outlined"
                        value={grantorDetails.communicationPreference}
                        disabled={!isEditing}
                        sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
                        select>
                        {communicationPreference.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/*----------------------------------------------------------------*/}

                <Grid size={{ xs: 3, sm: 3, md: 4 }}>
                    <TextField
                        id="grantor-Recognition-Preference-Text-Field"
                        label="Recognition Preference"
                        variant="outlined"
                        value={grantorDetails.recognitionPreference}
                        disabled={!isEditing}
                        sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }}
                        select>
                        {recognitionPreference.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/*----------------------------------------------------------------*/}

                <Grid size={{ xs: 3, sm: 3, md: 4 }}>
                    <TextField
                        id="grantor-Internal-Relationship-Manager-Text-Field"
                        label="Internal Relationship Manager"
                        variant="outlined"
                        value={grantorDetails.internalRelationshipManager}
                        disabled={!isEditing}
                        sx={{ width: '100%', height: '40px', '& .MuiInputBase-root': { height: '40px' }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000000" } }} />
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

export default GrantorDetailPage;