import React from 'react';
import { Table } from 'react-bootstrap';

const CustomerInsights = ({ data }) => {
  return (
    <Table striped bordered hover className='text-center'>
      <thead>
        <tr>
          <th>#</th>
          <th>Customer Name</th>
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

export default CustomerInsights;
