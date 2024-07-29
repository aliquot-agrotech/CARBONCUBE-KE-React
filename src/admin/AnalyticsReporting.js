import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import SalesPerformance from './components/SalesPerformance';
import TopSellingProducts from './components/TopSellingProducts';
import CustomerInsights from './components/CustomerInsights';
import CategoryAnalytics from './components/CategoryAnalytics'; // Ensure this is imported
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
      <Container fluid className="analytics-reporting-page">
        <Row>
          <Col xs={12} md={2} className="p-0">
            <Sidebar />
          </Col>
          <Col xs={12} md={10} className="flex mt-4">
            <Row>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title className='text-center'>Total Vendors</Card.Title>
                    <Card.Text className='text-center'>{analyticsData.total_vendors}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title className='text-center'>Total Purchasers</Card.Title>
                    <Card.Text className='text-center'>{analyticsData.total_purchasers}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title className='text-center'>Total Orders</Card.Title>
                    <Card.Text className='text-center'>{analyticsData.total_orders}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title className='text-center'>Total Products</Card.Title>
                    <Card.Text className='text-center'>{analyticsData.total_products}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title className='text-center'>Total Reviews</Card.Title>
                    <Card.Text className='text-center'>{analyticsData.total_reviews}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title className='text-center'>Total Products Sold Out</Card.Title>
                    <Card.Text className='text-center'>{analyticsData.total_products_sold_out}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={3}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title className='text-center'>Total Revenue</Card.Title>
                    <Card.Text className='text-center'>Ksh: {analyticsData.total_revenue}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title className='text-center'>Sales Performance</Card.Title>
                    <SalesPerformance data={analyticsData.sales_performance} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title className='text-center'>Top Selling Products</Card.Title>
                    <TopSellingProducts data={analyticsData.best_selling_products} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
            <Col xs={12} md={6}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title className='text-center'>Customer Insights</Card.Title>
                    <CustomerInsights data={analyticsData.purchasers_insights} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-0">
                  <Card.Body>
                    <Card.Title className='text-center'>Category Analytics</Card.Title>
                    <CategoryAnalytics data={analyticsData.best_selling_categories} />
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
