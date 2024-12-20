import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Button, Accordion, Spinner, Container, Card } from 'react-bootstrap';
import '../css/Tiers.css';

const TierPage = () => {
  const [tiers, setTiers] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const vendorId = sessionStorage.getItem('vendor_id');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    axios
      .get('https://carboncube-ke-rails-4xo3.onrender.com/vendor/tiers', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTiers(response.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tier data:", err);
        setError("Failed to fetch tier data. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleSelectTier = (tierId) => {
    const token = sessionStorage.getItem('token');
    if (!vendorId) {
      console.error("Vendor ID not found in session storage.");
      return;
    }

    setSelectedTier(tierId);
    axios
      .put(
        `https://carboncube-ke-rails-4xo3.onrender.com/vendor/${vendorId}/tier`,
        { tier_id: tierId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => console.log('Tier updated successfully!'))
      .catch((err) => console.error('Error updating tier:', err));
  };

  if (loading) {
    return (
      <div className="loading-container d-flex flex-column align-items-center justify-content-center">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading tiers, please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="text-center my-5">
        <h2 className="text-danger">Error</h2>
        <p>{error}</p>
      </Container>
    );
  }

  return (
    <div className="pricing-page px-0 py-0">
      {/* Hero Section */}
      <section className="hero-section text-center mb-3 mb-lg-5 custom-card">
        <Container>
          <h1 className="display-4 fw-bold">Choose the Perfect Plan for Your Business</h1>
          <p className="lead">
            Whether you're just starting out or ready to scale, we have a plan that fits your needs. Explore our tiered
            options below.
          </p>
        </Container>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section p-2">
        <Container>
          <Row className="mb-4">
            {tiers.map((tier) => (
              <Col lg={3} md={6} sm={12} key={tier.id} className="p-0 p-lg-2 mb-3">
                <Card className={`tier-box ${selectedTier === tier.id ? 'selected' : ''} h-100 d-flex flex-column`}>
                  <Card.Body className="flex-grow-1 d-flex flex-column justify-content-between">
                    <div>
                      <Card.Title className="tier-title">{tier.name}</Card.Title>
                      <Card.Subtitle className="tier-description mb-3">Ads: {tier.ads_limit}</Card.Subtitle>
                      <ul className="tier-features list-unstyled mb-3">
                        {(tier.tier_features || []).map((feature) => (
                          <li key={feature.id}>✔ {feature.feature_name}</li>
                        ))}
                      </ul>
                      <div className="pricing-details text-center">
                        {(tier.tier_pricings || []).map((pricing) => (
                          <div key={pricing.id} className="pricing-option">
                            <span>
                              <strong>{pricing.duration_months}</strong> months: {pricing.price} KES
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      style={{ backgroundColor: 'black', borderColor: 'black' }}
                      className="w-100 rounded-pill text-white mt-3"
                      onClick={() => handleSelectTier(tier.id)}
                    >
                      {selectedTier === tier.id ? 'Selected' : 'Select Tier'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Feature Breakdown
      <section className="feature-breakdown my-5">
        <Container>
          <h2 className="text-center">What's Included in Each Tier</h2>
          <p className="text-center">Each tier comes with a set of features to help your business grow.</p>
          <Row className="g-4">
            {tiers.map((tier) => (
              <Col md={6} sm={12} key={tier.id}>
                <Card className="feature-box">
                  <Card.Body>
                    <Card.Title>{tier.name}</Card.Title>
                    <ul className="list-unstyled">
                      {(tier.tier_features || []).map((feature) => (
                        <li key={feature.id}>✔ {feature.feature_name}</li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section> */}

      {/* Pricing Comparison Table */}
      {tiers.length > 0 && tiers[0].tier_features && (
        <section className="pricing-comparison my-5">
          <Container>
            <h2 className="text-center">Pricing Comparison</h2>
            <table className="table table-bordered comparison-table mt-4">
              <thead className="table-light">
                <tr>
                  <th>Feature</th>
                  {tiers.map((tier) => (
                    <th key={tier.id}>{tier.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tiers[0].tier_features.map((feature, index) => (
                  <tr key={index}>
                    <td>{feature.feature_name}</td>
                    {tiers.map((tier) => (
                      <td key={tier.id}>
                        {tier.tier_features.find((f) => f.id === feature.id) ? '✔' : '✘'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Container>
        </section>
      )}

      {/* FAQs Section */}
      <section className="faqs my-5">
        <Container>
          <h2 className="text-center mb-4">Frequently Asked Questions</h2>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>What happens if I upgrade or downgrade my tier?</Accordion.Header>
              <Accordion.Body>
                When you upgrade or downgrade, your billing will be adjusted accordingly. Your features will change to
                match the selected tier.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Can I change my tier anytime?</Accordion.Header>
              <Accordion.Body>
                Yes, you can change your tier anytime. We provide flexibility so you can choose what fits your evolving
                needs.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="cta text-center py-5">
        <Container>
          <h2>Ready to Get Started?</h2>
          <p>Choose your plan and start growing your business today!</p>
          <Button
            variant="success rounded-pill"
            size="lg"
            className="px-5"
            onClick={() => handleSelectTier(selectedTier)}
          >
            Select Your Plan
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default TierPage;
