import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const SalesPerformance = ({ data, totalRevenue }) => {
  console.log('Sales Performance Data:', data); // Debugging line
  console.log('Total Revenue (All Time):', totalRevenue); // Debugging line

  const months = Object.keys(data).slice(-3); // Get the last 3 months

  const createChartData = (month) => {
    const monthRevenue = parseFloat(data[month]);
    const percentage = (monthRevenue / totalRevenue) * 100;

    console.log(`${month} Revenue:`, monthRevenue, 'Percentage:', percentage); // Debugging line

    return {
      labels: [month, 'Other'],
      datasets: [
        {
          data: [percentage, 100 - percentage],
          backgroundColor: ['#FFC107', '#E0E0E0'],
          hoverBackgroundColor: ['#FFD54F', '#EEEEEE'],
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '80%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label;
            const value = context.raw.toFixed(2);
            return `${label}: ${value}%`;
          },
        },
      },
    },
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '300px' }}>
      {months.map((month) => (
        <div key={month} style={{ width: '30%', height: '100%', textAlign: 'center' }}>
          <div style={{ height: '200px' }}>
            <Doughnut key={`${month}-chart`} data={createChartData(month)} options={chartOptions} />
          </div>
          <p style={{ marginTop: '10px' }}>{month}</p>
          <p style={{ fontWeight: 'bold' }}>
            {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data[month])}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SalesPerformance;