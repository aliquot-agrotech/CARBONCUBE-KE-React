import React, { useState ,useEffect} from 'react';
import { Container, Row, Col, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { Google, Facebook, Apple, Eye, EyeSlash } from 'react-bootstrap-icons';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import TopNavbarMinimal from '../../components/TopNavBarMinimal';
import '../css/PurchaserSignUpPage.css';

function PurchaserSignUpPage({ onSignup }) {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    phone_number: '',
    email: '',
    location: '',
    password: '',
    password_confirmation: '',
    age_group_id: '',
    gender: '',
    city: '',
    zipcode: '',
    income_id: '',
    sector_id: '',
    education_id: '',
    employment_id: '',
    county_id: '',             // ✅ Add this
    sub_county_id: '' 
  });
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState({  age_groups: [] });
  const navigate = useNavigate();
  const [terms, setTerms] = useState(false);
  const [step, setStep] = useState(1);
  const nextStep = () => setStep(prev => Math.min(prev + 1, 2));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Fetch options for dropdowns from the API
    const fetchOptions = async () => {
      try {
        const [ age_groupRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/age_groups`),
        ]);
        setOptions({
          age_groups: age_groupRes.data,
        });
      } catch (error) {
        console.error('Error fetching dropdown options:', error);
      }
    };

    fetchOptions();
  }, []);

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

    if (!validateForm()) return;         // ✅ CHECK terms
    if (!validatePassword()) return;     // ✅ CHECK password match / length

    const payload = {
      purchaser: {
        ...formData
      }
    };

    try {
      const cleanedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value === "" ? null : value])
      );

      const payload = {
        purchaser: cleanedData
      };

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/purchaser/signup`, payload, {
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
      if (err.response?.data?.errors) {
        const serverErrors = {};
        err.response.data.errors.forEach(error => {
          const [field, message] = error.includes(': ') ? error.split(': ') : ['general', error];
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
  
    if (!terms) {
      newErrors.terms = "You must agree to the terms and conditions.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  return (
    <>
      <TopNavbarMinimal />
      <Container fluid className="login-container">
        <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Col xs={11} md={10} lg={6}>
            <div className="card border-0 shadow-lg overflow-hidden">
              <Row className="g-0">

                {/* Left Branding Section */}
                <Col lg={4} className="d-none d-lg-block">
                  <div className="h-100 d-flex flex-column justify-content-between text-white p-4" style={{
                    background: "linear-gradient(135deg, #000000 0%, #111111 50%, #1a1a1a 100%)"
                    }}>
                    <div className="pt-4">
                      <h2 className="fw-bold">
                        <span className="text-white me-2">Purchaser</span>
                        <span className="text-warning">Portal</span>
                      </h2>
                      <p className="text-light opacity-75 mt-3">
                        Join to explore a world of eco-friendly products, curated just for you.
                      </p>
                    </div>

                    <div className="px-2 py-4">
                      <h5 className="text-warning mb-3">Why Shop with us?</h5>
                      <ul className="list-unstyled">
                        <li className="mb-2 d-flex align-items-center">
                          <span className="me-2 text-warning">✓</span>
                          <span className="small">Wide variety of carbon-conscious products</span>
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <span className="me-2 text-warning">✓</span>
                          <span className="small">Verified and trusted local vendors</span>
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <span className="me-2 text-warning">✓</span>
                          <span className="small">Secure and seamless</span>
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <span className="me-2 text-warning">✓</span>
                          <span className="small">Support kenyan economy with every purchase</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-dark bg-opacity-50 p-3 rounded-3 mt-2">
                      <div className="d-flex align-items-center">
                        {/* <div className="rounded-circle bg-warning" style={{ width: "30px", height: "30px" }}></div> */}
                        <div className="ms-2">
                          <small className="fw-bold">Vision:</small>
                        </div>
                      </div>
                      <p className="fst-italic small mb-2">
                        "To be Kenya’s most trusted and innovative online marketplace."
                      </p>
                    </div>
                  </div>
                </Col>

                {/* Right Branding Section */}
                <Col lg={8}>
                  <div className="card-body p-4 p-lg-5 h-100 d-flex flex-column justify-content-between" style={{ backgroundColor: '#e0e0e0' }}>
                    <h3 className="fw-bold text-center mb-4">Purchaser Sign Up</h3>
                    <Form onSubmit={handleSubmit}>
                      {errors.general && <Alert variant="danger">{errors.general}</Alert>}

                      {step === 1 && (
                        <>
                          <Row>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Full Name"
                                  name="fullname"
                                  className="mb-2 text-center rounded-pill"
                                  value={formData.fullname}
                                  onChange={handleChange}
                                  isInvalid={!!errors.fullname}
                                />
                                <Form.Control.Feedback type="invalid">{errors.fullname}</Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Username"
                                  name="username"
                                  className="mb-2 text-center rounded-pill"
                                  value={formData.username}
                                  onChange={handleChange}
                                  isInvalid={!!errors.username}
                                />
                                <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={12}>
                              <Form.Group>
                                <Form.Control
                                  type="email"
                                  placeholder="Email"
                                  name="email"
                                  className="mb-2 text-center rounded-pill"
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
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Phone Number"
                                  name="phone_number"
                                  className="mb-2 text-center rounded-pill"
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
                                  type="text"
                                  placeholder="City"
                                  name="city"
                                  className="mb-2 text-center rounded-pill"
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
                              <Form.Group>
                                <Form.Select
                                  name="gender"
                                  className="text-center rounded-pill mb-2 rounded-pill"
                                  value={formData.gender}
                                  onChange={handleChange}
                                  isInvalid={!!errors.gender}
                                >
                                  <option value="" disabled hidden>Gender</option>
                                  {["Male", "Female", "Other"].map(g => (
                                    <option key={g} value={g}>{g}</option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Select
                                  name="age_group_id"
                                  className="text-center rounded-pill mb-2 rounded-pill"
                                  value={formData.age_group_id}
                                  onChange={handleChange}
                                  isInvalid={!!errors.age_group_id}
                                >
                                  <option value="" disabled hidden>Age Group</option>
                                  {options.age_groups.map(group => (
                                    <option key={group.id} value={group.id}>{group.name}</option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.age_group_id}</Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>

                          <div className="d-flex justify-content-center mt-3">
                            <Button variant="dark" className="rounded-pill w-75" onClick={nextStep}>
                              Continue
                            </Button>
                          </div>
                        </>
                      )}

                      {step === 2 && (
                        <>
                          <Row>
                            <Col md={12} className="position-relative">
                              <Form.Group>
                                <Form.Control
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Password"
                                  name="password"
                                  className="mb-2 text-center rounded-pill"
                                  value={formData.password}
                                  onChange={handleChange}
                                  isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.password}
                                </Form.Control.Feedback>
                                <div
                                  onClick={() => setShowPassword(!showPassword)}
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    right: "20px",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#6c757d",
                                  }}
                                >
                                  <AnimatePresence mode="wait" initial={false}>
                                    {showPassword ? (
                                      <motion.span
                                        key="hidePwd"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <EyeSlash />
                                      </motion.span>
                                    ) : (
                                      <motion.span
                                        key="showPwd"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <Eye />
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={12} className="position-relative">
                              <Form.Group>
                                <Form.Control
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirm Password"
                                  name="password_confirmation"
                                  className="mb-2 text-center rounded-pill"
                                  value={formData.password_confirmation}
                                  onChange={handleChange}
                                  isInvalid={!!errors.password_confirmation}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.password_confirmation}
                                </Form.Control.Feedback>
                                <div
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    right: "20px",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#6c757d",
                                  }}
                                >
                                  <AnimatePresence mode="wait" initial={false}>
                                    {showConfirmPassword ? (
                                      <motion.span
                                        key="hideConfirm"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <EyeSlash />
                                      </motion.span>
                                    ) : (
                                      <motion.span
                                        key="showConfirm"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <Eye />
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Form.Group className="mb-2">
                            <Form.Check
                              type="checkbox"
                              label="Agree to Terms and Conditions and receive SMS/emails."
                              name="terms"
                              checked={terms}
                              onChange={(e) => setTerms(e.target.checked)}
                            />
                            {errors.terms && <div className="text-danger mt-1">{errors.terms}</div>}
                          </Form.Group>

                          <Row className="mt-3">
                            <Col className="d-flex justify-content-between">
                              <Button variant="dark" className="rounded-pill w-25" onClick={prevStep}>
                                Back
                              </Button>
                              <Button
                                variant="warning"
                                type="submit"
                                className="rounded-pill w-25"
                                disabled={!terms}
                              >
                                Sign Up
                              </Button>
                            </Col>
                          </Row>
                        </>
                      )}

                      <div className="divider mt-4">
                        <span>or continue with</span>
                      </div>

                      <div className="d-flex justify-content-around mb-3">
                        <Button variant="warning rounded-pill" className="social-btn"><Google size={20} /></Button>
                        <Button variant="warning rounded-pill" className="social-btn"><Facebook size={20} /></Button>
                        <Button variant="warning rounded-pill" className="social-btn"><Apple size={20} /></Button>
                      </div>

                      <div className="text-center mt-2">
                        Already have an account? <a href="./login" className="login-link">Sign In</a>
                      </div>
                    </Form>

                    <ProgressBar now={step * 50} className=" mt-3 rounded-pill" variant="warning" style={{ height: '8px' }}/>
                  </div>
                </Col>
                    
                
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default PurchaserSignUpPage;