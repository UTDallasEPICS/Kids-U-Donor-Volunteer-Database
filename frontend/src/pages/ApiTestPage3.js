import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GrantDetails() {
  const [id, setId] = useState('');
  const [GrantName, setName] = useState('');
  const [ContactType, setContactType] = useState('');
  const [grant, setGrant] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) return; // Don't fetch if ID is empty
        const response = await axios.put(`/api/grant/updateGrant?id=${id}`, {
          // Send updated data in the request body
          updatedData: { GrantName, ContactType }
        });
        setGrant(response.data);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchData();
  }, [id, GrantName, ContactType]); // Re-fetch data whenever ID, name, or contactType changes

  const handleIdChange = (e) => {
    setId(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleContactTypeChange = (e) => {
    setContactType(e.target.value);
  };

  return (
    <div>
      <h1>Grant Details</h1>
      <input
        type="text"
        placeholder="Enter Grant ID"
        value={id}
        onChange={handleIdChange}
      />
      <input
        type="text"
        placeholder="Enter Name"
        value={GrantName}
        onChange={handleNameChange}
      />
      <input
        type="text"
        placeholder="Enter Contact Type"
        value={ContactType}
        onChange={handleContactTypeChange}
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
