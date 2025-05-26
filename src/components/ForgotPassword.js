import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/password_resets/request_otp`, {
        email: emailOrPhone.trim(),
      });

      setMessage(response.data.message || 'OTP sent. Please check your email.');
      setStep(2); // Move to next step
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and reset password
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/password_resets/verify_otp`, {
        email: emailOrPhone.trim(),
        otp: otp.trim(),
        new_password: newPassword,
      });

      setMessage(response.data.message || 'Password reset successful. You can now login.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP or password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h3 className="mb-4 text-center">Forgot Password</h3>

          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          {step === 1 && (
            <Form onSubmit={handleRequestOtp}>
              <Form.Group controlId="emailOrPhone" className="mb-3">
                <Form.Label>Email or Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your registered email or phone"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" disabled={loading} className="w-100">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </Form>
          )}

          {step === 2 && (
            <Form onSubmit={handleVerifyOtp}>
              <Form.Group controlId="otp" className="mb-3">
                <Form.Label>OTP</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the OTP sent to your email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="newPassword" className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" disabled={loading} className="w-100">
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </Form>
          )}

          {step === 3 && (
            <div className="text-center">
              <p>Password reset successful. <a href="/login">Click here to login</a>.</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
