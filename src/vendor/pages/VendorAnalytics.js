import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import SalesPerformance from '../components/SalesPerformance';
import TopSellingAds from '../components/TopSellingAds';
import WishListStats from '../components/WishListStats';
import CompetitorStats from '../components/CompetitorStats';
import Spinner from "react-spinkit";
import '../css/VendorAnalytics.css';

const VendorAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [tierId, setTierId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('https://carboncube-ke-rails-cu22.onrender.com/vendor/analytics', {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        const validatedAnalytics = {
          tier_id: data.tier_id || 1,
          total_orders: data.total_orders || 0,
          total_ads: data.total_ads || 0,
          total_reviews: data.total_reviews || 0,
          average_rating: data.average_rating || 0,
          total_revenue: data.total_revenue || '0.0',
          sales_performance: data.sales_performance || {},
          best_selling_ads: data.best_selling_ads || [],
          wishlist_stats: data.wishlist_stats || {
            top_wishlisted_products: [],
            wishlist_conversion_rate: 0,
            wishlist_trends: []
          },
          competitor_stats: data.competitor_stats || {
            revenue_share: {
              vendor_revenue: 0,
              total_category_revenue: 0,
              revenue_share: 0
            },
            top_competitor_ads: [],
            competitor_average_price: 0
          }
        };
        

        setTierId(validatedAnalytics.tier_id);
        setAnalyticsData(validatedAnalytics);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

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

  const { total_orders, average_rating, total_ads, total_reviews, total_revenue, sales_performance, best_selling_ads } = analyticsData;

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
              {/* Analytics Cards */}
              <Col xs={6} md={3}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Total Orders</Card.Header>
                  <Card.Body>
                    <Card.Text className="text-center">
                      <strong>{total_orders.toLocaleString()}</strong>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Average Rating</Card.Header>
                  <Card.Body>
                    <Card.Text className="text-center">
                      <strong>{average_rating.toFixed(1)}</strong>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Total Ads</Card.Header>
                  <Card.Body>
                    {tierId >= 2 ? (
                      <Card.Text className="text-center">
                        <strong>{total_ads.toLocaleString()}</strong>
                      </Card.Text>
                    ) : (
                      <Card.Text className="text-center text-secondary">
                        <a href="/tiers" className="text-primary">Upgrade</a> to Basic Tier
                      </Card.Text>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Total Reviews</Card.Header>
                  <Card.Body>
                    {tierId >= 3 ? (
                      <Card.Text className="text-center">
                        <strong>{total_reviews.toLocaleString()}</strong>
                      </Card.Text>
                    ) : (
                      <Card.Text className="text-center text-secondary">
                        <a href="/tiers" className="text-primary">Upgrade</a> to Standard Tier
                      </Card.Text>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Total Revenue</Card.Header>
                  <Card.Body>
                    {tierId >= 3 ? (
                      <Card.Text className="text-center">
                        <span className="text-success" style={{ fontSize: '15px' }}>Kshs: </span>
                        <strong style={{ fontSize: '16px' }} className="text-danger">
                          {total_revenue ? Number(total_revenue).toFixed(2).split('.').map((part, index) => (
                            <React.Fragment key={index}>
                              {index === 0 ? (
                                <span className="price-integer">{parseInt(part, 10).toLocaleString()}</span>
                              ) : (
                                <>
                                  <span style={{ fontSize: '16px' }}>.</span>
                                  <span className="price-decimal">{part}</span>
                                </>
                              )}
                            </React.Fragment>
                          )) : 'N/A'}
                        </strong>
                      </Card.Text>
                    ) : (
                      <Card.Text className="text-center text-secondary">
                        <a href="/tiers" className="text-primary">Upgrade</a> to Standard Tier
                      </Card.Text>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Sales Performance (Last 3 Months)</Card.Header>
                  <Card.Body>
                    {tierId >= 3 ? (
                      <SalesPerformance data={sales_performance} totalRevenue={total_revenue} />
                    ) : (
                      <div className="text-secondary text-center">
                        <a href="/tiers" className="text-primary">Upgrade</a> to Standard Tier
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Top Selling Ads</Card.Header>
                  <Card.Body>
                    {tierId >= 4 ? (
                      <TopSellingAds data={best_selling_ads} />
                    ) : (
                      <div className="text-secondary text-center">
                        <a href="/tiers" className="text-primary">Upgrade</a> to Premium Tier
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>WishList Stats</Card.Header>
                  <Card.Body className="py-1 px-3">
                    <div>
                      <WishListStats data={analyticsData.wishlist_stats} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Competitor Stats</Card.Header>
                  <Card.Body className="py-1 px-3">
                    <div>
                      <CompetitorStats data={analyticsData.competitor_stats} />
                    </div>
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
