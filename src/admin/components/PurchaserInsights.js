import React from 'react';
import { Table } from 'react-bootstrap';
import './PurchaserInsights.css'; // Import the CSS file

const PurchaserInsights = ({ data }) => {
  return (
    <Table striped bordered hover className='text-center transparent-table'>
      <thead>
        <tr>
          <th>#</th>
          <th>Purchaser Name</th>
          <th>Total Orders</th>
        </tr>
      </thead>
      <tbody>
        {data.map((purchaser, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{purchaser.fullname}</td>
            <td>{purchaser.total_orders}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PurchaserInsights;
