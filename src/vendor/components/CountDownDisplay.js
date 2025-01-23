import React, { useEffect, useState } from 'react';
import { Card, Col, Spinner, Alert } from 'react-bootstrap';

const CountDownDisplay = () => {
  const [countdown, setCountdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountdown = async () => {
      try {
        // Decode the vendor ID from the JWT token stored in sessionStorage
        const token = sessionStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decoding the token
        const vendorId = decodedToken.user_id;

        // Fetch the countdown from the backend API
        const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/vendor/vendor_tiers/${vendorId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch countdown');
        }

        const data = await response.json();
        if (data.subscription_countdown) {
          setCountdown(data.subscription_countdown);
        } else {
          throw new Error('No countdown data available');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountdown();
  }, []);

  const renderCountdown = () => {
    if (!countdown) return null;

    // If subscription is expired
    if (countdown.expired) {
      return <h5>Subscription expired</h5>;
    }

    return (
      <div>
        <h5>{`${countdown.months} Months, ${countdown.weeks} Weeks, ${countdown.days} Days, ${countdown.hours} Hours, ${countdown.minutes} Minutes, ${countdown.seconds} Seconds`}</h5>
      </div>
    );
  };

  return (
    <Col xs={12} md={4}>
      <Card>
        <Card.Body>
          <Card.Title>Subscription Countdown</Card.Title>
          {loading ? (
            <Spinner animation="border" />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            renderCountdown()
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default CountDownDisplay;
