import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Google, Facebook, Apple } from 'react-bootstrap-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import '../css/SignUpPage.css';

function PurchaserSignUpPage({ onSignup }) {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    phone_number: '',
    email: '',
    location: '',
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
    // Clear the error for this field when the user starts typing
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
    if (!validateForm()) {
      return; 
    }
  
    if (!validatePassword()) {
      return; 
    }
    
    try {
    
      // console.log("Form submitted successfully:", formData);
    
    } catch (error) {
      // console.error("Error during submission:", error);
    }
  
    const payload = {
      purchaser: {
        ...formData
      }
    };
  
    // console.log("Form Data before submission:", payload);
  
    try {
      const response = await axios.post('https://carboncube-ke-rails-4xo3.onrender.com/purchaser/signup', payload, {
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
  
  const validateForm = () => {
    const newErrors = {};
  
    if (!formData.terms) {
      newErrors.terms = "You must agree to the terms and conditions.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  let datepickerRef;

  return (
    <Container fluid className="p-0 purchaser-signup-page">
      <Row className="m-0">
        <Col className="warehouse-bg">
          <Col className="form-container align-items-center center">
            <Container className="d-flex justify-content-center">
              <Col xs={12} sm={10} md={12} lg={10}>
                <h2 className="form-title text-center mb-2  ">Purchaser Sign-Up</h2>
                <Form onSubmit={handleSubmit}>
                  {errors.general && <Alert variant="danger">{errors.general}</Alert>}
                  
                  <Row>
                    <Col xs={6} md={6}>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Full name"
                          name="fullname"
                          id="button"
                          className="mb-2 text-center"
                          value={formData.fullname}
                          onChange={handleChange}
                          isInvalid={!!errors.fullname}
                        />
                        <Form.Control.Feedback type="invalid">{errors.fullname}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col xs={6} md={6}>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Username"
                          name="username"
                          id="button"
                          className="mb-2 text-center"
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
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Phone Number"
                          name="phone_number"
                          id="button"
                          className="mb-2 text-center"
                          value={formData.phone_number}
                          onChange={handleChange}
                          isInvalid={!!errors.phone_number}
                        />
                        <Form.Control.Feedback type="invalid">{errors.phone_number}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Control
                          type="email"
                          placeholder="Email"
                          name="email"
                          id="button"
                          className="mb-2 text-center"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Physical Address"
                          name="location"
                          id="button"
                          className="mb-2 text-center"
                          value={formData.location}
                          onChange={handleChange}
                          isInvalid={!!errors.location}
                        />
                        <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                  </Row>
                  
                  <Row>
                    <Col xs={6} md={6}>
                    <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="City"
                          name="city"
                          id="button"
                          className="mb-2 text-center"  
                          value={formData.city}
                          onChange={handleChange}
                          isInvalid={!!errors.city}
                        />
                        <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col xs={6} md={6}>
                    <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Zip Code"
                          name="zipcode"
                          id="button"
                          className="mb-2 text-center"  
                          value={formData.zipcode}
                          onChange={handleChange}
                          isInvalid={!!errors.zipcode}
                        />
                        <Form.Control.Feedback type="invalid">{errors.zipcode}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                  </Row>
                  
                  <Row>
                    <Col xs={6} md={6}>
                      <Form.Group>
                        <div className="dropdown-container">
                          <Form.Control
                            as="select"
                            name="gender"
                            className="text-center rounded-pill mb-2"
                            value={formData.gender}
                            onChange={handleChange}
                            isInvalid={!!errors.gender}
                          >
                            <option value="" disabled hidden>
                              Gender
                            </option>
                            {["Male", "Female", "Other"].map((gender) => (
                              <option key={gender} value={gender}>
                                {gender}
                              </option>
                            ))}
                          </Form.Control>
                        </div>
                        <Form.Control.Feedback type="invalid">
                          {errors.gender}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col xs={6} md={6}>
                      <Form.Group>
                        <div className="position-relative">
                          <ReactDatePicker
                            ref={(el) => (datepickerRef = el)}
                            selected={formData.birthdate ? new Date(formData.birthdate) : null}
                            onChange={(date) =>
                              handleChange({
                                target: { name: 'birthdate', value: date ? date.toISOString().split('T')[0] : '' },
                              })
                            }
                            className="form-control text-center rounded-pill mb-0 pr-5"
                            placeholderText="Date of Birth"
                            dateFormat="MM/dd/yyyy"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                          />
                          <div 
                            onClick={() => datepickerRef.setOpen(true)}
                            style={{ 
                              position: 'absolute',
                              top: '50%',
                              right: '10px',
                              transform: 'translateY(-50%)',
                              cursor: 'pointer'
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              style={{
                                color: '#aaa',
                              }}
                            />
                          </div>
                          {errors.birthdate && (
                            <div className="invalid-feedback">{errors.birthdate}</div>
                          )}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          name="password"
                          id="button"
                          className="mb-2 text-center"
                          value={formData.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Control
                          type="password"
                          placeholder="Confirm Password"
                          name="password_confirmation"
                          id="button"
                          className="mb-2 text-center"
                          value={formData.password_confirmation}
                          onChange={handleChange}
                          isInvalid={!!errors.password_confirmation}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password_confirmation}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>      
                  
                  <Form.Group className="mb-2">
                    <Form.Switch
                      type="checkbox"
                      label="Agree to Terms and Conditions and receiving of SMS, emails and promotion notifications."
                      name="terms"
                      checked={formData.terms || false} // Bind the checkbox to formData
                      onChange={(e) =>
                        handleChange({
                          target: { name: 'terms', value: e.target.checked },
                        })
                      }
                      isInvalid={!!errors.terms}
                    />
                    <Form.Control.Feedback type="invalid">{errors.terms}</Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="warning"
                    type="submit"
                    className="w-100 mb-0 rounded-pill"
                    disabled={!formData.terms} // Disable the button until terms are agreed to
                  >
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
            </Container>
          </Col>
        </Col>
      </Row>
    </Container>
  );
}

export default PurchaserSignUpPage;