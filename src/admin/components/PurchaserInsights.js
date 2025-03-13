import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import './PurchaserInsights.css'; // Import the CSS files

const PurchaserInsights = () => {
  const [selectedMetric, setSelectedMetric] = useState('Total Wishlists');
  const [purchasersData, setPurchasersData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMetricChange = (event) => {
    const metric = event.target.value;
    setSelectedMetric(metric);
    fetchPurchasersData(metric);
  };

  const fetchPurchasersData = (metric) => {
    setLoading(true);
    fetch(`http://carboncube-backend:3001/admin/analytics?metric=${metric}`, {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPurchasersData(data.purchasers_insights || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching purchaser insights:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPurchasersData(selectedMetric);
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
              <th>Purchaser Name</th>
              <th>
                <Form.Control
                  className="rounded-pill mb-0 text-center p-0 fw-bold"
                  as="select"
                  value={selectedMetric}
                  onChange={handleMetricChange}
                >
                  <option>Total Wishlists</option>
                  <option>Total Click Events</option>
                </Form.Control>
              </th>
            </tr>
          </thead>
          <tbody>
            {purchasersData.map((purchaser, index) => (
              <tr key={purchaser.purchaser_id || index}>
                <td>{index + 1}</td>
                <td>{purchaser.fullname}</td>
                <td>
                  {selectedMetric === 'Total Wishlists' && (
                    <strong className=" text-success fw-bold">{purchaser.total_wishlists}</strong>
                  )}
                  {selectedMetric === 'Total Click Events' && (
                    <>
                      <strong style={{ fontSize: '16px' }} className="text-success">
                        {purchaser.total_clicks || 0}{}
                      </strong>
                    </>
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

export default PurchaserInsights;

