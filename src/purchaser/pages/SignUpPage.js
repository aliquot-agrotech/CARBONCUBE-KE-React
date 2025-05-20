import React, { useState ,useEffect} from 'react';
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
  const [options, setOptions] = useState({ incomes: [], sectors: [], educations: [], employments: [], age_groups: [] });
  const navigate = useNavigate();
  const [terms, setTerms] = useState(false);
  const [counties, setCounties] = useState([]);
  const [subCounties, setSubCounties] = useState([]);

  useEffect(() => {
    // Fetch options for dropdowns from the API
    const fetchOptions = async () => {
      try {
        const [incomeRes, sectorRes, educationRes, employmentRes, age_groupRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/incomes`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/sectors`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/educations`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/employments`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/age_groups`),
        ]);
        setOptions({
          incomes: incomeRes.data,
          sectors: sectorRes.data,
          educations: educationRes.data,
          employments: employmentRes.data,
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

  useEffect(() => {
      const fetchCounties = async () => {
        try {
          const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/counties`);
          const data = await res.json();
          setCounties(data);
        } catch (err) {
          console.error("Failed to fetch counties", err);
        }
      };
      fetchCounties();
    }, []);
  
    useEffect(() => {
      const fetchSubCounties = async () => {
        if (formData.county_id) {
          try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/counties/${formData.county_id}/sub_counties`);
            const data = await res.json();
            setSubCounties(data);
          } catch (err) {
            console.error("Failed to fetch sub-counties", err);
          }
        } else {
          setSubCounties([]);
        }
      };
      fetchSubCounties();
    }, [formData.county_id]);

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

  let datepickerRef;

  return (
    <Container fluid className="p-0 purchaser-signup-page">
      <Row className="m-0">
        <Col className="warehouse-bg">
          <Col className="form-container align-items-center center">
            <Container className="d-flex justify-content-center">
              <Col xs={12} sm={10} md={12} lg={10}>
                <h2 className="form-title text-center mb-2  ">Purchaser Sign Up</h2>
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
                  
                  {/* <Row>
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
                    
                  </Row> */}
                  
                  <Row>
                    <Col xs={6} md={12}>
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
                    {/* <Col xs={6} md={6}>
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
                    </Col> */}
                    
                  </Row>
                  
                  <Row>
                    <Col xs={6} md={6}>
                      <Form.Group>
                          <Form.Select
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
                          </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.gender}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    {/* <Col xs={6} md={6}>
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
                    </Col> */}
                    <Col xs={6} md={6}>
                      <Form.Group>
                        <Form.Select
                          as="select"
                          name="age_group_id"
                          className="text-center rounded-pill mb-2"
                          value={formData.age_group_id}
                          onChange={handleChange}
                          isInvalid={!!errors.age_group_id}
                        >
                          <option value="" disabled hidden>Select Age</option>
                          {options.age_groups.map((age_group) => (
                            <option key={age_group.id} value={age_group.id}>
                              {age_group.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.age_group_id}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* <Row>
                  <Col xs={6} md={6}>
                      <Form.Group>
                        <Form.Select
                          as="select"
                          name="education_id"
                          className="text-center rounded-pill mb-2"
                          value={formData.education_id || ""}
                          onChange={handleChange}
                          isInvalid={!!errors.education_id}
                        >
                          <option value="" disabled hidden>Select Education</option>
                          {options.educations.map((education) => (
                            <option key={education.id} value={education.id}>
                              {education.level}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.education_id}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col xs={6} md={6}>
                      <Form.Group>
                        <Form.Select
                          as="select"
                          name="employment_id"
                          className="text-center rounded-pill mb-2"
                          value={formData.employment_id}
                          onChange={handleChange}
                          isInvalid={!!errors.employment_id}
                        >
                          <option value="" disabled hidden>Select Employment</option>
                          {options.employments.map((employment) => (
                            <option key={employment.id} value={employment.id}>
                              {employment.status}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.employment_id}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row> */}

                  {/* <Row>
                    <Col xs={6} md={6}>
                      <Form.Group>
                        <Form.Select
                          as="select"
                          name="sector_id"
                          className="text-center rounded-pill mb-2"
                          value={formData.sector_id}
                          onChange={handleChange}
                          isInvalid={!!errors.sector_id}
                        >
                          <option value="" disabled hidden>Select Sector</option>
                          {options.sectors.map((sector) => (
                            <option key={sector.id} value={sector.id}>
                              {sector.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.sector_id}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col xs={6} md={6}>
                      <Form.Group>
                        <Form.Select
                          as="select"
                          name="income_id"
                          className="text-center rounded-pill mb-2"
                          value={formData.income_id}
                          onChange={handleChange}
                          isInvalid={!!errors.income_id}
                        >
                          <option value="" disabled hidden>Select Income</option>
                          {options.incomes.map((income) => (
                            <option key={income.id} value={income.id}>
                              {income.range}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.income_id}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Select
                          name="county_id"
                          value={formData.county_id}
                          id="button"
                          onChange={handleChange}
                          className="mb-2 text-center"
                          isInvalid={!!errors.county_id}
                        >
                          <option value="">Select County</option>
                          {counties.map((county) => (
                            <option key={county.id} value={county.id}>{county.name}</option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.county_id}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Select
                          name="sub_county_id"
                          value={formData.sub_county_id}
                          onChange={handleChange}
                          className="mb-2 text-center"
                          id="button"
                          isInvalid={!!errors.sub_county_id}
                          disabled={!formData.county_id}
                        >
                          <option value="">Select Sub-County</option>
                          {subCounties.map((sub) => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.sub_county_id}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row> */}

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
                      checked={terms}
                      onChange={(e) => setTerms(e.target.checked)}
                    />
                    {errors.terms && <div className="text-danger mt-1">{errors.terms}</div>}
                  </Form.Group>

                  <Button
                    variant="warning"
                    type="submit"
                    className="w-100 mb-0 rounded-pill"
                    disabled={!terms} // Disable the button until terms are agreed to
                  >
                    Sign Up
                  </Button>
                  
                  <div className="divider">
                    <span>or continue with</span>
                  </div>
                  
                  <div className="d-flex justify-content-around">
                    <Button variant="warning rounded-pill" className="social-btn">
                      <Google size={25} />
                    </Button>
                    <Button variant="warning rounded-pill" className="social-btn">
                      <Facebook size={25} />
                    </Button>
                    <Button variant="warning rounded-pill" className="social-btn">
                      <Apple size={25} />
                    </Button>
                  </div>
                  
                  <div className="text-center mt-2">
                    Already have an account? <a href="./login" className="login-link">Sign In</a>
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