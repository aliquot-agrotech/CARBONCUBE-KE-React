import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import './AnalyticsReporting.css';

const AnalyticsReporting = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/admin/analytics', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'), // Replace with your actual token
      },
    })
      .then(response => response.json())
      .then(data => {
        setAnalyticsData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!analyticsData) {
    return <div>Error loading data</div>;
  }

  return (
    <>
      <TopNavbar />
      <Container fluid>
        <Row>
          <Col xs={12} md={2} className="p-0">
            <Sidebar />
          </Col>
          <Col xs={12} md={10} className="flex mt-4">
            <Row>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Total Vendors</Card.Title>
                    <Card.Text>{analyticsData.total_vendors}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Total Purchasers</Card.Title>
                    <Card.Text>{analyticsData.total_purchasers}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Total Orders</Card.Title>
                    <Card.Text>{analyticsData.total_orders}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Total Products</Card.Title>
                    <Card.Text>{analyticsData.total_products}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Total Reviews</Card.Title>
                    <Card.Text>{analyticsData.total_reviews}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Total Products Sold Out</Card.Title>
                    <Card.Text>{analyticsData.total_products_sold_out}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Total Revenue</Card.Title>
                    <Card.Text>Ksh: {analyticsData.total_revenue}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Sales Performance</Card.Title>
                    {/* Render Sales Performance Chart here */}
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Top Selling Products</Card.Title>
                    <ul>
                      {Object.entries(analyticsData.best_selling_products).map(([category, product]) => (
                        <li key={product.product_id}>
                          {category}: {product.product_title} ({product.total_sold} sold)
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Customer Insights</Card.Title>
                    <ul>
                      {analyticsData.purchasers_insights.map((purchaser, index) => (
                        <li key={index}>
                          {purchaser.fullname}: {purchaser.total_orders} orders
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Product Analytics</Card.Title>
                    {/* Insert Product Analytics Chart here */}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AnalyticsReporting;
