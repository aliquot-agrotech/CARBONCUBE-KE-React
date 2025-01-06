import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';

const VendorInsights = () => {
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
    fetch(`https://carboncube-ke-rails-cu22.onrender.com/admin/analytics?metric=${metric}`, {
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
              <th>#</th>
              <th>Vendor Name</th>
              <th>
                <Form.Control
                  className="rounded-pill mb-0 text-center p-0 fw-bold"
                  as="select"
                  value={selectedMetric}
                  onChange={handleMetricChange}
                >
                  <option>Total Orders</option>
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
                  {selectedMetric === 'Total Orders' && (
                    <strong className=" text-success fw-bold">{vendor.total_orders}</strong>
                  )}
                  {selectedMetric === 'Total Revenue' && (
                    <>
                      {/* <span className="text-success">
                        <em style={{ fontSize: '13px' }}>Kshs: &nbsp;</em>
                      </span> */}
                      <strong style={{ fontSize: '16px' }} className="text-success">
                        {Number(vendor.total_revenue || 0)
                          .toFixed(2)
                          .split('.')
                          .map((part, index) => (
                            <React.Fragment key={index}>
                              {index === 0 ? (
                                <span className="analytics-price-integer">
                                  {parseInt(part, 10).toLocaleString()} {/* Add commas to the integer part */}
                                </span>
                              ) : (
                                <>
                                  <span style={{ fontSize: '10px' }}>.</span>
                                  <span className="analytics-price-decimal">
                                    {(part || '00').padEnd(2, '0').slice(0, 2)} {/* Ensure two decimal points */}
                                  </span>
                                </>
                              )}
                            </React.Fragment>
                          ))}
                      </strong>
                    </>
                  )}
                  {selectedMetric === 'Rating' && (
                    <strong className="text-success fw-bold">
                      {vendor.mean_rating ? parseFloat(vendor.mean_rating).toFixed(2) : '0.00'}
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
