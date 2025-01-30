import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
// import SalesPerformance from '../components/SalesPerformance';
import TopSellingAds from '../components/TopSellingAds';
import WishListStats from '../components/WishListStats';
import CompetitorStats from '../components/CompetitorStats';
import CountDownDisplay from '../components/CountDownDisplay';
import PurchaserDemographics from "../components/PurchaserDemographics";
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
          total_ads: data.total_ads || 0,
          total_reviews: data.total_reviews || 0,
          average_rating: data.average_rating || 0.0,
          best_selling_ads: data.best_selling_ads || [],
          click_events_stats: data.click_events_stats || {
            age_groups: [],
            income_ranges: [],
            education_levels: [],
            employment_statuses: [],
            sectors: []
          },
          wishlist_stats: data.wishlist_stats || {
            top_age_groups: [],
            top_income_ranges: [],
            top_education_levels: [],
            top_employment_statuses: [],
            top_by_sectors: []
          },
          basic_wishlist_stats: data.basic_wishlist_stats || {
            top_wishlisted_products: [],
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

  const {  average_rating, total_ads, total_reviews, best_selling_ads } = analyticsData;

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
              <Col xs={12} md={4}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Subscription Countdown</Card.Header>
                  <Card.Body className="text-center">
                    <CountDownDisplay />
                  </Card.Body>
                </Card>
              </Col>
              
              <Col xs={6} md={4}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Average Rating</Card.Header>
                  <Card.Body>
                    <Card.Text className="text-center" style={{ fontSize: '1.3rem'}}>
                      <strong>{average_rating.toFixed(1)}</strong>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={4}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Total Ads</Card.Header>
                  <Card.Body>
                    {tierId >= 2 ? (
                      <Card.Text className="text-center" style={{ fontSize: '1.3rem'}}>
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
              <Col xs={6} md={4}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Total Reviews</Card.Header>
                  <Card.Body>
                    {tierId >= 3 ? (
                      <Card.Text className="text-center" style={{ fontSize: '1.3rem'}}>
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
              {/*  */}
            </Row>
            <Row>
              
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
                  <Card.Header>Competitor Stats</Card.Header>
                  <Card.Body className="py-1 px-3">
                    <div>
                      <CompetitorStats data={analyticsData.competitor_stats} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>WishList Stats</Card.Header>
                  <Card.Body className="py-1 px-3">
                    <div>
                      <WishListStats data={analyticsData.basic_wishlist_stats} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Col xs={12}>
  <Card className="mb-4 custom-card">
    <Card.Header>Purchaser Demographics</Card.Header>
    <Card.Body>
      {tierId >= 3 ? (
        <PurchaserDemographics
          data={{
            clickEvents: analyticsData.click_events_stats,
            wishlistStats: analyticsData.wishlist_stats,
          }}
        />
      ) : (
        <div className="text-secondary text-center">
          <a href="/tiers" className="text-primary">Upgrade</a> to Standard Tier
        </div>
      )}
    </Card.Body>
  </Card>
</Col>

          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VendorAnalytics;
