import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import TopBar from './TopBar';
import MapComponent from './MapComponent';
import TimeSeriesGraph from './TimeSeriesGraph';
import moment from 'moment';
import axios from 'axios';

const AnalyticsPage = () => {
  // const qrId = "6687c5aeb2f299b81fe90439";
  const { qrId } = useParams();
  const [data, setData] = useState([]);
  const [totalScans, setTotalScans] = useState(0);
  const [locationData, setLocationData] = useState([]);
  const [languageData, setLanguageData] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState('monthly');
  const [timeScanData, setTimeScanData] = useState([]);
  const navigate = useNavigate();
  const axiosInstance = axios.create({
    headers: {
      'ngrok-skip-browser-warning': '69420'
    }
  });

  const aggregateData = (data, interval) => {
    const groupedData = {};

    data.forEach(scan => {
      let key;
      if (interval === 'daily') key = moment(scan.createdAt).startOf(interval).format('YYYY-MM-DD');
      else if (interval === 'monthly') key = moment(scan.createdAt).startOf(interval).format('YYYY-MM');
      else key = moment(scan.createdAt).startOf(interval).format('YYYY');
      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key]++;
    });

    return Object.keys(groupedData).map(date => ({
      date,
      scans: groupedData[date],
    }));
  };

  useEffect(() => {
    const checkLoggedOut = () => {
      const userId = sessionStorage.getItem('loggedInUser');
      if (!userId) {
        navigate(`/login`);
      }
    };
    checkLoggedOut();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_BACKEND_URL}/api/scan/all/${qrId}`);
        const result = response.data;

        const filteredData = result.filter(item => item.qrId === qrId);
        setData(filteredData);
        setTotalScans(filteredData.length);

        const locationCounts = filteredData.reduce((acc, item) => {
          const location = JSON.parse(item.location);
          const locationKey = `${location.lat},${location.long}`;
          acc[locationKey] = (acc[locationKey] || 0) + 1;
          return acc;
        }, {});

        const languageCounts = filteredData.reduce((acc, item) => {
          acc[item.language] = (acc[item.language] || 0) + 1;
          return acc;
        }, {});

        setLocationData(Object.keys(locationCounts).map(key => {
          const [lat, lng] = key.split(',');
          return { lat: parseFloat(lat), lng: parseFloat(lng), count: locationCounts[key] };
        }));

        setLanguageData(Object.keys(languageCounts).map(key => ({ name: key, count: languageCounts[key] })));
        const initialTimeScanData = aggregateData(filteredData, selectedInterval);
        setTimeScanData(initialTimeScanData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    handleIntervalChange('monthly');
  }, [qrId]);

  const handleIntervalChange = (interval) => {
    setSelectedInterval(interval);
    let newData = aggregateData(data, interval);
    setTimeScanData(newData);
  };

  return (
    <>
      <TopBar />
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-md p-12 mb-12 text-center">
          <p className="text-gray-600 text-2xl">Total Scans</p>
          <p className="text-6xl font-bold text-indigo-600">{totalScans}</p>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Scans by Time</h2>
          <div className="flex justify-end items-center">
            <select
              id="interval-select"
              value={selectedInterval}
              onChange={e => handleIntervalChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <TimeSeriesGraph data={timeScanData} interval={selectedInterval} />
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Scans by Location</h2>
          <MapComponent coordinates={locationData} />
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Scans by Language</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={languageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
