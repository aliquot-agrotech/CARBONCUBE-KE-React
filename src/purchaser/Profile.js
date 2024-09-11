import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import './Profile.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        zip_code: '',
        gender: '',
        address: '',
        city: '',
        birth_date: ''
    });

    const [editMode, setEditMode] = useState(false);

    // Retrieve token from localStorage
    const token = localStorage.getItem('token'); // Adjust the key to match your app

    // Fetch profile data from the backend API
    useEffect(() => {
        if (!token) {
        console.error('No auth token found');
        return;
        }

        axios.get('http://localhost:3000/purchaser/profile', {
        headers: {
            Authorization: `Bearer ${token}`
        }
        })
        .then(response => {
            setProfile(response.data);
        })
        .catch(error => {
            console.error('Error fetching profile data:', error);
            if (error.response.status === 401) {
            console.error('Unauthorized access. Please login again.');
            }
        });
    }, [token]);

    // Handle input change for editing the profile
    const handleChange = (e) => {
        setProfile({
        ...profile,
        [e.target.name]: e.target.value,
        });
    };

    // Toggle edit mode
    const handleEditClick = () => {
        setEditMode(!editMode);
    };

    // Handle form submission to save updated profile
    const handleSaveClick = () => {
        if (!token) {
        console.error('No auth token found');
        return;
        }

        axios.put('http://localhost:3000/purchaser/profile', profile, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        })
        .then(response => {
            setProfile(response.data);
            setEditMode(false);
        })
        .catch(error => {
            console.error('Error saving profile data:', error);
        });
    };

    return (
        <>
        <TopNavbar />
        <div className="profile-page">
            <Container fluid className="p-0">
            <Row>
                <Col xs={12} md={2} className="p-0">
                <Sidebar />
                </Col>
                <Col xs={12} md={10} className="p-2">
                <Container>
                    <div className="profile-container">
                    <h3>Welcome, {profile.fullname}</h3>
                    <p>{new Date().toLocaleDateString()}</p>
                    
                    <div className="profile-info">
                        <img src="profile-picture-url" alt="Profile" className="profile-pic" />
                        <p>{profile.email}</p>
                        
                        <Button variant="warning" id="button" onClick={handleEditClick}>
                        {editMode ? 'Cancel' : 'Edit'}
                        </Button>
                        
                        <Form>
                        <Row>
                            <Col md={6}>
                            <Form.Group controlId="formFullName">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                type="text"
                                name="full_name"
                                value={profile.fullname}
                                onChange={handleChange}
                                disabled={!editMode}
                                />
                            </Form.Group>
                            </Col>
                            <Col md={6}>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                disabled={!editMode}
                                />
                            </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                            <Form.Group controlId="formPhoneNumber">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                type="text"
                                name="phone_number"
                                value={profile.phone_number}
                                onChange={handleChange}
                                disabled={!editMode}
                                />
                            </Form.Group>
                            </Col>
                            <Col md={6}>
                            <Form.Group controlId="formAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                type="text"
                                name="address"
                                value={profile.location}
                                onChange={handleChange}
                                disabled={!editMode}
                                />
                            </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                            <Form.Group controlId="formZipCode">
                                <Form.Label>Zip Code (Optional)</Form.Label>
                                <Form.Control
                                type="text"
                                name="zip_code"
                                value={profile.zip_code}
                                onChange={handleChange}
                                disabled={!editMode}
                                />
                            </Form.Group>
                            </Col>
                            <Col md={6}>
                            <Form.Group controlId="formCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                type="text"
                                name="city"
                                value={profile.city}
                                onChange={handleChange}
                                disabled={!editMode}
                                />
                            </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                            <Form.Group controlId="formGender">
                                <Form.Label>Gender</Form.Label>
                                <Form.Control
                                as="select"
                                name="gender"
                                value={profile.gender}
                                onChange={handleChange}
                                disabled={!editMode}
                                >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                </Form.Control>
                            </Form.Group>
                            </Col>
                            <Col md={6}>
                            <Form.Group controlId="formBirthDate">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                type="text"
                                name="username"
                                value={profile.username}
                                onChange={handleChange}
                                disabled={!editMode}
                                />
                            </Form.Group>
                            </Col>
                        </Row>

                        {editMode && (
                            <Button variant="success" id="button" onClick={handleSaveClick}>
                            Save
                            </Button>
                        )}
                        <Button variant="danger" id="button" className="ml-2">
                            Delete Account
                        </Button>
                        </Form>
                    </div>
                    </div>
                </Container>
                </Col>
            </Row>
            </Container>
        </div>
        </>
    );
};

export default ProfilePage;
