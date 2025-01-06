import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col, Card, Form } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Spinner from "react-spinkit";
import '../css/TiersManagement.css'; // Custom CSS for additional styling

const TiersManagement = () => {
    const [tiers, setTiers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTier, setSelectedTier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newTier, setNewTier] = useState({
        name: '',
        ads_limit: 0,
        features: [{ feature_name: '' }],
        pricings: [{ duration_months: '', price: '' }],
    });

    // Fetch Tiers
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
        setNewTier(
            tier
                ? {
                      ...tier,
                      features: tier.tier_features || [{ feature_name: '' }],
                      pricings: tier.tier_pricings || [{ duration_months: '', price: '' }],
                  }
                : { name: '', ads_limit: 0, features: [{ feature_name: '' }], pricings: [{ duration_months: '', price: '' }] }
        );
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTier(null);
        setNewTier({ name: '', ads_limit: 0, features: [{ feature_name: '' }], pricings: [{ duration_months: '', price: '' }] });
    };

    const handleSaveTier = async () => {
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing
            ? `https://carboncube-ke-rails-cu22.onrender.com/admin/tiers/${selectedTier.id}`
            : 'https://carboncube-ke-rails-cu22.onrender.com/admin/tiers';

        try {
            const tierResponse = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newTier.name,
                    ads_limit: newTier.ads_limit,
                    features: newTier.features,
                    pricings: newTier.pricings,
                }),
            });

            if (!tierResponse.ok) {
                throw new Error('Failed to save tier');
            }

            await fetchTiers();
            handleCloseModal();
        } catch (error) {
            setError(`Error saving tier: ${error.message}`);
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
                                <Card.Header className="justify-content-center">
                                    <h3 className="mb-0">Tiers Management</h3>
                                </Card.Header>
                                <Card.Body>
                                    {tiers.length > 0 ? (
                                        <Container>
                                            <Row>
                                                {tiers.map((tier) => (
                                                    <Col xs={12} md={6} lg={3} key={tier.id} className="mb-4">
                                                        <Card className="custom-card">
                                                            <Card.Header className="text-center bg-warning text-white">
                                                                <h5 className="mb-0">{tier.name}</h5>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                <p><strong>Ads Limit:</strong> {tier.ads_limit}</p>
                                                                <h6>Features:</h6>
                                                                <ul>
                                                                    {tier.tier_features.map((feature, index) => (
                                                                        <li key={index}>{feature.feature_name}</li>
                                                                    ))}
                                                                </ul>
                                                                <h6>Pricing:</h6>
                                                                <ul>
                                                                    {tier.tier_pricings.map((pricing, index) => (
                                                                        <li key={index}>
                                                                            {pricing.duration_months} months - Kshs {pricing.price}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </Card.Body>
                                                            <Card.Footer className="text-center">
                                                                <Button
                                                                    variant="warning"
                                                                    className="rounded-pill"
                                                                    onClick={() => handleShowModal(tier)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </Card.Footer>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Container>
                                    ) : (
                                        <p>No tiers available.</p>
                                    )}
                                </Card.Body>
                                <Card.Footer className="text-center">
                                    <Button variant="warning" className="rounded-pill" onClick={() => handleShowModal()}>
                                        Add New Tier
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </Container>

                {/* Modal */}
                <Modal centered show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditing ? 'Edit Tier' : 'Add New Tier'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            {/* Tier Name */}
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newTier.name}
                                    onChange={(e) =>
                                        setNewTier({ ...newTier, name: e.target.value })
                                    }
                                />
                            </Form.Group>

                            {/* Ads Limit */}
                            <Form.Group>
                                <Form.Label>Ads Limit</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={newTier.ads_limit}
                                    onChange={(e) =>
                                        setNewTier({ ...newTier, ads_limit: e.target.value })
                                    }
                                />
                            </Form.Group>

                            {/* Features */}
                            <Form.Group>
                                <Form.Label>Features</Form.Label>
                                {newTier.features.map((feature, index) => (
                                    <Row key={index} className="mb-2">
                                        <Col xs={10}>
                                            <Form.Control
                                                type="text"
                                                placeholder={`Feature ${index + 1}`}
                                                value={feature.feature_name}
                                                onChange={(e) => {
                                                    const updatedFeatures = [...newTier.features];
                                                    updatedFeatures[index].feature_name = e.target.value;
                                                    setNewTier({ ...newTier, features: updatedFeatures });
                                                }}
                                            />
                                        </Col>
                                        <Col xs={2}>
                                            <Button
                                                variant="danger"
                                                onClick={() => {
                                                    const updatedFeatures = newTier.features.filter(
                                                        (_, i) => i !== index
                                                    );
                                                    setNewTier({ ...newTier, features: updatedFeatures });
                                                }}
                                            >
                                                -
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Button
                                    variant="primary"
                                    onClick={() =>
                                        setNewTier({
                                            ...newTier,
                                            features: [...newTier.features, { feature_name: '' }],
                                        })
                                    }
                                >
                                    Add Feature
                                </Button>
                            </Form.Group>

                            {/* Pricing */}
                            <Form.Group>
                                <Form.Label>Pricing</Form.Label>
                                {newTier.pricings.map((pricing, index) => (
                                    <Row key={index} className="mb-2">
                                        <Col xs={5}>
                                            <Form.Control
                                                type="number"
                                                placeholder="Months"
                                                value={pricing.duration_months}
                                                onChange={(e) => {
                                                    const updatedPricings = [...newTier.pricings];
                                                    updatedPricings[index].duration_months = e.target.value;
                                                    setNewTier({ ...newTier, pricings: updatedPricings });
                                                }}
                                            />
                                        </Col>
                                        <Col xs={5}>
                                            <Form.Control
                                                type="number"
                                                placeholder="Price"
                                                value={pricing.price}
                                                onChange={(e) => {
                                                    const updatedPricings = [...newTier.pricings];
                                                    updatedPricings[index].price = e.target.value;
                                                    setNewTier({ ...newTier, pricings: updatedPricings });
                                                }}
                                            />
                                        </Col>
                                        <Col xs={2}>
                                            <Button
                                                variant="danger"
                                                onClick={() => {
                                                    const updatedPricings = newTier.pricings.filter(
                                                        (_, i) => i !== index
                                                    );
                                                    setNewTier({ ...newTier, pricings: updatedPricings });
                                                }}
                                            >
                                                -
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Button
                                    variant="primary"
                                    onClick={() =>
                                        setNewTier({
                                            ...newTier,
                                            pricings: [
                                                ...newTier.pricings,
                                                { duration_months: '', price: '' },
                                            ],
                                        })
                                    }
                                >
                                    Add Pricing
                                </Button>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="warning" onClick={handleSaveTier}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default TiersManagement;
