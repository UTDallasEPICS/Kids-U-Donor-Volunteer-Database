import React, { useState, useEffect } from 'react';

function YourComponent() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/grant/getGrants'); // Replace '/yourEndpoint' with the actual endpoint URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        setError('Error fetching data: ' + error.message);
      }
    };

    fetchData();
  }, [data]);

  return (
    <div>
      <h1>Data from API</h1>
      {error ? (
        <div>{error}</div>
      ) : (
        <div>{JSON.stringify(data)}</div>
      )}
    </div>
  );
}

export default YourComponent;