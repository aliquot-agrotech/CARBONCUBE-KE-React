import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import './CategoryAnalytics.css'; // Ensure this file contains your CSS

const CategoryAnalytics = ({ data }) => {
  const chartData = (category) => ({
    labels: ['Sold', 'Remaining'],
    datasets: [
      {
        data: [category.total_sold, 100 - category.total_sold], // Assuming 100 as a max for demo purposes
        backgroundColor: ['#FF6384', '#DDDDDD'],
        hoverBackgroundColor: ['#FF6384', '#DDDDDD'],
      },
    ],
  });

  const chartOptions = {
    cutout: '75%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="category-analytics">
      {data.map((category, index) => (
        <div className="chart-container" key={index}>
          <Doughnut data={chartData(category)} options={chartOptions} />
          <div className="chart-label">
            <span>{category.category_name}</span>
            <span>{category.total_sold}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryAnalytics;
