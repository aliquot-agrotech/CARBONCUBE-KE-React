import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import './CategoryAnalytics.css'; // Ensure this file contains your CSS

const CategoryAnalytics = ({ data }) => {
  const totalProductsSold = data.reduce((sum, category) => sum + category.total_sold, 0);

  const chartData = (category) => {
    const percentageSold = ((category.total_sold / totalProductsSold) * 100).toFixed(2);
    return {
      labels: ['Sold', 'Remaining'],
      datasets: [
        {
          data: [percentageSold, 100 - percentageSold],
          backgroundColor: ['#FFC107', '#DDDDDD'],
          hoverBackgroundColor: ['#0019ff', '#DDDDDD'],
        },
      ],
    };
  };

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
            <p><span>{category.category_name} </span></p>
          </div>
          <div className="chart-label">
            <span><strong>{((category.total_sold / totalProductsSold) * 100).toFixed(2)} %</strong></span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryAnalytics;
