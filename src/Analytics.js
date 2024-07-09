import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import MapComponent from './MapComponent';

const AnalyticsPage = () => {
  // const {qrId} = useParams();
  const qrId="6687c5aeb2f299b81fe90439";
  const [data, setData] = useState([]);
  const [totalScans, setTotalScans] = useState(0);
  const [locationData, setLocationData] = useState([]);
  const [languageData, setLanguageData] = useState([]);
  const navigate = useNavigate();
  const coordinates = [
    { lat: 51.505, lng: -0.09 },
    { lat: 48.8566, lng: 2.3522 },
    { lat: 40.7128, lng: -74.0060 }
  ];

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
  }, [qrId]);

  return (
    <>
    <TopBar />
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-md p-12 mb-12 text-center">
        <p className="text-gray-600 text-2xl">Total Scans</p>
        <p className="text-6xl font-bold text-indigo-600">{totalScans}</p>
      </div>
      <div className="mb-8">
      <MapComponent coordinates= {coordinates} />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Scans by Location</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={locationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
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