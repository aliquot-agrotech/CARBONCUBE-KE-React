import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';

const VendorInsightsTable = () => {
  const [selectedMetric, setSelectedMetric] = useState('Total Orders');
  const [vendorsData, setVendorsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMetricChange = (event) => {
    const metric = event.target.value;
    setSelectedMetric(metric);
    fetchVendorsData(metric);
  };

  const fetchVendorsData = (metric) => {
    setLoading(true);
    fetch(`https://carboncube-ke-rails-4xo3.onrender.com/admin/analytics?metric=${metric}`, {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setVendorsData(data.vendors_insights || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching vendor insights:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVendorsData(selectedMetric);
  }, [selectedMetric]); // Initial fetch

  const formatCurrency = (value) =>
    value?.toLocaleString('en-US', { style: 'currency', currency: 'KES' }) || 'Ksh 0';

  return (
    <div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <Table striped bordered hover className="text-center transparent-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Vendor Name</th>
              <th>
                <Form.Control
                  className="rounded-pill mb-0 text-center p-0 fw-bold"
                  as="select"
                  value={selectedMetric}
                  onChange={handleMetricChange}
                >
                  <option >Total Orders</option>
                  <option>Total Revenue</option>
                  <option>Rating</option>
                </Form.Control>
              </th>
            </tr>
          </thead>
          <tbody>
            {vendorsData.map((vendor, index) => (
              <tr key={vendor.vendor_id || index}>
                <td>{index + 1}</td>
                <td>{vendor.fullname}</td>
                <td>
                  {selectedMetric === 'Total Orders' && vendor.total_orders}
                  {selectedMetric === 'Total Revenue' && formatCurrency(vendor.total_revenue)}
                  {selectedMetric === 'Rating' && vendor.mean_rating}  
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default VendorInsightsTable;
