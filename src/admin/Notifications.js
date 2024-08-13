import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Gear, Truck, GeoAlt } from 'react-bootstrap-icons';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import './Notifications.css';  // Custom CSS file
import { createConsumer } from "@rails/actioncable";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adminId, setAdminId] = useState(null);

    useEffect(() => {
        const fetchAdminId = async () => {
            console.log('Fetching admin ID...');
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:3000/admin/identify', {
                        headers: {
                            'Authorization': 'Bearer ' + token,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    console.log('Fetched admin ID:', data.admin_id);
                    setAdminId(data.admin_id);  // Adjust this based on the response structure
                } catch (error) {
                    console.error('Error fetching admin ID:', error);
                    setError('Error fetching admin ID');
                } finally {
                    setLoading(false);  // Ensure loading is set to false in all cases
                }
            } else {
                console.log('No token found');
                setError('No token found');
                setLoading(false);  // Ensure loading is set to false if no token
            }
        };

        fetchAdminId();
    }, []);

    useEffect(() => {
        if (adminId) {
            console.log('Setting up WebSocket connection...');
            const consumer = createConsumer('ws://localhost:3000/cable');
            const subscription = consumer.subscriptions.create(
                { channel: 'NotificationsChannel', admin_id: adminId },
                {
                    received: (data) => {
                        console.log('Received notification:', data);
                        setNotifications((prevNotifications) => [data.notification, ...prevNotifications]);
                    },
                    connected: () => {
                        console.log("Connected to notifications channel");
                    },
                    disconnected: () => {
                        console.log("Disconnected from notifications channel");
                    },
                    rejected: () => {
                        console.log("Failed to connect to notifications channel");
                        setError("Failed to connect to notifications channel");
                    },
                }
            );

            return () => {
                console.log('Unsubscribing from WebSocket...');
                subscription.unsubscribe();
            };
        }
    }, [adminId]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/admin/notifications', {
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            } else {
                setError('Failed to fetch notifications');
            }
        };

        fetchNotifications(); // Initial fetch

        const intervalId = setInterval(() => {
            fetchNotifications(); // Fetch every 5 seconds
        }, 5000);

        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, []); // Empty dependency array ensures this runs once when component mounts

    const getStatusIcon = (status) => {
        switch (status) {
            case 'processing':
                return <Gear className="status-icon processing" />;
            case 'on-transit':
                return <Truck className="status-icon on-transit" />;
            case 'delivered':
                return <GeoAlt className="status-icon delivered" />;
            default:
                return null;
        }
    };

    const getStatusMessage = (status, id) => {
        switch (status) {
            case 'processing':
                return `Order #${id} is under processing and ready to be sent out for delivery.`;
            case 'on-transit':
                return `Order #${id} is on transit to the delivery address.`;
            case 'delivered':
                return `Order #${id} has been delivered to the provided address.`;
            default:
                return '';
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <TopNavbar />
            <div className="notifications-page">
                <Container fluid className="p-0">
                    <Row>
                        <Col xs={12} md={2} className="p-0">
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={10} className="p-4">
                            <h2 className="mb-4">Notifications</h2>
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <Card key={notification.order_id} className="mb-3 notification-card">
                                        <Card.Body>
                                            <Card.Title className="d-flex justify-content-between align-items-center">
                                                <span>Order #{notification.order_id}</span>
                                                <Badge
                                                    bg={notification.status === 'processing' ? 'warning' :
                                                        notification.status === 'on-transit' ? 'info' : 'success'}
                                                >
                                                    {notification.status}
                                                </Badge>
                                            </Card.Title>
                                            <Card.Text>
                                                {getStatusMessage(notification.status, notification.order_id)}
                                            </Card.Text>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted">{new Date(notification.created_at).toLocaleString()}</span>
                                                {getStatusIcon(notification.status)}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))
                            ) : (
                                <p>No notifications available</p>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Notifications;
