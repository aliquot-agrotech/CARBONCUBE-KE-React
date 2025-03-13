import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import ClickEventsStats from '../components/ClickEventsStats';
import TopWishListedAds from '../components/TopWishListedAds';
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
        const response = await fetch('http://carboncube-backend:3001/vendor/analytics', {
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
          top_wishlisted_ads: Array.isArray(data.basic_wishlist_stats?.top_wishlisted_ads) 
            ? data.basic_wishlist_stats.top_wishlisted_ads 
            : [],  // Ensure it's always an array
          click_events_stats: data.click_events_stats || {
            age_groups: [],
            income_ranges: [],
            education_levels: [],
            employment_statuses: [],
            sectors: []
          },
          basic_click_event_stats: data.basic_click_event_stats || {
            click_event_trends: []
          },
          wishlist_stats: data.wishlist_stats || {
            top_age_groups: [],
            top_income_ranges: [],
            top_education_levels: [],
            top_employment_statuses: [],
            top_by_sectors: []
          },
          basic_wishlist_stats: data.basic_wishlist_stats || {
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

        console.log('Validated Analytics:', validatedAnalytics);

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

  const {  average_rating, total_ads, total_reviews, top_wishlisted_ads } = analyticsData;

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
              <Col xs={12}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Subscription Countdown</Card.Header>
                  <Card.Body className="text-center">
                    <CountDownDisplay />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
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
            </Row>

            <Row>
            <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Top Wishlisted Ads</Card.Header>
                  <Card.Body>
                    {top_wishlisted_ads.length > 0 ? (
                      <TopWishListedAds data={top_wishlisted_ads} />
                    ) : (
                      <p className="text-center text-secondary">
                        No wishlisted ads found. <br />
                        <small>(Make sure your ads are added to wishlists by users.)</small>
                      </p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Competitor Stats</Card.Header>
                  <Card.Body className="py-1 px-3">
                    {tierId >= 3 ? ( // Adjust the required tier level if needed
                      <div>
                        <CompetitorStats data={analyticsData.competitor_stats} />
                      </div>
                    ) : (
                      <div className="text-secondary text-center">
                        <a href="/tiers" className="text-primary">Upgrade</a> to Standard Tier
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Click Events Stats</Card.Header>
                  <Card.Body className="py-1 px-3">
                    {tierId >= 2 ? ( // Adjust the required tier level if needed
                      <div>
                        <ClickEventsStats data={analyticsData.basic_click_event_stats.click_event_trends} />
                      </div>
                    ) : (
                      <div className="text-secondary text-center">
                        <a href="/tiers" className="text-primary">Upgrade</a> to Basic Tier
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={6}>
                <Card className="mb-4 custom-card">
                  <Card.Header>Wish List Stats</Card.Header>
                  <Card.Body className="py-1 px-3">
                    {tierId >= 3 ? ( // Adjust the required tier level if needed
                      <div>
                        <WishListStats data={analyticsData.basic_wishlist_stats} />
                      </div>
                    ) : (
                      <div className="text-secondary text-center">
                        <a href="/tiers" className="text-primary">Upgrade</a> to Standard Tier
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
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
              </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VendorAnalytics;
