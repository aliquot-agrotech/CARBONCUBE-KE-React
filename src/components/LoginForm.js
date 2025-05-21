import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Google, Facebook, Apple } from 'react-bootstrap-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TopNavbarMinimal from './TopNavBarMinimal';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
        identifier,
        password,
      });

      const { token, user } = response.data;
      onLogin(token, user);

      switch (user.role) {
        case 'purchaser':
          navigate('/purchaser/home');
          break;
        case 'vendor':
          navigate('/vendor/analytics');
          break;
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
                        <span className="text-white">Carbon</span>
                        <span className="text-warning">Cube</span>
                      </h2>
                      <p className="text-light opacity-75 mt-3">
                        Welcome to CarbonCube - your trusted online marketplace for carbon credits.
                      </p>
                    </div>

                    <div className="px-2 py-4">
                      <h5 className="text-warning mb-3">Why CarbonCube?</h5>
                      <ul className="list-unstyled">
                        <li className="mb-2 d-flex align-items-center">
                          <span className="me-2 text-warning">✓</span>
                          <span className="small">Manage carbon product listings</span>
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <span className="me-2 text-warning">✓</span>
                          <span className="small">Connect with local vendors</span>
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <span className="me-2 text-warning">✓</span>
                          <span className="small">Real-time deal tracking</span>
                        </li>
                        <li className="mb-2 d-flex align-items-center">
                          <span className="me-2 text-warning">✓</span>
                          <span className="small">Eco-conscious marketplace</span>
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

                {/* Right Login Form Section */}
                <Col lg={8}>
                  <div className="card-body p-4 p-lg-5" style={{ backgroundColor: '#e0e0e0' }}>
                    <h3 className="fw-bold text-center mb-4">Sign In</h3>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleLogin}>
                      <Form.Group controlId="formIdentifier" className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Email or Phone Number"
                          className="text-center rounded-pill"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group controlId="formPassword" className="mb-3">
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          className="text-center rounded-pill"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Form.Group>

                      <Row className="mb-3">
                        <Col xs="6">
                          <Form.Check
                            type="checkbox"
                            id="rememberMeSwitch"
                            label="Remember me"
                          />
                        </Col>
                        <Col xs="6" className="text-end">
                          <a href="/" className="text-muted">Forgot Password?</a>
                        </Col>
                      </Row>

                      <Button
                        variant="warning"
                        type="submit"
                        className="w-100 rounded-pill mb-3"
                        disabled={loading}
                      >
                        {loading ? 'Signing In...' : 'Sign In'}
                      </Button>

                      <div className="separator my-4 text-center">or continue with</div>

                      <Row className="justify-content-center mb-3">
                        <Col xs="auto">
                          <Button variant="warning" className="social-btn rounded-pill"><Google size={20} /></Button>
                        </Col>
                        <Col xs="auto">
                          <Button variant="warning" className="social-btn rounded-pill"><Facebook size={20} /></Button>
                        </Col>
                        <Col xs="auto">
                          <Button variant="warning" className="social-btn rounded-pill"><Apple size={20} /></Button>
                        </Col>
                      </Row>

                      <p className="text-center mt-3 mb-2">Don't have an account?</p>
                      <Row className="justify-content-center">
                        <Col xs={5} sm={4}>
                          <Button
                            variant="secondary"
                            className="w-100 signup-btn rounded-pill"
                            onClick={() => navigate('/purchaser-signup')}
                          >
                            Purchaser
                          </Button>
                        </Col>
                        <Col xs={5} sm={4}>
                          <Button
                            variant="secondary"
                            className="w-100 signup-btn rounded-pill"
                            onClick={() => navigate('/vendor-signup')}
                          >
                            Vendor
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Col>

              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginForm;
