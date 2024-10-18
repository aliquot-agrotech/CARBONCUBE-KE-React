import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Col, Row } from 'react-bootstrap';
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
    <Row>
      {data.map((category, index) => (
        <Col xs={6} md={4} lg={3} className="mb-4" key={index}>
          <div className="category-analytics text-center">
          <div className="chart-container">
          <div >
              <Doughnut data={chartData(category)} options={chartOptions} />
            </div>
            <div className="chart-label mt-2">
              <p><span>{category.category_name}</span></p>
            </div>
            <div className="chart-label">
              <span><strong className="text-danger">
                {((category.total_sold / totalProductsSold) * 100).toFixed(2)} %
              </strong></span>
            </div>
          </div>
          </div>
            
        </Col>
      ))}
    </Row>    
  );
};

export default CategoryAnalytics;
