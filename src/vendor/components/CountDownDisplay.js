import React, { useState, useEffect } from 'react';
import Spinner from 'react-spinkit';
import { Card } from 'react-bootstrap';

const CountDownDisplay = ({ vendorId }) => {
    const [countdownData, setCountdownData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCountdownData = async () => {
        try {
            const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/vendor/vendor_tiers/${vendorId}`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCountdownData(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching countdown data:', err.message);
            setError(err.message);
            setLoading(false);
        }
        };
        fetchCountdownData();
    }, [vendorId]);

    if (loading) {
        return (
            <div className="centered-loader">
                <Spinner variant="warning" name="cube-grid" style={{ width: 50, height: 50 }} />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="mb-4 custom-card">
                <Card.Header>Countdown Timer</Card.Header>
                <Card.Body>
                    <div className="text-center text-danger">{error}</div>
                </Card.Body>
            </Card>
        );
    }

    if (!countdownData) {
        return (
            <Card className="mb-4 custom-card">
                <Card.Header>Countdown Timer</Card.Header>
                <Card.Body>
                    <div className="text-center">No countdown data available.</div>
                </Card.Body>
            </Card>
        );
    }

    const { subscription_countdown } = countdownData;

    return (
        <Card className="mb-4 custom-card">
            <Card.Header>Countdown Timer</Card.Header>
            <Card.Body>
                <div className="text-center">
                    <h5>{subscription_countdown}</h5>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CountDownDisplay;
