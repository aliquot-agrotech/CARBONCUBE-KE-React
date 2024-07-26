import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
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
    <Container fluid className="p-0">
      <Row className="m-0">
        <Col className="warehouse-bg p-4">
          <Col className="form-container d-flex align-items-center center">
            <Container className="py-2">
              <Row className="justify-content-center">
                <Col xs={12} sm={10} md={12} lg={10} >
                  <h2 className="form-title text-center mb-4">Sign Up Now</h2>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Full name"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="tel"
                        placeholder="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="email"
                        placeholder="Email address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Location/Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
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
                    <Button variant="warning" type="submit" className="btn-sign-in w-100 mb-3">
                      SIGN UP
                    </Button>
                    <div className="divider">
                      <span>or continue with</span>
                    </div>
                    <div className="d-flex justify-content-center mb-3">
                      <Button variant="outline-secondary" className="social-login-button">
                        <img src="google-icon.png" alt="Google" />
                      </Button>
                      <Button variant="outline-secondary" className="social-login-button mx-2">
                        <img src="facebook-icon.png" alt="Facebook" />
                      </Button>
                      <Button variant="outline-secondary" className="social-login-button">
                        <img src="apple-icon.png" alt="Apple" />
                      </Button>
                    </div>
                    <div className="text-center">
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
