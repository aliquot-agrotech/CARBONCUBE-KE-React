import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Button, Accordion, Spinner } from 'react-bootstrap';
import '../css/Tiers.css'; // Custom CSS for enhanced design

const TierPage = () => {
  const [tiers, setTiers] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const vendorId = sessionStorage.getItem('vendor_id');

  useEffect(() => {
    axios
      .get('https://carboncube-ke-rails-4xo3.onrender.com/vendor/tiers')
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
    if (!vendorId) {
      console.error("Vendor ID not found in session storage.");
      return;
    }

    setSelectedTier(tierId);

    axios
      .put(`https://carboncube-ke-rails-4xo3.onrender.com/vendor/${vendorId}/tier`, { tier_id: tierId })
      .then(() => {
        console.log('Tier updated successfully!');
      })
      .catch((err) => {
        console.error('Error updating tier:', err);
      });
  };

  if (loading) {
    return (
      <div className="loading-container text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading tiers, please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container text-center">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <section className="hero-section text-center">
        <h1 className="display-4">Choose the Perfect Plan for Your Business</h1>
        <p className="lead">
          Whether you're just starting out or ready to scale, we have a plan that fits your needs. Explore our tiered
          options below.
        </p>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <Row className="g-4">
          {tiers.map((tier) => (
            <Col md={4} sm={12} key={tier.id}>
              <div className={`tier-box ${selectedTier === tier.id ? 'selected' : ''}`}>
                <h3 className="tier-title">{tier.name}</h3>
                <p className="tier-description">Ads: {tier.ads_limit}</p>
                <ul className="tier-features">
                  {(tier.tier_features || []).map((feature) => (
                    <li key={feature.id}>{feature.feature_name}</li>
                  ))}
                </ul>
                <div className="pricing-details">
                  {(tier.tier_pricings || []).map((pricing) => (
                    <div key={pricing.id} className="pricing-option">
                      <span>
                        {pricing.duration_months} months: {pricing.price} KES
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  variant={selectedTier === tier.id ? 'success' : 'primary'}
                  block
                  onClick={() => handleSelectTier(tier.id)}
                >
                  {selectedTier === tier.id ? 'Selected' : 'Select Tier'}
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Feature Breakdown */}
      <section className="feature-breakdown text-center">
        <h2>What's Included in Each Tier</h2>
        <p>Each tier comes with a set of features to help your business grow. Below is a detailed breakdown.</p>
        <Row>
          {tiers.map((tier) => (
            <Col md={6} sm={12} key={tier.id}>
              <div className="feature-box">
                <h4>{tier.name}</h4>
                <ul>
                  {(tier.tier_features || []).map((feature) => (
                    <li key={feature.id}>{feature.feature_name}</li>
                  ))}
                </ul>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Pricing Comparison Table */}
      {tiers.length > 0 && tiers[0].tier_features && (
        <section className="pricing-comparison">
          <h2 className="text-center">Pricing Comparison</h2>
          <div className="comparison-table">
            <table>
              <thead>
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
          </div>
        </section>
      )}

      {/* FAQs Section */}
      <section className="faqs">
        <h2>Frequently Asked Questions</h2>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>What happens if I upgrade or downgrade my tier?</Accordion.Header>
            <Accordion.Body>
              When you upgrade or downgrade, your billing will be adjusted according to the selected tier. Your features
              will change accordingly, and you'll have access to the additional benefits of the higher tier.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Can I change my tier anytime?</Accordion.Header>
            <Accordion.Body>
              Yes, you can change your tier at any time. We offer flexibility, so you can choose a plan that fits your
              evolving business needs.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </section>

      {/* Call to Action Section */}
      <section className="cta text-center">
        <h2>Ready to Get Started?</h2>
        <p>Choose your plan and start growing your business today! Select a tier and unlock the full potential of the marketplace.</p>
        <Button variant="success" size="lg" onClick={() => handleSelectTier(selectedTier)}>
          Select Your Plan
        </Button>
      </section>
    </div>
  );
};

export default TierPage;
