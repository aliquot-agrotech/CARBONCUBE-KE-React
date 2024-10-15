// src/components/LoginForm.js
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Google, Facebook, Apple } from 'react-bootstrap-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://carboncube-ke-rails-7ty3.onrender.com/auth/login', {
          email,
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
              navigate('/vendor/vendor-analytics');
              break;
          case 'admin':
              navigate('/admin/analytics-reporting');
              break;
          default:
              setError('Unexpected user role.');
      }
    } catch (error) {
        console.error(error);
        if (error.response) {
            setError(error.response.data.message || 'Invalid email or password');
        } else {
            setError('Network error. Please try again later.');
        }
    } finally {
        setLoading(false);
    }  
  };

  return (
    <Container fluid className="login-container p-4">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} lg={4} className="text-center login-box">
          <h2 className="mb-4">Welcome Back!</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formEmail">
              <Form.Control
                type="email"
                placeholder="Email/Username"
                className="mb-3 text-center"
                id="button"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                className="mb-3 text-center"
                id="button"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formRememberMe" className="d-flex justify-content-between align-items-center">
              <Form.Check type="checkbox" label="Remember me" />
              <a href="/" className="text-muted">Forget Password?</a>
            </Form.Group>

            <Button variant="warning" type="submit" id="button" className="w-100 mt-3" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="separator my-4">or continue with</div>

            <div className="d-flex justify-content-around">
              <Button variant="outline-secondary" className="social-btn">
                <Google size={20} /> Google
              </Button>
              <Button variant="outline-secondary" className="social-btn">
                <Facebook size={20} /> Facebook
              </Button>
              <Button variant="outline-secondary" className="social-btn">
                <Apple size={20} /> Apple
              </Button>
            </div>

            <div className="text-center mt-2 signup-form">
              Don't have an account? 
              <div className="d-flex justify-content-center mt-2">
                <Button variant="secondary" id="button" className="w-40 mx-2 signup-btn" onClick={() => navigate('/purchasersignup')}>
                  Purchaser SignUp
                </Button>
                <Button variant="secondary" id="button" className="w-40 mx-2 signup-btn" onClick={() => navigate('/vendorsignup')}>
                  Vendor SignUp
                </Button>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
