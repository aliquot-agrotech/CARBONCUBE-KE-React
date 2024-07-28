import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const SalesPerformance = ({ data }) => {
  const chartData = {
    labels: Object.keys(data).map(date => new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' })),
    datasets: [
      {
        label: 'Sales Performance',
        data: Object.values(data),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  };

  return (
    <div style={{ width: '6cm', height: '6cm' }}>
      <Pie data={chartData} />
    </div>
  );
};

export default SalesPerformance;
