import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import MapComponent from './MapComponent';
import TimeSeriesGraph from './TimeSeriesGraph';
import moment from 'moment';
const AnalyticsPage = () => {
  // const {qrId} = useParams();
  const qrId="6687c5aeb2f299b81fe90439";
  const [data, setData] = useState([]);
  const [totalScans, setTotalScans] = useState(0);
  const [locationData, setLocationData] = useState([]);
  const [languageData, setLanguageData] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState('daily');  // select the timestamp interval
  const [timeScanData, setTimeScanData] = useState([])

  const navigate = useNavigate();
  // dummy coordinates data
  const coordinates = [
    { lat: 51.505, lng: -0.09 },
    { lat: 48.8566, lng: 2.3522 },
    { lat: 40.7128, lng: -74.0060 }
  ];
  // dummy timestamp data
  const timestamp = [
    { timestamp: '2024-07-01T12:00:00Z' },
    { timestamp: '2024-07-02T12:00:00Z' },
    { timestamp: '2024-07-03T12:00:00Z' },
    { timestamp: '2024-07-04T12:00:00Z' },
    { timestamp: '2024-07-05T12:00:00Z' },
    { timestamp: '2024-07-10T12:00:00Z' },
    { timestamp: '2024-07-15T12:00:00Z' },
    { timestamp: '2024-07-20T12:00:00Z' },
    { timestamp: '2024-08-01T12:00:00Z' },
    { timestamp: '2024-08-05T12:00:00Z' },
  ];

  // convert data based on the time-interval set
// Function to aggregate data based on time interval (day, week, month)
const aggregateData = (data, interval) => {
  const groupedData = {};

  // Group by interval (day, week, month)
  data.forEach(scan => {
    let key;
    if(interval == 'daily') key = moment(scan.timestamp).startOf(interval).format('YYYY-MM-DD');
    else if (interval  == 'monthly') key = moment(scan.timestamp).startOf(interval).format('YYYY-MM');
    else key = moment(scan.timestamp).startOf(interval).format('YYYY');
    if (!groupedData[key]) {
      groupedData[key] = 0;
    }
    groupedData[key]++;
  });

  // Convert to array format for recharts
  const formattedData = Object.keys(groupedData).map(date => ({
    date,
    scans: groupedData[date],
  }));

  return formattedData;
};


  useEffect(()=>{
    const checkLoggedOut = ()=>{
      console.log('checking');
      const userId = sessionStorage.getItem('loggedInUser')
      if(!userId){ 
        navigate(`/login`)
      }
    }
    checkLoggedOut();
  }, [])

  useEffect(() => {
    
    const fetchData = async () => {
      
      const result = [
        {
            "_id": "6687d75471341c8f88753926",
            "qrId": "6687c5aeb2f299b81fe90439",
            "location": "Delhi",
            "language": "English",
            "createdAt": "2024-07-05T11:21:56.612Z",
            "updatedAt": "2024-07-05T11:21:56.612Z",
            "__v": 0
        },
        {
            "_id": "6687d75e71341c8f88753928",
            "qrId": "6687c5aeb2f299b81fe90439",
            "location": "UP",
            "language": "Hindi",
            "createdAt": "2024-07-05T11:22:06.936Z",
            "updatedAt": "2024-07-05T11:22:06.936Z",
            "__v": 0
        },
        {
            "_id": "6687d76b71341c8f8875392a",
            "qrId": "6687c5aeb2f299b81fe90439",
            "location": "Karnataka",
            "language": "Kannada",
            "createdAt": "2024-07-05T11:22:19.935Z",
            "updatedAt": "2024-07-05T11:22:19.935Z",
            "__v": 0
        },
        {
            "_id": "6687d80571341c8f8875392f",
            "qrId": "6687c5aeb2f299b81fe90439",
            "location": "US",
            "language": "Eng(US)",
            "createdAt": "2024-07-05T11:24:53.511Z",
            "updatedAt": "2024-07-05T11:24:53.511Z",
            "__v": 0
        }
    ]

      const filteredData = result.filter(item => item.qrId === qrId);
      setData(filteredData);
      setTotalScans(filteredData.length);

      const locationCounts = filteredData.reduce((acc, item) => {
        acc[item.location] = (acc[item.location] || 0) + 1;
        return acc;
      }, {});

      const languageCounts = filteredData.reduce((acc, item) => {
        acc[item.language] = (acc[item.language] || 0) + 1;
        return acc;
      }, {});

      setLocationData(Object.keys(locationCounts).map(key => ({ name: key, count: locationCounts[key] })));
      setLanguageData(Object.keys(languageCounts).map(key => ({ name: key, count: languageCounts[key] })));
    };

    fetchData();
    handleIntervalChange('daily');
  }, [qrId]);

  const handleIntervalChange=  (interval) => {
    setSelectedInterval(interval);
    let newData = aggregateData(timestamp , interval)
    console.log(newData);
    setTimeScanData(newData);
  }

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

      {/* Time series graph */}
      <div>
        <TimeSeriesGraph data={timeScanData} interval={selectedInterval} />
      </div>
      </div>
      <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Scans by Location</h2>
      <MapComponent coordinates= {coordinates} />
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