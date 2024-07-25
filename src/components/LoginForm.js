import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Google, Facebook, Apple } from 'react-bootstrap-icons';
import './LoginForm.css';

const LoginForm = () => {
  return (
    <Container fluid className="login-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} lg={4} className="text-center p-4 login-box">
          <h2 className="mb-4">Welcome Back!</h2>
          <Form>
            <Form.Group controlId="formEmail">
              <Form.Control type="email" placeholder="Email/Username" className="mb-3" />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Control type="password" placeholder="Password" className="mb-3" />
            </Form.Group>

            <Form.Group controlId="formRememberMe" className="d-flex justify-content-between align-items-center">
              <Form.Check type="checkbox" label="Remember me" />
              <a href="/" className="text-muted">Forget Password?</a>
            </Form.Group>

            <Button variant="warning" type="submit" className="w-100 mt-3">
              Log In
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
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
