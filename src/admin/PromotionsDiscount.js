import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import { Pie } from 'react-chartjs-2';
import './PromotionsDiscount.css';  // Custom CSS

const PromotionsDiscount = () => {
    const [promotions, setPromotions] = useState([]); // Initialize as empty array
    const [activePromotion, setActivePromotion] = useState({
        id: null,
        title: '',
        description: '',
        discount_percentage: 0,
        coupon_code: '',  // Added coupon_code to the state
        start_date: '',
        end_date: ''
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Fetch promotions from the backend
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            const response = await fetch('http://localhost:3000/admin/promotions');
            const data = await response.json();
            
            // Check if data is an array before setting state
            if (Array.isArray(data)) {
                setPromotions(data);
            } else {
                console.error('Fetched data is not an array:', data);
                setPromotions([]); // Set to empty array in case of unexpected data format
            }
        } catch (error) {
            console.error('Failed to fetch promotions:', error);
            setPromotions([]); // Set to empty array on error
        }
    };

    const handleSave = async () => {
        const url = activePromotion.id 
            ? `http://localhost:3000/admin/promotions/${activePromotion.id}` 
            : 'http://localhost:3000/admin/promotions';

        const method = activePromotion.id ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(activePromotion),
        });

        if (response.ok) {
            setShowModal(false);
            fetchPromotions(); // Refresh the promotions list
        } else {
            // Handle error
            console.error('Failed to save promotion');
        }
    };

    const handleShowModal = (promotion = null) => {
        if (promotion) {
            setActivePromotion(promotion);
        } else {
            setActivePromotion({
                id: null,
                title: '',
                description: '',
                discount_percentage: 0,
                coupon_code: '',  // Initialize coupon_code
                start_date: '',
                end_date: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setActivePromotion({ ...activePromotion, [name]: value });
    };

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:3000/admin/promotions/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchPromotions(); // Refresh the promotions list
        } else {
            // Handle error
            console.error('Failed to delete promotion');
        }
    };

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
                                <Col md={12} className="mb-4">
                                    <Card className="promotion-card">
                                        <Card.Header className="card-header">Active Promotions</Card.Header>
                                        <Card.Body>
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>Title</th>
                                                        <th>Description</th>
                                                        <th>Discount Percentage</th>
                                                        <th>Coupon Code</th>
                                                        <th>Start Date</th>
                                                        <th>End Date</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {promotions.map((promotion, index) => (
                                                        <tr key={promotion.id}>
                                                            <td>{promotion.title}</td>
                                                            <td>{promotion.description}</td>
                                                            <td>{promotion.discount_percentage}%</td>
                                                            <td>{promotion.coupon_code}</td>
                                                            <td>{new Date(promotion.start_date).toLocaleDateString()}</td>
                                                            <td>{new Date(promotion.end_date).toLocaleDateString()}</td>
                                                            <td>
                                                                <Button 
                                                                    variant="warning" 
                                                                    className="mr-2" 
                                                                    onClick={() => handleShowModal(promotion)}
                                                                >
                                                                    <i className="bi bi-pencil"></i> Edit
                                                                </Button>
                                                                <Button 
                                                                    variant="danger" 
                                                                    onClick={() => handleDelete(promotion.id)}
                                                                >
                                                                    <i className="bi bi-trash"></i> Delete
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                            <Button variant="warning" className="mt-3" onClick={() => handleShowModal()}>
                                                <i className="bi bi-plus"></i> Add New Promotion
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
                    <Modal.Title>{activePromotion.id ? 'Edit Promotion' : 'Create New Promotion'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="title"
                                placeholder="Enter title" 
                                value={activePromotion.title} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="description"
                                placeholder="Enter description" 
                                value={activePromotion.description} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDiscountPercentage">
                            <Form.Label>Discount Percentage</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="discount_percentage"
                                placeholder="Enter discount percentage" 
                                value={activePromotion.discount_percentage} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStartDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control 
                                type="datetime-local" 
                                name="start_date"
                                value={activePromotion.start_date} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEndDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control 
                                type="datetime-local" 
                                name="end_date"
                                value={activePromotion.end_date} 
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCouponCode">
                            <Form.Label>Coupon Code</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="coupon_code"  // Use name attribute for general handler
                                placeholder="Enter coupon code" 
                                value={activePromotion.coupon_code} 
                                onChange={handleInputChange}  // General handler
                            />
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
