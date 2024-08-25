import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Google, Facebook, Apple } from 'react-bootstrap-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';

function PurchaserSignUpPage({ onSignup }) {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    phone: '',
    email: '',
    address: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/purchaser/signup', formData); // Adjust the URL according to your API endpoint
      if (response.status === 201) {
        onSignup(); // Update the state to reflect that the user is signed up
        navigate('/purchaser/dashboard'); // Redirect to the purchaser dashboard or any other page
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <Container fluid className="p-0 purchaser-signup-page">
      <Row className="m-0">
        <Col className="warehouse-bg">
          <Col className="form-container align-items-center center">
            <Container>
              <Row className="justify-content-center">
                <Col xs={12} sm={10} md={12} lg={10} >
                  <h2 className="form-title text-center mb-4">Sign Up Now</h2>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        placeholder="Full name"
                        name="fullname"
                        id="button"
                        className="mb-3 text-center"
                        value={formData.fullname}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Username"
                        name="username"
                        id="button"
                        className="mb-3 text-center"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="tel"
                        placeholder="Phone Number"
                        name="phone"
                        id="button"
                        className="mb-3 text-center"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="email"
                        placeholder="Email address"
                        name="email"
                        id="button"
                        className="mb-3 text-center"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Location/Address"
                        name="address"
                        id="button"
                        className="mb-3 text-center"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        id="button"
                        className="mb-3 text-center"  
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    {error && <div className="text-danger mb-3">{error}</div>}
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Agree to Terms and Conditions and receiving of SMS, emails and promotion notifications."
                      />
                    </Form.Group>
                    <Button variant="warning" type="submit" id="button" className="btn-sign-in w-100 mb-3">
                      Sign Up
                    </Button>
                    <div className="divider">
                      <span>or continue with</span>
                    </div>
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
                      Already have an account? <a href="./login" className="login-link">Log in</a>
                    </div>
                  </Form>
                </Col>
              </Row>
            </Container>
          </Col>
        </Col>
      </Row>
    </Container>
  );
}

export default PurchaserSignUpPage;
