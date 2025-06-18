import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Modal, Form, Button } from 'react-bootstrap';
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
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/seller/analytics`, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log('API Response:', data);

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
              seller_revenue: 0,
              total_category_revenue: 0,
              revenue_share: 0
            },
            top_competitor_ads: [],
            competitor_average_price: 0
          }
        };

        // console.log('Validated Analytics:', validatedAnalytics);

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

  const handleReplyClick = (review) => {
    setSelectedReview(review);
    setReplyText(review.seller_reply || '');
    setShowReplyModal(true);
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!selectedReview) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/seller/reviews/${selectedReview.id}/reply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
          body: JSON.stringify({ seller_reply: replyText }),
        }
      );
      if (!response.ok) throw new Error("Failed to submit reply");

      // Refresh reviews
      fetchReviews(); // Your function to reload
      setShowReplyModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit reply. Please try again.");
    }
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/seller/reviews`, {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err.message);
    } finally {
      setLoadingReviews(false);
    }
  };

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
                      <Card.Text
                        className="text-center text-primary"
                        role="button"
                        style={{ fontSize: '1.3rem', textDecoration: 'underline' }}
                        onClick={() => {
                          setShowReviewsModal(true);
                          fetchReviews();
                        }}
                      >
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
        
        <Modal
          show={showReviewsModal}
          onHide={() => setShowReviewsModal(false)}
          centered
          size="lg"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header className="text-white py-2 justify-content-center">
            <Modal.Title className="fw-bold">
              <i className="bi bi-star-half me-2"></i> Buyer Reviews
            </Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {loadingReviews ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <Card key={review.id || idx} className="mb-3 border-0 shadow-sm">
                  <Card.Body className="bg-white rounded">
                    <div className="d-flex align-items-start">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.buyer_name)}&background=random`}
                        className="rounded-circle me-3"
                        alt="Avatar"
                        width="60"
                        height="60"
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <h6 className="fw-semibold text-dark mb-0">
                            {review.buyer_name || `Buyer #${review.buyer_id}`}
                          </h6>
                          <small className="text-muted">
                            {review.created_at ? new Date(review.created_at).toLocaleString() : "No date"}
                          </small>
                        </div>

                        <div className="mb-2 text-warning">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          <small className="text-muted ms-2">({review.rating}/5)</small>
                        </div>

                        <p className="text-muted fst-italic mb-2">
                          {review.review || 'No review provided.'}
                        </p>

                        {/* Seller reply section */}
                        {review.seller_reply ? (
                          <div className="bg-light p-2 rounded border border-success mb-2">
                            <strong className="text-success">Your Reply:</strong>
                            <p className="mb-1">{review.seller_reply}</p>
                          </div>
                        ) : null}

                        {/* Reply button */}
                        <Button
                          variant="outline-warning"
                          className="rounded-pill text-dark"
                          size="sm"
                          onClick={() => handleReplyClick(review)}
                        >
                          <i className="bi bi-reply-fill"></i> {review.seller_reply ? 'Edit Reply' : 'Reply'}
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted py-5">
                <i className="bi bi-chat-left-dots fs-1 mb-3"></i>
                <p>No reviews have been submitted yet.</p>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer className="py-1">
            <Button variant="danger" onClick={() => setShowReviewsModal(false)}>
              <i className="bi bi-x-circle me-1"></i> Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showReplyModal} onHide={() => setShowReplyModal(false)} centered>
          <Modal.Header className="text-white">
            <Modal.Title><i className="bi bi-pencil-square me-2"></i> Respond to Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitReply}>
              <Form.Group controlId="replyText">
                <Form.Label>Your Reply</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  className="bg-light"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="text-end mt-3">
                <Button type="submit " variant="warning" className="rounded-pill text-dark">
                  <i className="bi bi-send-fill me-1"></i> Submit Reply
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default VendorAnalytics;
