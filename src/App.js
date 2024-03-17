import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import './App.css';

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

  const totalRequests = requests.length;

  const uniqueDepartments = Array.from(new Set(requests.map(request => request.desk.name)));

  const chartOptions = {
    xaxis: {
      categories: Object.keys(getRequestsPerHotel()),
    },
    
    yaxis: {
      min: 0, 
      tickAmount: 4, 
      labels: {
        formatter: val => (val % 2 === 0 ? val : ''), 
      },
    },

    chart: {
      width: '100%', 
      height: '100%', 
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
      <h1 className="heading">Requests per hotel</h1>
      <div className="chart-container">
        {Object.keys(getRequestsPerHotel()).length > 0 ? (
          <>
            <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={350} />
            <p className="total-requests">Total requests: {totalRequests}</p>
            <p>List of unique department names across all Hotels: {uniqueDepartments.join(', ')}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default App;
