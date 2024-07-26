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
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      onLogin(token, user.role);

      // Redirect to the appropriate page based on the user role
      if (user.role === 'purchaser') {
        navigate('/purchaser/dashboard');
      } else if (user.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      setError('Invalid email or password');
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
                className="mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                className="mb-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formRememberMe" className="d-flex justify-content-between align-items-center">
              <Form.Check type="checkbox" label="Remember me" />
              <a href="/" className="text-muted">Forget Password?</a>
            </Form.Group>

            <Button variant="warning" type="submit" className="w-100 mt-3" disabled={loading}>
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

            <div className="text-center mt-2">
                Don't have an account? <a href="./purchasersignup" className="login-link">Purchaser SignUp</a>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
