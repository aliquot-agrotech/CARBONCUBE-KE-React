import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import Spinner from "react-spinkit";
import './Messages.css'; // Custom CSS

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
      setCurrentUser({ id: payload.admin_id, type: 'Admin' });
    }
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('https://carboncube-ke-rails-qrvq.onrender.com/admin/conversations', {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setConversations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchConversations();
  }, []);

  const fetchMessages = async (conversationId) => {
    setLoadingMessages(true); // Set loading state for messages
    try {
      const response = await fetch(`https://carboncube-ke-rails-qrvq.onrender.com/admin/conversations/${conversationId}/messages`, {
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
      setLoadingMessages(false); // Reset loading state for messages
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change or when a new message is sent
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id); // Fetch messages for the selected conversation
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
  
    try {
      const response = await fetch(`https://carboncube-ke-rails-qrvq.onrender.com/admin/conversations/${selectedConversation.id}/messages`, {
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
  
      // Optionally, move the conversation to the top of the list
      const updatedConversation = { ...selectedConversation, messages: [...messages, message], pullOver: true };
      const updatedConversations = conversations
        .filter(convo => convo.id !== selectedConversation.id)
        .map(convo => ({ ...convo, pullOver: false }));
  
      setConversations([updatedConversation, ...updatedConversations]);
  
      // Reset the pull-over animation after it completes
      setTimeout(() => {
        setConversations(prevConversations => prevConversations.map(convo => {
          if (convo.id === updatedConversation.id) {
            return { ...convo, pullOver: false };
          }
          return convo;
        }));
      }, 500); // Duration of the animation
  
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
            <Col xs={12} md={10} lg={9} className="p-0 p-lg-2 mt-1">
              <Row>
                <Col xs={12} md={2}>
                  <Card className="conversations-list mt-2 mt-lg-4">
                    <Card.Header className="conversations-header text-center justify-content-center">
                      <strong>Conversations</strong>
                    </Card.Header>
                    <Card.Body className="p-2 conversations-scroll">
                      {loadingConversations ? (
                        <div className="centered-loader">
                          <Spinner variant="warning" name="cube-grid" style={{ width: 50, height: 50 }} />
                        </div>
                      ) : (
                        conversations
                          .sort((a, b) => {
                            const lastMessageA = a.messages[a.messages.length - 1];
                            const lastMessageB = b.messages[b.messages.length - 1];
                            return new Date(lastMessageB.created_at) - new Date(lastMessageA.created_at);
                          })
                          .map((conversation) => {
                            const participant = conversation.purchaser || conversation.vendor;
                            const participantType = conversation.purchaser ? 'purchaser' : 'vendor';
                            const pullOverClass = conversation.pullOver ? 'conversation-pull-over' : '';
                            return (
                              <Card
                                key={conversation.id}
                                className={`conversation-card ${participantType} ${selectedConversation?.id === conversation.id ? 'active' : ''} ${pullOverClass}`}
                                onClick={() => handleConversationClick(conversation)}
                              >
                                <Card.Body className="text-center">
                                  <FontAwesomeIcon icon={faEnvelopeOpenText} /> {participant?.fullname || 'Unknown'}
                                </Card.Body>
                              </Card>
                            );
                          })
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} md={10} className="messages-list ">
                  {selectedConversation ? (
                    <Card className="message-container mt-2 mt-lg-4">
                      <Card.Header className="messages-header justify-content-center">
                        <FontAwesomeIcon className="me-3" icon={faUser} /> {selectedConversation.purchaser?.fullname || selectedConversation.vendor?.fullname || 'Unknown'}
                      </Card.Header>
                      <Card.Body className="messages-scroll">
                        {loadingMessages ? (
                          <div className="centered-loader">
                            <Spinner variant="warning" name="cube-grid" style={{ width: 50, height: 50 }} />
                          </div>
                        ) : (
                          <>
                            {messages.map((message) => {
                              const isSent = message.sender_type === 'Admin';
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
                  ) : (
                    <div className="parent-container">
                      <Card className="select-conversation-card">
                        <Card.Body>
                          <div className="select-conversation-text">Select a conversation to view messages</div>
                        </Card.Body>
                      </Card>
                    </div>
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
