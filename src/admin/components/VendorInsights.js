import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';

const VendorInsights = () => {
  const [selectedMetric, setSelectedMetric] = useState('Rating');
  const [vendorsData, setVendorsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMetricChange = (event) => {
    const metric = event.target.value;
    setSelectedMetric(metric);
    fetchVendorsData(metric);
  };

  const fetchVendorsData = (metric) => {
    setLoading(true);
    fetch(`http://carboncube-backend:3001/admin/analytics?metric=${metric}`, {
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

  return (
    <div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <Table striped bordered hover className="text-center transparent-table">
          <thead>
            <tr>
              <th>No:</th>
              <th>Vendor Name</th>
              <th>
                <Form.Control
                  className="rounded-pill mb-0 text-center p-0 fw-bold"
                  as="select"
                  value={selectedMetric}
                  onChange={handleMetricChange}
                >
                  <option>Rating</option>
                  <option>Total Ads</option>
                  <option>Reveal Clicks</option>
                  <option>Ad Clicks</option>
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
                  {selectedMetric === 'Rating' && (
                    <strong className=" text-success fw-bold">{vendor.mean_rating ? parseFloat(vendor.mean_rating).toFixed(2) : '0.00'}</strong>
                  )}
                  {selectedMetric === 'Total Ads' && (
                    <>
                      <strong style={{ fontSize: '16px' }} className="text-success">
                        {vendor.total_ads}
                      </strong>
                    </>
                  )}
                  {selectedMetric === 'Reveal Clicks' && (
                    <strong className="text-success fw-bold">
                      {vendor.reveal_clicks}
                    </strong>
                  )}
                  {selectedMetric === 'Ad Clicks' && (
                    <strong className="text-success fw-bold">
                      {vendor.total_ad_clicks}
                    </strong>
                  )}               
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default VendorInsights;
