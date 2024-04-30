// utils.js
const formatDate = (dateString) => {
  if (!dateString) return "N/A"; // Check if dateString is null
  const date = new Date(Date.parse(dateString)); // Parse the date string
  const day = date.getUTCDate().toString().padStart(2, '0'); // Use getUTCDate() instead of getDate()
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Use getUTCMonth() instead of getMonth()
  const year = date.getUTCFullYear().toString(); // Use getUTCFullYear() instead of getFullYear()
  return `${month}/${day}/${year}`;
};

export default formatDate;
