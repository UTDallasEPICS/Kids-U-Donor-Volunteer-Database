import { Box, Button, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { AddDonationDonorFormProps } from "../../form-components/form-input-props";
import { DonationState } from "@/app/types/states";

type FooterProps = {
  donorMode: string;
  email: string;
  handleSubmit: UseFormHandleSubmit<AddDonationDonorFormProps>;
  isDirty: boolean;
  errors: FieldErrors<AddDonationDonorFormProps>;
};

export const AddFooter = ({ donorMode, email, handleSubmit, isDirty, errors }: FooterProps) => {
  const router = useRouter();

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const seconds: number = 4000;
  const handleButtonDisable = () => {
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, seconds);
  };

  // Disable button for n seconds on refresh/load
  useEffect(() => {
    handleButtonDisable();
  }, []);

  // Disable button after it has been pressed for n seconds
  useEffect(() => {
    handleButtonDisable();
  }, [isButtonDisabled]);

  const addAnonymousDonor = async (data: DonationState) => {
    try {
      const requestBody = JSON.stringify({ data });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donations/anonymous`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || "Something went wrong";
        throw new Error(message);
      }
      alert("Successfully added data.");
      location.reload();
    } catch (error) {
      alert("Error adding data");
      console.error(error);
    }
  };

  const addNewDonor = async (data: AddDonationDonorFormProps) => {
    try {
      const requestBody = JSON.stringify({ data });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || "Something went wrong";
        throw new Error(message);
      }
      alert("Successfully added data.");
      location.reload();
    } catch (error) {
      alert("Error adding data");
      console.error(error);
    }
  };

  const addExistingDonor = async (data: DonationState) => {
    try {
      const requestBody = JSON.stringify({
        data: {
          ...data,
          donorEmail: email,
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donations/existing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || "Something went wrong";
        throw new Error(message);
      }

      alert("Successfully added data.");
      location.reload();
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  const handleAdd = async (data: AddDonationDonorFormProps) => {
    // If fields not changed, don't add
    if (!isDirty || Object.keys(errors).length > 0) {
      alert("Cannot add when fields are unchanged or there are validation errors.");
      return;
    }

    setIsButtonDisabled(true);
    switch (donorMode) {
      case "Anonymous":
        addAnonymousDonor(data.donation);
        break;
      case "New":
        addNewDonor(data);
        break;
      case "Existing":
        addExistingDonor(data.donation);
        break;
      default:
        return;
    }
  };

  const handleCancel = () => {
    router.push("/Donations");
  };

  return (
    <Box sx={styles.footerContainer}>
      <Tooltip
        title={
          !isDirty
            ? "Cannot add when fields are unchanged."
            : Object.keys(errors).length > 0
              ? "Cannot add because there are validation errors."
              : "Add item."
        }
      >
        <span>
          <Button
            sx={styles.buttonContained}
            variant="contained"
            onClick={handleSubmit(handleAdd)}
            disabled={isButtonDisabled || !isDirty || Object.keys(errors).length > 0}
          >
            Add
          </Button>
        </span>
      </Tooltip>

      <Tooltip title={"Move back to List page"}>
        <span>
          <Button sx={styles.buttonOutlined} variant="outlined" onClick={handleCancel} disabled={isButtonDisabled}>
            Cancel
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};

const styles = {
  footerContainer: {
    display: "flex",
    gap: 1,
    py: 2,
    gridColumn: "span 3",
  },
  buttonContained: {
    backgroundColor: "#1a345b",
  },
  buttonOutlined: {
    borderColor: "black",
    color: "black",
  },
};
