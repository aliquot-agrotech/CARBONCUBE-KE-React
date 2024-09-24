import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Google, Facebook, Apple } from 'react-bootstrap-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VendorSignUpPage.css';

function VendorSignUpPage({ onSignup }) {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    phone_number: '',
    email: '',
    location: '',
    business_registration_number: '',
    enterprise_name: '',
    password: '',
    password_confirmation: '',
    birthdate: '',
    gender: '',
    city: '',
    zipcode: ''
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: null,
    });
  };

  const validatePassword = () => {
    let isValid = true;
    const newErrors = {};

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
      isValid = false;
    }

    setErrors({ ...errors, ...newErrors });
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) {
      return;
    }
  
    const payload = {
      vendor: {
        ...formData
      }
    };
  
    console.log("Form Data before submission:", payload);
  
    try {
      const response = await axios.post('http://localhost:3000/vendor/signup', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.status === 201) {
        onSignup();
        navigate('/login');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const serverErrors = {};
        err.response.data.errors.forEach(error => {
          const [field, message] = error.split(': ');
          serverErrors[field.toLowerCase()] = message;
        });
        setErrors(serverErrors);
      } else {
        setErrors({ general: 'Signup failed. Please try again.' });
      }
    }
  };

  return (
    <Container fluid className="p-0 vendor-signup-page">
      <Row className="m-0">
        <Col className="warehouse-bg">
          <Col className="form-container align-items-center center">
            <Container className="d-flex justify-content-center">
              <Col xs={12} sm={10} md={12} lg={10}>
                <h2 className="form-title text-center mb-4">Vendor Sign Up</h2>
                <Form onSubmit={handleSubmit}>
                  {errors.general && <Alert variant="danger">{errors.general}</Alert>}
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Full Name"
                          name="fullname"
                          id="button"
                          className="mb-3 text-center"
                          value={formData.fullname}
                          onChange={handleChange}
                          isInvalid={!!errors.fullname}
                        />
                        <Form.Control.Feedback type="invalid">{errors.fullname}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Username"
                          name="username"
                          id="button"
                          className="mb-3 text-center"
                          value={formData.username}
                          onChange={handleChange}
                          isInvalid={!!errors.username}
                        />
                        <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Phone Number"
                          name="phone_number"
                          id="button"
                          className="mb-3 text-center"
                          value={formData.phone_number}
                          onChange={handleChange}
                          isInvalid={!!errors.phone_number}
                        />
                        <Form.Control.Feedback type="invalid">{errors.phone_number}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="email"
                          placeholder="Email"
                          name="email"
                          id="button"
                          className="mb-3 text-center"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Location"
                          name="location"
                          id="button"
                          className="mb-3 text-center"
                          value={formData.location}
                          onChange={handleChange}
                          isInvalid={!!errors.location}
                        />
                        <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Business Registration Number"
                          name="business_registration_number"
                          id="button"
                          className="mb-3 text-center"
                          value={formData.business_registration_number}
                          onChange={handleChange}
                          isInvalid={!!errors.business_registration_number}
                        />
                        <Form.Control.Feedback type="invalid">{errors.business_registration_number}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Enterprise Name"
                          name="enterprise_name"
                          id="button"
                          className="mb-3 text-center"
                          value={formData.enterprise_name}
                          onChange={handleChange}
                          isInvalid={!!errors.enterprise_name}
                        />
                        <Form.Control.Feedback type="invalid">{errors.enterprise_name}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="date"
                          name="birthdate"
                          id="button"
                          className="mb-3 text-center"
                          value={formData.birthdate}
                          onChange={handleChange}
                          isInvalid={!!errors.birthdate}
                        />
                        <Form.Control.Feedback type="invalid">{errors.birthdate}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          as="select"
                          name="gender"
                          id="button"
                          className="mb-3 text-center"
                          value={formData.gender}
                          onChange={handleChange}
                          isInvalid={!!errors.gender}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="City"
                          name="city"
                          id="button"
                          className="mb-3 text-center"
                          value={formData.city}
                          onChange={handleChange}
                          isInvalid={!!errors.city}
                        />
                        <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Zip Code"
                          name="zipcode"
                          id="button"
                          className="mb-3 text-center"
                          value={formData.zipcode}
                          onChange={handleChange}
                          isInvalid={!!errors.zipcode}
                        />
                        <Form.Control.Feedback type="invalid">{errors.zipcode}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          name="password"
                          id="button"
                          className="mb-3 text-center"
                          value={formData.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="password"
                          placeholder="Confirm Password"
                          name="password_confirmation"
                          id="button"
                          className="mb-3 text-center"
                          value={formData.password_confirmation}
                          onChange={handleChange}
                          isInvalid={!!errors.password_confirmation}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password_confirmation}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button variant="warning" type="submit" id="button" className="w-100 mb-3">Sign Up</Button>

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
            </Container>
          </Col>
        </Col>
      </Row>
    </Container>
  );
}

export default VendorSignUpPage;
