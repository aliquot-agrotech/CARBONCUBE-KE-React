import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col, Card, Form } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Spinner from "react-spinkit";
import '../css/TiersManagement.css';

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

    const fetchTiers = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://carboncube-ke-rails-cu22.onrender.com/admin/tiers', {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                },
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to fetch tiers');
            }
            const data = await response.json();
            setTiers(
                data.map((tier, index) => ({
                    ...tier,
                    orderIndex: index, // Add an order index to preserve the original position
                    tier_features: tier.tier_features || [{ feature_name: '' }],
                    tier_pricings: tier.tier_pricings || [{ duration_months: '', price: '' }],
                }))
            );
        } catch (error) {
            setError(`Error fetching tiers: ${error.message}`);
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
            tier ? 
            {
                ...tier,
                features: tier.tier_features || [{ feature_name: '' }],
                pricings: tier.tier_pricings || [{ duration_months: '', price: '' }],
            }
            : 
            { 
                name: '', ads_limit: 0, features: [{ feature_name: '' }], 
                pricings: [{ duration_months: '', price: '' }] 
            }
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
            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newTier.name,
                    ads_limit: newTier.ads_limit,
                    features: newTier.features,
                    pricings: newTier.pricings,
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to save tier');
            }
            const updatedTier = await response.json();
    
            setTiers((prevTiers) =>
                prevTiers.map((tier) =>
                    tier.id === updatedTier.id
                        ? { ...updatedTier, orderIndex: tier.orderIndex } // Preserve order index
                        : tier
                )
            );
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
        return <div className="error-message">{error}</div>;
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
                                                {tiers
                                                    .slice() // Create a shallow copy to avoid mutating the original array
                                                    .sort((a, b) => a.id - b.id) // Sort by ID in ascending order
                                                    .map((tier) => (
                                                        <Col xs={12} md={6} lg={3} key={tier.id} className="mb-4">
                                                            <Card className="custom-card">
                                                                <Card.Header className="text-center bg-warning text-white">
                                                                    <h5 className="mb-0 text-dark">{tier.name}</h5>
                                                                </Card.Header>
                                                                <Card.Body>
                                                                    <p><strong>Ads Limit:</strong> {tier.ads_limit}</p>
                                                                    <h5 className="text-center">Features:</h5>
                                                                    <ul>
                                                                        {tier.tier_features.map((feature, index) => (
                                                                            <li key={index}>
                                                                                <em>{feature.feature_name}</em>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                    <h5 className="text-center">Pricing:</h5>
                                                                    <ul>
                                                                        {tier.tier_pricings.map((pricing, index) => (
                                                                            <li key={index} className="d-flex justify-content-center align-items-center">
                                                                                <Card.Text className="price-container d-flex justify-content-center align-items-center mb-0">
                                                                                    <span className="me-2">{pricing.duration_months} months -</span>
                                                                                    <span>
                                                                                        <em className="product-price-label text-success">Kshs: </em>
                                                                                    </span>
                                                                                    <strong style={{ fontSize: '17px' }} className="text-danger ms-1">
                                                                                        {pricing.price
                                                                                            ? parseFloat(pricing.price)
                                                                                                .toFixed(2)
                                                                                                .split('.')
                                                                                                .map((part, i) => (
                                                                                                    <React.Fragment key={i}>
                                                                                                        {i === 0 ? (
                                                                                                            <span>{parseInt(part).toLocaleString()}</span> // Integer part with comma
                                                                                                        ) : (
                                                                                                            <>
                                                                                                                <span style={{ fontSize: '16px' }}>.</span>
                                                                                                                <span className="price-decimal">{part}</span>
                                                                                                            </>
                                                                                                        )}
                                                                                                    </React.Fragment>
                                                                                                ))
                                                                                            : 'N/A'}
                                                                                    </strong>
                                                                                </Card.Text>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </Card.Body>
                                                                <Card.Footer className="text-center">
                                                                    <Button
                                                                        variant="warning"
                                                                        className="rounded-pill py-1 my-0"
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
                <Modal centered show={showModal} onHide={handleCloseModal} size="lg">
                    <Modal.Header>
                        <Modal.Title>{isEditing ? 'Edit Tier' : 'Add New Tier'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            {/* Tier Name */}
                            <Form.Group>
                            <Row className="justify-content-center text-center">
                                <Form.Label><h5><strong>Name</strong></h5></Form.Label>
                            </Row>
                                
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
                                <Row className="justify-content-center text-center">
                                    <Form.Label><h5><strong>Ads Limit</strong></h5></Form.Label>
                                </Row>
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
                                <Row className="justify-content-center text-center">
                                    <Form.Label><h4><strong>Features</strong></h4></Form.Label>
                                </Row>
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
                                                className="rounded-pill"
                                                onClick={() => {
                                                    const updatedFeatures = newTier.features.filter(
                                                        (_, i) => i !== index
                                                    );
                                                    setNewTier({ ...newTier, features: updatedFeatures });
                                                }}
                                            >
                                                <Trash size={20} /> {/* Use Trash icon */}
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Button
                                    variant="primary"
                                    className="rounded-pill"
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
                                <Row className="justify-content-center text-center">
                                    <Form.Label><h4><strong>Pricing</strong></h4></Form.Label>
                                </Row>
                                <Row className="mb-3">
                                    {/* Column Headings */}
                                    <Col xs={5} className="text-center">
                                        <strong>Months</strong>
                                    </Col>
                                    <Col xs={5} className="text-center">
                                        <strong>Price</strong>
                                    </Col>
                                    <Col xs={2} />
                                </Row>
                                {newTier.pricings.map((pricing, index) => (
                                    <Row key={index} className="mb-3 align-items-center">
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
                                                // className="form-control-lg"
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
                                                // className="form-control-lg"
                                            />
                                        </Col>
                                        <Col xs={2} className="d-flex justify-content-center">
                                            <Button
                                                variant="danger"
                                                className="rounded-pill"
                                                onClick={() => {
                                                    const updatedPricings = newTier.pricings.filter(
                                                        (_, i) => i !== index
                                                    );
                                                    setNewTier({ ...newTier, pricings: updatedPricings });
                                                }}
                                            >
                                                <Trash size={20} />
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Button
                                    variant="primary"
                                    className="rounded-pill mt-3"
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
                    <Modal.Footer className="p-0 p-lg-1">
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
