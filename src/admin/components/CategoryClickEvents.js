import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Col, Row } from 'react-bootstrap';
import 'chart.js/auto';
import './CategoryClickEvents.css'; // Ensure this file contains your CSS

const CategoryClickEvents = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div className="text-center">Loading category analytics...</div>;
  }

  // Function to calculate the total number of clicks for each category
  const totalClicks = (category) => {
    return category.ad_clicks + category.wish_list_clicks + category.reveal_clicks;
  };

  // Function to prepare the chart data for each category
  const chartData = (category) => {
    const totalCategoryClicks = totalClicks(category);
    const adClickPercentage = totalCategoryClicks > 0 ? ((category.ad_clicks / totalCategoryClicks) * 100).toFixed(2) : 0;
    const wishListClickPercentage = totalCategoryClicks > 0 ? ((category.wish_list_clicks / totalCategoryClicks) * 100).toFixed(2) : 0;
    const revealClickPercentage = totalCategoryClicks > 0 ? ((category.reveal_clicks / totalCategoryClicks) * 100).toFixed(2) : 0;

    return {
      labels: [], // Removed all labels from the doughnut chart itself
      datasets: [
        {
          data: [adClickPercentage, wishListClickPercentage, revealClickPercentage],
          backgroundColor: ['#919191', '#FF9800', '#363636'],
        },
      ],
    };
  };

  // Chart options with custom tooltips
  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            const category = data[tooltipItem.datasetIndex];
            const totalCategoryClicks = totalClicks(category);
            
            const labels = ['Ad-Click', 'Add-to-Wish-List', 'Reveal-Seller-Details'];
            const values = [category.ad_clicks, category.wish_list_clicks, category.reveal_clicks];
            const percentages = [
              totalCategoryClicks > 0 ? ((category.ad_clicks / totalCategoryClicks) * 100).toFixed(2) : 0,
              totalCategoryClicks > 0 ? ((category.wish_list_clicks / totalCategoryClicks) * 100).toFixed(2) : 0,
              totalCategoryClicks > 0 ? ((category.reveal_clicks / totalCategoryClicks) * 100).toFixed(2) : 0
            ];

            return [
              labels[index],
              `${values[index]} clicks`,
              `${percentages[index]}%`
            ];
          },
        },
      },
    },
  };
  

  return (
    <div>
      

      {/* Render the doughnut charts */}
      <Row>
        {data.map((category, index) => {
          return (
            <Col xs={6} md={4} lg={3} className="mb-4" key={index}>
              <div className="category-analytics text-center">
                <div className="chart-container">
                  <Doughnut data={chartData(category)} options={chartOptions} />
                </div>
                <div className="category-info2 mt-2">
                  <p><strong>{category.category_name}</strong></p>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* Display a single shared legend */}
      <div className="custom-legend mb-4">
            <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#919191' }}></div>
                <div className="legend-label">Ad Click</div>
            </div>
            <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#FF9800' }}></div>
                <div className="legend-label">Add to Wish List</div>
            </div>
            <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#363636' }}></div>
                <div className="legend-label">Reveal Vendor Details</div>
                </div>
        </div>
    </div>
  );
};

export default CategoryClickEvents;
