import React, { useState } from 'react';
import { Table, Form } from 'react-bootstrap';

const VendorInsightsTable = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState('Total Orders');

  const handleMetricChange = (event) => {
    setSelectedMetric(event.target.value);
  };

  const formatCurrency = (value) => {
    return value?.toLocaleString('en-US', { style: 'currency', currency: 'KES' }) || 'Ksh 0';
  };

  // Sorting function to sort vendors based on the selected metric
  const sortData = () => {
    return [...data].sort((a, b) => {
      if (selectedMetric === 'Total Orders') {
        return b.total_orders - a.total_orders;
      } else if (selectedMetric === 'Total Revenue') {
        return b.total_revenue - a.total_revenue;
      } else if (selectedMetric === 'Average Rating') {
        return b.mean_rating - a.mean_rating;
      }
      return 0; // Default: no sorting if no metric is selected
    });
  };

  return (
    <div>
      <Table striped bordered hover className="text-center transparent-table">
        <thead>
          <tr>
            <th className="align-middle">#</th>
            <th className="align-middle">Vendor Name</th>
            <th className="align-middle" style={{ width: '25%' }}>
              <Form.Control
                className="rounded-pill mb-0 text-center p-1"
                as="select"
                value={selectedMetric}
                onChange={handleMetricChange}
              >
                <option>Total Orders</option>
                <option>Total Revenue</option>
                <option>Average Rating</option>
              </Form.Control>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortData().map((vendor, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{vendor.fullname}</td>
              <td>
                {selectedMetric === "Total Orders" && vendor.total_orders}
                {selectedMetric === "Total Revenue" && formatCurrency(vendor.total_revenue)}
                {selectedMetric === "Average Rating" && (vendor.mean_rating?.toFixed(2) || 'N/A')}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default VendorInsightsTable;
