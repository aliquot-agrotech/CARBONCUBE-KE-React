import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import { Pie } from 'react-chartjs-2';
import './PromotionsDiscount.css';  // Custom CSS

const PromotionsDiscount = () => {
    const [promotions, setPromotions] = useState([]);
    const [discountCodes, setDiscountCodes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newPromotion, setNewPromotion] = useState({ title: '', description: '', discount_percentage: 0 });

    useEffect(() => {
        // Fetch promotions and discount codes from the backend
        fetchPromotions();
        fetchDiscountCodes();
    }, []);

    const fetchPromotions = async () => {
        const response = await fetch('/api/promotions');
        const data = await response.json();
        setPromotions(data);
    };

    const fetchDiscountCodes = async () => {
        const response = await fetch('/api/discount_codes');
        const data = await response.json();
        setDiscountCodes(data);
    };

    const handleSave = () => {
        // Handle saving promotions or discount codes
        setShowModal(false);
        // Optionally refresh data
        fetchPromotions();
        fetchDiscountCodes();
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const pieData = (percentage) => ({
        datasets: [{
            data: [percentage, 100 - percentage],
            backgroundColor: ['#ffc107', '#f8f9fa'],
        }],
        labels: ['Completed', 'Remaining'],
    });

    return (
        <>
            <TopNavbar />
            <div className="promotions-discount-page">
                <Container fluid className="p-0">
                    <Row>
                        <Col xs={12} md={2} className="p-0">
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={10} className="p-4">
                            <Row>
                                <Col md={6} className="mb-4">
                                    <Card className="promotion-card">
                                        <Card.Header className="card-header">Active Promotions</Card.Header>
                                        <Card.Body>
                                            <ul className="promotions-list">
                                                {promotions.map((promotion, index) => (
                                                    <li key={index}>{promotion.title}</li>
                                                ))}
                                            </ul>
                                            <Button variant="warning" className="edit-button" onClick={handleShowModal}>
                                                <i className="bi bi-pencil"></i> Edit
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} className="mb-4">
                                    <Card className="discount-card">
                                        <Card.Header className="card-header">Discount Codes</Card.Header>
                                        <Card.Body>
                                            <ul className="discount-list">
                                                {discountCodes.map((code, index) => (
                                                    <li key={index}>{code.code}</li>
                                                ))}
                                            </ul>
                                            <Button variant="warning" className="edit-button" onClick={handleShowModal}>
                                                <i className="bi bi-pencil"></i> Edit
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6} className="mb-4">
                                    <Card className="campaign-card">
                                        <Card.Header className="card-header">Campaign Performance</Card.Header>
                                        <Card.Body className="text-center">
                                            <Pie data={pieData(40)} />
                                            <p>Redemption Rate</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} className="mb-4">
                                    <Card className="campaign-card">
                                        <Card.Header className="card-header">Campaign Performance</Card.Header>
                                        <Card.Body className="text-center">
                                            <Pie data={pieData(20)} />
                                            <p>Sales Increase</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Promotion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter title" />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter description" />
                        </Form.Group>
                        <Form.Group controlId="formDiscountPercentage">
                            <Form.Label>Discount Percentage</Form.Label>
                            <Form.Control type="number" placeholder="Enter discount percentage" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="warning" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PromotionsDiscount;
