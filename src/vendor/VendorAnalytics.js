import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import SalesPerformance from './components/SalesPerformance';
import TopSellingProducts from './components/TopSellingProducts';
import Spinner from "react-spinkit";
import './VendorAnalytics.css';

const VendorAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://carboncube-ke-rails-qrvq.onrender.com/vendor/analytics', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
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
    return (
      <div className="centered-loader">
        <Spinner variant="warning" name="cube-grid" style={{ width: 100, height: 100 }} />
      </div>
    );
  }

  if (!analyticsData) {
    return <div>Error loading data</div>;
  }

  // Handle new vendors with no data
  const totalOrders = parseInt(analyticsData.total_orders, 10) || 0;
  const averageRating = parseInt(analyticsData.average_rating, 10) || 0;
  const totalProducts = parseInt(analyticsData.total_products, 10) || 0;
  const totalReviews = parseInt(analyticsData.total_reviews, 10) || 0;
  const totalRevenue = parseFloat(analyticsData.total_revenue) || 0;

  const formattedRevenue = totalRevenue.toFixed(2);

  return (
    <>
      <TopNavbar />
      <Container fluid className="analytics-reporting-page">
        <Row>
          <Col xs={12} lg={2} className="p-0">
            <Sidebar />
          </Col>
          <Col xs={12} lg={9} className="content-area">
            <Row>
              <Col xs={6} md={3} className="">
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Orders
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className="text-center">
                      <strong>{totalOrders.toLocaleString()}</strong>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
              <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Average Rating
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className="text-center">
                      <strong>{averageRating.toLocaleString()}</strong>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
              <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Products
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className="text-center">
                      <strong>{totalProducts.toLocaleString()}</strong>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
              <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Reviews
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className="text-center">
                      <strong>{totalReviews.toLocaleString()}</strong>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={3}>
              <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Revenue
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className="analytics-price-container">
                      <em className='analytics-product-price-label text-success'>Kshs: </em>
                      <strong className="text-danger">
                        {formattedRevenue.split('.').map((part, index) => (
                          <React.Fragment key={index}>
                            {index === 0 ? (
                              <span className="analytics-price-integer">
                                {parseInt(part, 10).toLocaleString()}
                              </span>
                            ) : (
                              <>
                                <span style={{ fontSize: '10px' }}>.</span>
                                <span className="analytics-price-decimal">{part}</span>
                              </>
                            )}
                          </React.Fragment>
                        ))}
                      </strong>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
              <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Sales Performance (Last 3 Months)
                  </Card.Header>
                  <Card.Body>
                    <SalesPerformance data={analyticsData.sales_performance || {}} totalRevenue={totalRevenue} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
              <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Top Selling Products
                  </Card.Header>
                  <Card.Body>
                    <TopSellingProducts data={analyticsData.best_selling_products || []} />
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

export default VendorAnalytics;
