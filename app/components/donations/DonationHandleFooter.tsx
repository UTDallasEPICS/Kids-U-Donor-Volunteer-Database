import { Box, Button, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { DonationFormProps, DonorFormProps } from "../formComponents/FormInputProps";

type FooterProps = {
  id: string;
  name: string;
  href: string;
  apiUrl: string;
  handleSubmit: UseFormHandleSubmit<DonorFormProps | DonationFormProps>;
  isDirty: boolean;
  errors: FieldErrors<DonorFormProps | DonationFormProps>;
};

export const Footer = ({ id, name, href, apiUrl, handleSubmit, isDirty, errors }: FooterProps) => {
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

  const handleSave = async (data: DonorFormProps | DonationFormProps) => {
    // If fields not changed, don't save
    if (!isDirty || Object.keys(errors).length > 0) {
      alert("Cannot save when fields are unchanged or there are validation errors.");
      return;
    }
    try {
      setIsButtonDisabled(true);

      const requestBody = JSON.stringify({ data });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiUrl}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      if (!response.ok) {
        throw new Error("Error updating data");
      }
      alert("Successfully updated data.");
    } catch (error) {
      alert("Error updating data");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const remove = confirm(`Are you sure you would like to delete this ${name}?\nThis cannot be undone.`);

    if (remove) {
      try {
        setIsButtonDisabled(true);
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiUrl}/${id}`, {
          method: "DELETE",
        });

        if (!result.ok) {
          throw new Error(`Error deleting ${name} data`);
        }
        alert(`Successfully deleted ${name} data`);
        router.push(`/${href}`);
      } catch (error) {
        alert(`Error deleting ${href} data`);
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    router.push(href);
  };

  return (
    <Box sx={styles.footerContainer}>
      <Tooltip
        title={
          !isDirty
            ? "Cannot save when fields are unchanged."
            : Object.keys(errors).length > 0
              ? "Cannot save because there are validation errors."
              : "Save all changes."
        }
      >
        <span>
          <Button
            sx={styles.buttonContained}
            variant="contained"
            onClick={handleSubmit(handleSave)}
            disabled={isButtonDisabled || !isDirty || Object.keys(errors).length > 0}
          >
            Save
          </Button>
        </span>
      </Tooltip>
      <Tooltip title={"Delete details"}>
        <span>
          <Button sx={styles.buttonContained} variant="contained" onClick={handleDelete} disabled={isButtonDisabled}>
            Delete
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
  },
  buttonContained: {
    backgroundColor: "#1a345b",
  },
  buttonOutlined: {
    borderColor: "black",
    color: "black",
  },
};
