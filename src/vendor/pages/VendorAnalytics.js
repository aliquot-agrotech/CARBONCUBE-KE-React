import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import SalesPerformance from '../components/SalesPerformance';
import TopSellingProducts from '../components/TopSellingProducts';
import Spinner from "react-spinkit";
import '../css/VendorAnalytics.css';

const VendorAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [currentTier, setCurrentTier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('https://carboncube-ke-rails-4xo3.onrender.com/vendor/analytics', {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('API Response:', data);
    
        // Validate response structure and set defaults for missing fields
        const validatedAnalytics = {
          total_orders: data.total_orders || 0,
          total_products: data.total_products || 0,
          total_reviews: data.total_reviews || 0,
          average_rating: data.average_rating || 0,
          total_revenue: data.total_revenue || 0.0,
        };
    
        setAnalyticsData(validatedAnalytics);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err.message);
        setLoading(false);
      }
    };
    
    

    fetchAnalytics();
  }, []);

  const canAccess = (tierRequirement) => currentTier >= tierRequirement;

  if (loading) {
    return (
      <div className="centered-loader">
        <Spinner variant="warning" name="cube-grid" style={{ width: 100, height: 100 }} />
      </div>
    );
  }

  if (error) {
    return (
      <Container fluid className="analytics-reporting-page">
        <Row>
          <Col xs={12} className="text-center mt-4">
            <h4>Error Loading Data</h4>
            <p>{error}</p>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!analyticsData) {
    return (
      <Container fluid className="analytics-reporting-page">
        <Row>
          <Col xs={12} className="text-center mt-4">
            <h4>No Analytics Data Available</h4>
            <p>Upgrade your package to access analytics data.</p>
          </Col>
        </Row>
      </Container>
    );
  }

  // Safe fallback values
  const totalOrders = parseInt(analyticsData.total_orders, 10) || 0;
  const averageRating = parseInt(analyticsData.average_rating, 10) || 0;
  const totalProducts = parseInt(analyticsData.total_products, 10) || 0;
  const totalReviews = parseInt(analyticsData.total_reviews, 10) || 0;
  const totalRevenue = parseFloat(analyticsData.total_revenue) || 0;
  // const formattedRevenue = totalRevenue.toFixed(2);

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
              <Col xs={6} md={3}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Orders
                  </Card.Header>
                  <Card.Body>
                    {canAccess(1) ? (
                      <Card.Text className="text-center">
                        <strong>{totalOrders.toLocaleString()}</strong>
                      </Card.Text>
                    ) : (
                      <Card.Text className="text-center text-gray">
                        Upgrade to Tier 1 to view this data
                      </Card.Text>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Average Rating
                  </Card.Header>
                  <Card.Body>
                    {canAccess(2) ? (
                      <Card.Text className="text-center">
                        <strong>{averageRating.toLocaleString()}</strong>
                      </Card.Text>
                    ) : (
                      <Card.Text className="text-center text-warning">
                        Upgrade to Tier 2 to view this data
                      </Card.Text>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Products
                  </Card.Header>
                  <Card.Body>
                    {canAccess(2) ? (
                      <Card.Text className="text-center">
                        <strong>{totalProducts.toLocaleString()}</strong>
                      </Card.Text>
                    ) : (
                      <Card.Text className="text-center text-warning">
                        Upgrade to Tier 2 to view this data
                      </Card.Text>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Total Reviews
                  </Card.Header>
                  <Card.Body>
                    {canAccess(3) ? (
                      <Card.Text className="text-center">
                        <strong>{totalReviews.toLocaleString()}</strong>
                      </Card.Text>
                    ) : (
                      <Card.Text className="text-center text-warning">
                        Upgrade to Tier 3 to view this data
                      </Card.Text>
                    )}
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
                    {canAccess(3) ? (
                      <SalesPerformance data={analyticsData.sales_performance || {}} totalRevenue={totalRevenue} />
                    ) : (
                      <div className="text-warning text-center">
                        Upgrade to Tier 3 to access sales performance analytics.
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-2 mb-lg-4 custom-card">
                  <Card.Header className="justify-content-center">
                    Top Selling Products
                  </Card.Header>
                  <Card.Body>
                    {canAccess(3) ? (
                      <TopSellingProducts data={analyticsData.best_selling_products || []} />
                    ) : (
                      <div className="text-warning text-center">
                        Upgrade to Tier 3 to access top-selling products data.
                      </div>
                    )}
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
