import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

const App = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://checkinn.co/api/v1/int/requests');
      console.log('API Response:', response.data.requests);
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const getRequestsPerHotel = () => {
    const requestsPerHotel = {};

    requests.forEach(request => {
      const hotelName = request.hotel.name;
      if (requestsPerHotel[hotelName]) {
        requestsPerHotel[hotelName]++;
      } else {
        requestsPerHotel[hotelName] = 1;
      }
    });

    return requestsPerHotel;
  };

  const chartOptions = {
    xaxis: {
      categories: Object.keys(getRequestsPerHotel()),
    },
  };

  const chartSeries = [
    {
      name: 'Number of Requests',
      data: Object.values(getRequestsPerHotel()),
    },
  ];

  return (
    <div className="App">
      <h1>Requests per hotel</h1>
      {Object.keys(getRequestsPerHotel()).length > 0 ? (
        <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={350} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
