// TimeSeriesGraph.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const TimeSeriesGraph = ({ data, interval }) => {
  let tickFormatter;
  let intervalFormat;

  switch (interval) {
    case 'daily':
      intervalFormat = 'DD MMM'; // Format for daily interval
      tickFormatter = tick => moment(tick).format(intervalFormat);
      break;
    case 'monthly':
      intervalFormat = 'MMM YYYY'; // Format for monthly interval (adjust as needed)
      tickFormatter = tick => moment(tick).format(intervalFormat);
      break;
    case 'yearly':
      intervalFormat = 'YYYY'; // Format for monthly interval (adjust as needed)
      tickFormatter = tick => moment(tick).format(intervalFormat);
      break;        
    default:
      intervalFormat = 'DD MMM'; // Default format for daily interval
      tickFormatter = tick => moment(tick).format(intervalFormat);
      break;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={tickFormatter} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="scans" stroke="#8884d8" dot={{ stroke: '#8884d8', strokeWidth: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesGraph;
