// src/components/LoginForm.js
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Google, Facebook, Apple } from 'react-bootstrap-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');  // Changed from 'email' to 'identifier'
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://carboncube-backend:3001/auth/login', {
          identifier,  // Use identifier instead of email
          password,
      });
  
      const { token, user } = response.data;
  
      onLogin(token, user);
  
      // Redirect based on user role
      switch (user.role) {
          case 'purchaser':
              navigate('/purchaser/home');
              break;
          case 'vendor':
              navigate('/vendor/analytics');
              break;
          // case 'rider':
          //     navigate('/rider/home');
          //     break;
          case 'admin':
              navigate('/admin/analytics');
              break;
          default:
              setError('Unexpected user role.');
      }
    } catch (error) {
        console.error(error);
        if (error.response) {
            setError(error.response.data.message || 'Invalid identifier or password');
        } else {
            setError('Network error. Please try again later.');
        }
    } finally {
        setLoading(false);
    }  
  };

  // Start of the export component

  return (
    <>
    <Container fluid className="login-container" style={{ minHeight: `${window.innerHeight}px` }}>
      <Row className="justify-content-center">
        <Col md={12} lg={12} className="text-center login-box">
          <h2 className="mb-3">Sign In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formIdentifier">
              <Form.Control
                type="text"  // Changed from "email" to "text" to support email, phone, or ID number
                placeholder="Email, Phone Number, or ID Number"
                className="mb-3 text-center rounded-pill"
                id="identifier"
                value={identifier}  // Updated state variable
                onChange={(e) => setIdentifier(e.target.value)}  // Updated state handling
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                className="mb-3 text-center rounded-pill"
                // id="button"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formRememberMe" className="d-flex justify-content-between align-items-center">
              <Form.Switch type="checkbox" label="Remember me" />
              <a href="/" className="text-muted">Forget Password?</a>
            </Form.Group>

            <Button variant="warning" type="submit" className="w-100 mt-3 rounded-pill" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="separator my-4">or continue with</div>

            <div className="d-flex justify-content-around">
              <Button variant="warning rounded-pill" className="social-btn">
                <Google size={25} />
              </Button>
              <Button variant="warning rounded-pill" className="social-btn">
                <Facebook size={25} />
              </Button>
              <Button variant="warning rounded-pill" className="social-btn">
                <Apple size={25} />
              </Button>
            </div>

            <div className="text-center mt-3 signup-form">
              Don't have an account?
              <Row className="justify-content-center mt-1">
                <Col xs={4} sm={4} className="mb-2">
                  <Button
                    variant="secondary"
                    className="w-100 signup-btn rounded-pill"
                    onClick={() => navigate('/purchasersignup')}
                  >
                    Purchaser
                  </Button>
                </Col>
                <Col xs={4} sm={4} className="mb-2">
                  <Button
                    variant="secondary"
                    className="w-100 signup-btn rounded-pill"
                    onClick={() => navigate('/vendorsignup')}
                  >
                    Vendor
                  </Button>
                </Col>
                {/* <Col xs={4} sm={4} className="mb-2">
                  <Button
                    variant="secondary"
                    className="w-100 signup-btn rounded-pill"
                    onClick={() => navigate('/ridersignup')}
                  >
                    Rider
                  </Button>
                </Col> */}
              </Row>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default LoginForm;
