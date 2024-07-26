import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import './AnalyticsReporting.css';

const AnalyticsReporting = () => {
  return (
    <>
      <TopNavbar />
      <Container fluid>
        <Row>
          <Col xs={12} md={3} className="p-0">
            <Sidebar />
          </Col>
          <Col xs={12} md={9} className="p-3">
            <Row>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Total Sales</Card.Title>
                    <Card.Text>4596</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Total Orders</Card.Title>
                    <Card.Text>2390</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Total Customers</Card.Title>
                    <Card.Text>523</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Revenue</Card.Title>
                    <Card.Text>Ksh: 12,350,000</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Sales Performance</Card.Title>
                    {/* Insert Sales Performance Chart here */}
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Top Selling Products</Card.Title>
                    {/* Insert Top Selling Products here */}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Customer Insights</Card.Title>
                    {/* Insert Customer Insights Chart here */}
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
