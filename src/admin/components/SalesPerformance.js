import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const SalesPerformance = ({ data, totalRevenue }) => {
  console.log('Sales Performance Data:', data);
  console.log('Total Revenue (All Time):', totalRevenue);

  // Sort months chronologically
  const months = Object.keys(data)
    .slice(-3)
    .sort((a, b) => new Date(a) - new Date(b));

  const createChartData = (month) => {
    const monthRevenue = parseFloat(data[month]);
    const percentage = (monthRevenue / totalRevenue) * 100;

    console.log(`${month} Revenue:`, monthRevenue, 'Percentage:', percentage);

    return {
      labels: [month, 'Other'],
      datasets: [
        {
          data: [percentage, 100 - percentage],
          backgroundColor: ['#FFC107', '#E0E0E0'],
          hoverBackgroundColor: ['#0019FF', '#EEEEEE'],
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
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
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 'auto' }}>
      {months.map((month) => (
        <div key={month} style={{ width: '30%', height: '100%', textAlign: 'center' }}>
          <div>
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