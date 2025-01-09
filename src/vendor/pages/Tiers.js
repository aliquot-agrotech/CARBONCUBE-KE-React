import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Button, Accordion, Container, Card, Modal } from 'react-bootstrap';
import Spinner from "react-spinkit";
import { useNavigate } from "react-router-dom";
import '../css/Tiers.css';
import { jwtDecode } from 'jwt-decode';

const TierPage = () => {
  const [tiers, setTiers] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // const vendorId = sessionStorage.getItem('vendor_id');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    axios
      .get('https://carboncube-ke-rails-cu22.onrender.com/vendor/tiers', {
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

  const handleSelectTier = async (tierId) => {
    const vendorId = getVendorIdFromToken();
    if (!vendorId) {
      console.error('Vendor ID not found in session storage.');
      return;
    }
  
    try {
      const response = await fetch(`/https://carboncube-ke-rails-cu22.onrender.com/vendor/tiers/${tierId}/update_tier`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`, // Send token
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Tier updated successfully:', data.message);
      } else {
        console.error('Failed to update tier:', data.error);
      }
    } catch (error) {
      console.error('Error updating tier:', error);
    }
  };

  const handleTierSelect = (tierId) => {
    setSelectedTier(tierId); // Set the selected tier ID
    setShowModal(true); // Show the modal for duration selection
  };

  const handleDurationSelect = async (duration) => {
    const token = sessionStorage.getItem("token");
  
    if (!token) {
      alert("You are not logged in. Please log in and try again.");
      return;
    }
  
    try {
      const durationString = `${duration} months`;
  
      const response = await axios.patch(
        "https://carboncube-ke-rails-cu22.onrender.com/vendor/tiers/update_tier",
        {
          tier_id: selectedTier, // Pass the selected tier ID
          tier_duration: durationString, // Pass the selected duration
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log("Tier updated successfully:", response.data);
      alert("Your tier and duration have been successfully updated.");
      setShowModal(false); // Close the modal
      setSelectedTier(null); // Reset the selected tier after duration selection
    } catch (error) {
      console.error("Error updating tier:", error);
      alert(
        error.response?.data?.error ||
          "An error occurred while updating your tier. Please try again."
      );
    }
  };
  

  function getVendorIdFromToken() {
    const token = sessionStorage.getItem('token'); // Adjust if stored differently
    if (!token) {
      console.error('Token not found in session storage');
      return null;
    }
  
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.vendor_id; // Ensure this matches your token structure
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }



  if (loading) {
      return (
          <div className="centered-loader">
              <Spinner variant="warning" name="cube-grid" style={{ width: 100, height: 100 }} />
              {/* <p className="mt-3">Loading tiers, please wait...</p> */}
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
          
          {/* Home Button */}
          <Button
            onClick={() => navigate("/vendor/analytics")}
            className="btn btn-dark mt-4 rounded-pill" // Bootstrap classes for styling
          >
            Back to Home
          </Button>
        </Container>
      </section>


      {/* Pricing Section */}
      <section className="pricing-section p-2">
        <Container>
          <Row className="mb-4">
            {tiers
              .slice() // Create a shallow copy of the array to avoid mutating the original state
              .sort((a, b) => a.id - b.id) // Sort tiers by ascending ID
              .map((tier) => (
                <Col lg={3} md={6} sm={12} key={tier.id} className="p-0 p-lg-2 mb-3">
                  <Card
                    className={`tier-box h-100 d-flex flex-column ${selectedTier === tier.id ? 'selected-tier' : ''}`}
                  >
                  
                    <Card.Body className="flex-grow-1 d-flex flex-column justify-content-between">
                      <div>
                        <Card.Title className="tier-title text-secondary">{tier.name}</Card.Title>
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
                        onClick={() => handleTierSelect(tier.id)}
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

      {/* Feature Breakdown */}
      {tiers.length > 0 && (
        <section className="pricing-comparison my-5">
          <Container>
            <h2 className="text-center">Features Comparison</h2>
            <table className="table table-bordered comparison-table mt-4">
              <thead className="table-light">
                <tr>
                  <th>Feature</th>
                  {tiers
                    .slice()
                    .sort((a, b) => {
                      const priceA = a.tier_pricings && a.tier_pricings[0]?.price;
                      const priceB = b.tier_pricings && b.tier_pricings[0]?.price;
                      return priceA - priceB;
                    })
                    .map((tier) => (
                      <th key={tier.id}>{tier.name}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {/* Extract unique feature names from tier_features */}
                {tiers
                  .flatMap((tier) => tier.tier_features.map((feature) => feature.feature_name)) // Gather all features
                  .reduce((uniqueFeatures, feature) => {
                    if (!uniqueFeatures.includes(feature)) {
                      uniqueFeatures.push(feature); // Add unique features
                    }
                    return uniqueFeatures;
                  }, []) // Reduce to unique features list
                  .map((featureName, index) => (
                    <tr key={index}>
                      <td>{featureName}</td>
                      {tiers
                        .slice()
                        .sort((a, b) => {
                          const priceA = a.tier_pricings && a.tier_pricings[0]?.price;
                          const priceB = b.tier_pricings && b.tier_pricings[0]?.price;
                          return priceA - priceB;
                        })
                        .map((tier, tierIndex) => {
                          const isFeatureInCurrentTier = tier.tier_features.some(
                            (feature) => feature.feature_name === featureName
                          );

                          // Determine if the feature should be ticked for each tier
                          let shouldTick = false;

                          // Free tier: Only tick its own features
                          if (tierIndex === 0 && isFeatureInCurrentTier) {
                            shouldTick = true;
                          }
                          // Basic tier: Tick if feature is in Basic tier
                          else if (tierIndex === 1 && isFeatureInCurrentTier) {
                            shouldTick = true;
                          }
                          // Standard tier: Tick if feature is in Standard or Basic tier
                          else if (tierIndex === 2 && (
                            isFeatureInCurrentTier || 
                            tiers[1].tier_features.some(feature => feature.feature_name === featureName)
                          )) {
                            shouldTick = true;
                          }
                          // Premium tier: Tick if feature is in Premium, Standard, or Basic tier
                          else if (tierIndex === 3 && (
                            isFeatureInCurrentTier || 
                            tiers[2].tier_features.some(feature => feature.feature_name === featureName) || 
                            tiers[1].tier_features.some(feature => feature.feature_name === featureName)
                          )) {
                            shouldTick = true;
                          }

                          // Display check or cross based on shouldTick status
                          const displayTick = shouldTick ? 
                            <span className="text-success" style={{ fontSize: '20px' }}>✔</span> : 
                            <span className="text-danger" style={{ fontSize: '20px' }}>✘</span>;

                          return (
                            <td key={tier.id} className="text-center py-2 px-0">
                              {displayTick}
                            </td>
                          );
                        })}
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
            variant="secondary rounded-pill"
            size="lg"
            className="px-5"
            onClick={() => handleSelectTier(selectedTier)}
          >
            Select Your Plan
          </Button>
        </Container>
      </section>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Duration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tiers
            .find((tier) => tier.id === selectedTier)
            ?.tier_pricings.map((pricing) => (
              <Button
                key={pricing.id}
                variant="outline-primary"
                className="w-100 mb-2"
                onClick={() => handleDurationSelect(pricing.duration_months)} // Capturing the duration as a number
              >
                {`${pricing.duration_months} months: ${pricing.price} KES`} {/* Displaying duration as '6 months' */}
              </Button>
            ))}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TierPage;
