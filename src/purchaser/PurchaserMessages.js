import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import Spinner from "react-spinkit";
// import './Messages.css'; // Custom CSS

const PurchaserMessages = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
        setCurrentUser({ id: payload.purchaser_id, type: 'Purchaser' });
        }
    }, []);

    const fetchMessages = async () => {
        setLoadingMessages(true);
        try {
        const response = await fetch('https://carboncube-ke-rails-qrvq.onrender.com/purchaser/messages', {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        // Sort messages by created_at (oldest to newest)
        const sortedMessages = Array.isArray(data) ? data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) : [];
        setMessages(sortedMessages);
        } catch (error) {
        console.error('Error fetching messages:', error);
        } finally {
        setLoadingMessages(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
        fetchMessages();
        }
    }, [currentUser]);

    useEffect(() => {
        // Scroll to bottom when messages change or when a new message is sent
        if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
        const response = await fetch('https://carboncube-ke-rails-qrvq.onrender.com/purchaser/messages', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify({
            content: newMessage,
            sender_id: currentUser.id,
            sender_type: currentUser.type,
            }),
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const message = await response.json();

        // Update the messages state with the newly created message
        setMessages(prevMessages => {
            // Add the new message and sort the messages
            const updatedMessages = [...prevMessages, message].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            return updatedMessages;
        });

        setNewMessage('');
        } catch (error) {
        console.error('Error sending message:', error);
        }
    };

    if (!currentUser) return <div>Loading...</div>;

    return (
        <>
        <TopNavbar />
        <div className="messages-page">
            <Container fluid className="p-0">
            <Row>
                <Col xs={12} md={2} className="p-0">
                <Sidebar />
                </Col>
                <Col xs={12} md={10} className="p-2">
                <Card className="message-container">
                    <Card.Header className="messages-header justify-content-center">
                    <FontAwesomeIcon className="me-3" icon={faUser} /> Admin
                    </Card.Header>
                    <Card.Body className="messages-scroll">
                    {loadingMessages ? (
                        <div className="centered-loader">
                        <Spinner variant="warning" name="cube-grid" style={{ width: 50, height: 50 }} />
                        </div>
                    ) : (
                        <>
                        {messages.map((message) => {
                            const isSent = message.sender_type === 'Purchaser';
                            return (
                            <div key={message.id} className={`message ${isSent ? 'sent' : 'received'}`}>
                                <p>{message.content}</p>
                                <span className="message-timestamp">
                                {new Date(message.created_at).toLocaleTimeString()}
                                </span>
                            </div>
                            );
                        })}
                        <div ref={messagesEndRef} /> {/* This empty div will be scrolled into view */}
                        </>
                    )}
                    </Card.Body>
                    <Card.Footer className="messages-footer">
                    <Form className="message-form" onSubmit={handleSendMessage}>
                        <Form.Control
                        className="message-input"
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        />
                        <Button type="submit" variant="warning" className="message-send-btn">
                        <FontAwesomeIcon icon={faPaperPlane} />
                        </Button>
                    </Form>
                    </Card.Footer>
                </Card>
                </Col>
            </Row>
            </Container>
        </div>
        </>
    );
};

export default PurchaserMessages;
