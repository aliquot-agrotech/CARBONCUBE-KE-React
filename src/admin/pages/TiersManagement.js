import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col, Card, Form } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Spinner from "react-spinkit";
// import '../css/TiersManagement.css'; // Custom CSS for Tiers

const TiersManagement = () => {
    const [tiers, setTiers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTier, setSelectedTier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newTier, setNewTier] = useState({ name: '', description: '', duration: '', price: 0 });

    const fetchTiers = async () => {
        try {
            const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/admin/tiers`, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setTiers(data);
        } catch (error) {
            setError('Error fetching tiers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTiers();
    }, []);

    const handleShowModal = (tier = null) => {
        setSelectedTier(tier);
        setIsEditing(!!tier);
        setShowModal(true);
        setNewTier(tier || { name: '', description: '', duration: '', price: 0 });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTier(null);
        setNewTier({ name: '', description: '', duration: '', price: 0 });
    };

    const handleSaveTier = async () => {
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing
            ? `https://carboncube-ke-rails-cu22.onrender.com/admin/tiers/${selectedTier.id}`
            : 'https://carboncube-ke-rails-cu22.onrender.com/admin/tiers';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTier),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save tier: ${response.status} - ${errorText}`);
            }

            handleCloseModal();
            setLoading(true);
            await fetchTiers();
        } catch (error) {
            setError(`Error saving tier: ${error.message}`);
        }
    };

    const handleDeleteTier = async (id) => {
        try {
            const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/admin/tiers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete tier: ${response.status} - ${errorText}`);
            }

            setLoading(true);
            await fetchTiers();
        } catch (error) {
            setError(`Error deleting tier: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="centered-loader">
                <Spinner variant="warning" name="cube-grid" style={{ width: 100, height: 100 }} />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <TopNavbar />
            <div className="tiers-management-page">
                <Container fluid className="p-0">
                    <Row>
                        <Col xs={12} md={2} className="p-0 d-flex flex-column">
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={10} lg={9} className="p-2 d-flex flex-column">
                            <Card className="section">
                                <Card.Header>
                                    <h3 className="mb-0">Tiers Management</h3>
                                </Card.Header>
                                <Card.Body>
                                    {tiers.length > 0 ? (
                                        <Row>
                                            {tiers.map((tier) => (
                                                <Col xs={12} md={6} key={tier.id} className="mb-3">
                                                    <Card className="custom-card">
                                                        <Card.Header>
                                                            <h4>{tier.name}</h4>
                                                        </Card.Header>
                                                        <Card.Body>
                                                            <p><strong>Description:</strong> {tier.description}</p>
                                                            <p><strong>Duration:</strong> {tier.duration}</p>
                                                            <p><strong>Price:</strong> ${tier.price}</p>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-between">
                                                            <Button variant="warning" onClick={() => handleShowModal(tier)}>Edit</Button>
                                                            <Button variant="danger" onClick={() => handleDeleteTier(tier.id)}>Delete</Button>
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    ) : (
                                        <p>No tiers available</p>
                                    )}
                                </Card.Body>
                                <Card.Footer className="text-center">
                                    <Button variant="success" onClick={() => handleShowModal()}>
                                        Add New Tier
                                    </Button>
                                </Card.Footer>
                            </Card>
                            <Modal centered show={showModal} onHide={handleCloseModal}>
                                <Modal.Header>
                                    <Modal.Title>{isEditing ? 'Edit Tier' : 'Add New Tier'}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group controlId="tierName">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={newTier.name}
                                                onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="tierDescription">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={newTier.description}
                                                onChange={(e) => setNewTier({ ...newTier, description: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="tierDuration">
                                            <Form.Label>Duration</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={newTier.duration}
                                                onChange={(e) => setNewTier({ ...newTier, duration: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="tierPrice">
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={newTier.price}
                                                onChange={(e) => setNewTier({ ...newTier, price: parseFloat(e.target.value) })}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="primary" onClick={handleSaveTier}>
                                        Save Changes
                                    </Button>
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default TiersManagement;
