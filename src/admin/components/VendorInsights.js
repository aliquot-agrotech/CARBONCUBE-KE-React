import React, { useState } from 'react';
import { Table, Form } from 'react-bootstrap';

const VendorInsightsTable = ({ data }) => {
    const [selectedMetric, setSelectedMetric] = useState('Total Orders');

    const handleMetricChange = (event) => {
        setSelectedMetric(event.target.value);
    };

    return (
        <div>
            {/* Vendors Insights Table */}
            <Table striped bordered hover className="text-center transparent-table">
                <thead>
                    <tr>
                        <th className="align-middle">#</th>
                        <th className="align-middle">Vendor Name</th>
                        <th className="align-middle">
                            {/* Dropdown directly inside the table head */}
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
                    {data.map((vendor, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{vendor.fullname}</td>
                            <td>
                                {selectedMetric === "Total Orders" && vendor.total_orders}
                                {selectedMetric === "Total Revenue" && vendor.total_revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                {selectedMetric === "Average Rating" && vendor.average_rating?.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default VendorInsightsTable;
