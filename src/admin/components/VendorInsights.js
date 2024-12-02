import React, { useState } from 'react';
import { Table, Form } from 'react-bootstrap';
// import './VendorInsights.css'; // Updated CSS file import

const VendorInsights = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState("Total Orders");

  // Function to handle dropdown changes
  const handleMetricChange = (e) => {
    setSelectedMetric(e.target.value);
  };

  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label>Select Metric:</Form.Label>
        <Form.Control
          as="select"
          value={selectedMetric}
          onChange={handleMetricChange}
        >
          <option>Total Orders</option>
          <option>Total Revenue</option>
          <option>Average Rating</option>
        </Form.Control>
      </Form.Group>
      
      <Table striped bordered hover className='text-center transparent-table'>
        <thead>
          <tr>
            <th>#</th>
            <th>Vendor Name</th>
            <th>{selectedMetric}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((vendor, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{vendor.fullname}</td>
              <td>
                {selectedMetric === "Total Orders" && vendor.total_orders}
                {selectedMetric === "Total Revenue" && vendor.total_revenue}
                {selectedMetric === "Average Rating" && vendor.average_rating}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default VendorInsights;
