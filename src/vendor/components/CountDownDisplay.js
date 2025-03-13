import React, { useEffect, useState, useRef } from 'react';
import { Spinner, Alert } from 'react-bootstrap';

const CountDownDisplay = () => {
  const [countdown, setCountdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchCountdown = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token
        const vendorId = decodedToken.user_id;

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/vendor/vendor_tiers/${vendorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  useEffect(() => {
    if (countdown && !countdown.expired) {
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (!prev) return null;

          const { months, weeks, days, hours, minutes, seconds } = prev;

          let newSeconds = seconds - 1;
          let newMinutes = minutes;
          let newHours = hours;
          let newDays = days;
          let newWeeks = weeks;
          let newMonths = months;

          if (newSeconds < 0) {
            newSeconds = 59;
            newMinutes -= 1;
          }
          if (newMinutes < 0) {
            newMinutes = 59;
            newHours -= 1;
          }
          if (newHours < 0) {
            newHours = 23;
            newDays -= 1;
          }
          if (newDays < 0) {
            newDays = 6;
            newWeeks -= 1;
          }
          if (newWeeks < 0) {
            newWeeks = 3;
            newMonths -= 1;
          }

          if (
            newMonths <= 0 &&
            newWeeks <= 0 &&
            newDays <= 0 &&
            newHours <= 0 &&
            newMinutes <= 0 &&
            newSeconds <= 0
          ) {
            clearInterval(intervalRef.current);
            return { expired: true };
          }

          return {
            ...prev,
            months: newMonths,
            weeks: newWeeks,
            days: newDays,
            hours: newHours,
            minutes: newMinutes,
            seconds: newSeconds,
          };
        });
      }, 1000);

      return () => clearInterval(intervalRef.current);
    }
  }, [countdown]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (countdown?.expired) {
    return <strong>Subscription expired</strong>;
  }

  return (
    <div style={{ fontSize: '1.35rem', fontWeight: 'bold', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
      <span >
        {countdown.months} <span style={{ fontSize: '0.9rem', color: '#007bff' }}><em>M</em></span>
      </span>
      <span>:</span>
      <span >
        {countdown.weeks} <span style={{ fontSize: '0.9rem', color: '#28a745' }}><em>W</em></span>
      </span>
      <span>:</span>
      <span >
        {countdown.days} <span style={{ fontSize: '0.9rem', color: '#964b00' }}><em>D</em></span>
      </span>
      <span>:</span>
      <span >
        {countdown.hours} <span style={{ fontSize: '0.9rem', color: '#dc3545' }}><em>H</em></span>
      </span>
      <span>:</span>
      <span >
        {countdown.minutes} <span style={{ fontSize: '0.9rem', color: '#17a2b8' }}><em>M</em></span>
      </span>
      <span>:</span>
      <span >
        {countdown.seconds} <span style={{ fontSize: '0.9rem', color: '#6610f2' }}><em>S</em></span>
      </span>
    </div>
  );
  
  
};

export default CountDownDisplay;
