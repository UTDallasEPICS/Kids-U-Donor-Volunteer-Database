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

export const DetailFooter = ({ id, name, href, apiUrl, handleSubmit, isDirty, errors }: FooterProps) => {
  const router = useRouter();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsButtonDisabled(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async (data: DonorFormProps | DonationFormProps) => {
    if (!isDirty || Object.keys(errors).length > 0) {
      alert("Cannot save when fields are unchanged or there are validation errors.");
      return;
    }

    try {
      setIsButtonDisabled(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiUrl}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Something went wrong");
      }

      alert("Successfully updated data.");
    } catch (error) {
      alert(error);
      console.error(error);
    } finally {
      setTimeout(() => setIsButtonDisabled(false), 4000);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${name}? This cannot be undone.`)) return;

    try {
      setIsButtonDisabled(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiUrl}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Something went wrong");
      }

      alert(`Successfully deleted ${name} data`);
      router.push(href);
    } catch (error) {
      alert(error);
      console.error(error);
    } finally {
      setTimeout(() => setIsButtonDisabled(false), 4000);
    }
  };

  return (
    <Box sx={styles.footerContainer}>
      <Tooltip
        title={
          !isDirty
            ? "Cannot save when fields are unchanged."
            : Object.keys(errors).length > 0
            ? "Cannot save due to validation errors."
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
      <Tooltip title="Delete details">
        <span>
          <Button sx={styles.buttonContained} variant="contained" onClick={handleDelete} disabled={isButtonDisabled}>
            Delete
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="Move back to List page">
        <span>
          <Button sx={styles.buttonOutlined} variant="outlined" onClick={() => router.push(href)} disabled={isButtonDisabled}>
            Cancel
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};

const styles = {
  footerContainer: { display: "flex", gap: 1, py: 2, gridColumn: "span 3" },
  buttonContained: { backgroundColor: "#1a345b" },
  buttonOutlined: { borderColor: "black", color: "black" },
};
