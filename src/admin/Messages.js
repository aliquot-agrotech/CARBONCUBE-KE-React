import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import './Messages.css'; // Custom CSS

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
      setCurrentUser(payload);
    }
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/conversations', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        });
        const data = await response.json();
        setConversations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(`http://localhost:3000/admin/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error('Messages data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`http://localhost:3000/admin/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const message = await response.json();
      setMessages([...messages, message]);
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
              <Row>
                <Col xs={12} md={3}>
                  <Card className="conversations-list">
                    <Card.Header className="text-center justify-content-center">
                      <strong>Conversations</strong>
                    </Card.Header>
                    <Card.Body className="p-2 conversations-scroll">
                      {Array.isArray(conversations) ? (
                        conversations.map((conversation) => {
                          const participant = conversation.purchaser || conversation.vendor;
                          const conversationType = conversation.purchaser ? 'purchaser' : 'vendor';
                          return (
                            <Card
                              key={conversation.id}
                              className={`conversation-card ${selectedConversation?.id === conversation.id ? 'active' : ''} ${conversationType}`}
                              onClick={() => handleConversationClick(conversation)}
                            >
                              <Card.Body className="text-center">
                                <FontAwesomeIcon icon={faEnvelopeOpenText} /> {participant?.fullname || 'Unknown'}
                              </Card.Body>
                            </Card>
                          );
                        })
                      ) : (
                        <div>No conversations available</div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} md={9} className="messages-list">
                  {selectedConversation ? (
                    <>
                      <Card className="message-container">
                        <Card className="messages-header mb-3">
                          <Card.Body>
                            <FontAwesomeIcon icon={faUser} /> {selectedConversation.purchaser?.fullname || selectedConversation.vendor?.fullname || 'Unknown'}
                          </Card.Body>
                        </Card>
                        <Card.Body className="messages-scroll">
                          {Array.isArray(messages) ? (
                            messages.map((message) => (
                              <div
                                key={message.id}
                                className={`message ${message.sender_id === currentUser.id ? 'sent' : 'received'}`}
                              >
                                <p>{message.content}</p>
                                <span className="message-timestamp">
                                  {new Date(message.created_at).toLocaleTimeString()}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div>Error loading messages</div>
                          )}
                        </Card.Body>
                        <Card.Footer>
                        <Form className="message-form">
                        <Form.Control
                          className="message-input"
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."/>
                          <Button variant="warning" className="message-send-btn" onClick={handleSendMessage}>
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </Button>
                        
                        
                      </Form>
                        </Card.Footer>
                      </Card>
                      
                    </>
                  ) : (
                    <Card className="select-conversation-card">
                      <Card.Body>
                        <div className="select-conversation-text">Select a conversation to view messages</div>
                      </Card.Body>
                    </Card>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Messages;
