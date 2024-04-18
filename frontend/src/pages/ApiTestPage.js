// components/ExampleComponent.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExampleComponent = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`/api/data`)
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>API Response:</h1>
      <p>{message}</p>
    </div>
  );
};

export default ExampleComponent;
