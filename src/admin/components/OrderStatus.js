import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Col, Row } from 'react-bootstrap';
import 'chart.js/auto';

const OrderStatus = ({ data }) => {
  // Ensure `data` contains the statuses and their counts
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>No data available for order statuses.</p>;
  }

  // Prepare chart options
  const chartOptions = {
    cutout: '75%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Helper function to map statuses to colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Cancelled':
        return '#FF0000'; // Red
      case 'Dispatched':
        return '#007BFF'; // Blue
      case 'In-Transit':
        return '#80CED7'; // Light Blue
      case 'Returned':
        return '#6C757D'; // Grey
      case 'Processing':
        return '#FFC107'; // Yellow
      case 'Delivered':
        return '#008000'; // Green
      default:
        return '#E0E0E0'; // Default grey for any unknown status
    }
  };

  // Helper to create chart data for individual statuses
  const getChartData = (status) => ({
    labels: ['Orders', 'Remaining'],
    datasets: [
      {
        data: [status.count, data.reduce((sum, s) => sum + s.count, 0) - status.count],
        backgroundColor: [getStatusColor(status.name), '#E0E0E0'], // Status color and remaining color
        hoverBackgroundColor: [getStatusColor(status.name), '#CCCCCC'],
      },
    ],
  });

  return (
    <Row className="order-status-analytics">
      {data.map((status, index) => (
        <Col xs={6} md={12} lg={2} key={index} className="text-center mb-0">
          <div className="chart-container">
            <Doughnut data={getChartData(status)} options={chartOptions} />
            <div className="chart-label mt-3">
              <p><strong>{status.name}</strong></p>
              <p>{status.count} orders</p>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default OrderStatus;
