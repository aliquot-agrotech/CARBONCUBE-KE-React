import React from 'react';
import { Doughnut } from 'react-chartjs-2';
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

  const chartOptions = {
    cutout: '80%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <div style={{ width: '5cm', height: '5cm' }}>
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default SalesPerformance;
