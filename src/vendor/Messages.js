import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import Spinner from "react-spinkit";
import './Messages.css'; // Custom CSS

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
        setCurrentUser({ id: payload.vendor_id, type: 'Vendor' });
        }
    }, []);

    const fetchMessages = async () => {
        setLoadingMessages(true);
        try {
        const response = await fetch('https://carboncube-ke-rails-4xo3.onrender.com/vendor/messages', {
            headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
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
        const response = await fetch('https://carboncube-ke-rails-4xo3.onrender.com/vendor/messages', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
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
                        <Col xs={12} md={10} lg={9} className="p-0 p-md-2 mt-3">
                            <Card className="message-container">
                                <Card.Header className="messages-header justify-content-center">
                                    <FontAwesomeIcon className="me-2 mt-1" icon={faUser} /> Admin
                                </Card.Header>
                                <Card.Body className="messages-scroll">
                                    {loadingMessages ? (
                                        <div className="centered-loader">
                                            <Spinner variant="warning" name="cube-grid" style={{ width: 50, height: 50 }} />
                                        </div>
                                    ) : (
                                        <>
                                            {messages.map((message) => {
                                                const isSent = message.sender_type === 'Vendor';
                                                return (
                                                    <div key={message.id} className={`message ${isSent ? 'sent' : 'received'}`}>
                                                        <div className="message-inner">
                                                            <div className="message-content">
                                                                <p>{message.content}</p>
                                                            </div>
                                                            <span className="message-timestamp">
                                                                {new Date(message.created_at).toLocaleTimeString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div ref={messagesEndRef} />
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

export default Messages;
