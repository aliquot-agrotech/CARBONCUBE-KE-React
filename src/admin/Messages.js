import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Form, Button } from 'react-bootstrap';
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
    // Fetch current user data from local storage or decode the JWT token
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
        console.log('Fetched Conversations:', data); // Debug log
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
            <Col xs={12} md={10} className="p-4">
              <Row>
                <Col xs={12} md={4} className="conversations-list">
                  <div className="conversations-header mb-4">
                    <h2 className="text-center">Conversations</h2>
                  </div>
                  <ListGroup variant="flush">
                    {Array.isArray(conversations) ? (
                      conversations.map((conversation) => {
                        const participant = conversation.purchaser || conversation.vendor;
                        const conversationType = conversation.purchaser ? 'purchaser' : 'vendor';
                        return (
                          <ListGroup.Item
                            key={conversation.id}
                            className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''} ${conversationType}`}
                            onClick={() => handleConversationClick(conversation)}
                          >
                            Conversation with {participant?.fullname || 'Unknown'}
                          </ListGroup.Item>
                        );
                      })
                    ) : (
                      <div>No conversations available</div>
                    )}
                  </ListGroup>
                </Col>
                <Col xs={12} md={8} className="messages-list">
                  {selectedConversation ? (
                    <>
                      <div className="message-container">
                        {Array.isArray(messages) ? (
                          messages.map((message) => (
                            <div
                              key={message.id}
                              className={`message ${message.sender_id === currentUser.id ? 'sent' : 'received'}`}
                            >
                              {message.content}
                            </div>
                          ))
                        ) : (
                          <div>Error loading messages</div>
                        )}
                      </div>
                      <div className="message-form">
                        <Form.Control
                          className="message-input"
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                        />
                        <Button className="message-send-btn" onClick={handleSendMessage}>
                          Send
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div>Select a conversation to view messages</div>
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
