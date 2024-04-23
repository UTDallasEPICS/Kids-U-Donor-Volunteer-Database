import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GrantDetails() {
  const [id, setId] = useState('');
  const [grant, setGrant] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) return; // Don't fetch if ID is empty
        // Replace 'YOUR_ENDPOINT_URL' with the actual endpoint URL
        
        const response = await axios.get(`/api/grant/deleteGrant?id=${id}`);
        setGrant(response.data);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchData();
  }, [id]); // Re-fetch data whenever ID changes

  const handleChange = (e) => {
    setId(e.target.value);
  };

  return (
    <div>
      <h1>Grant Details</h1>
      <input
        type="text"
        placeholder="Enter Grant ID"
        value={id}
        onChange={handleChange}
      />
      {error && <p>Error: {error}</p>}
      {grant && (
        <div>
          <p>ID: {JSON.stringify(grant)}</p>
          {/* Display other grant details here */}
        </div>
      )}
    </div>
  );
}

export default GrantDetails;
