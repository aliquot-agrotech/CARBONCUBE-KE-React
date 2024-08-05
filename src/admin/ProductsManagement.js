import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, InputGroup, FormControl, Modal, Form, Carousel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTrashRestore } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import './ProductsManagement.css';

const ProductsManagement = () => {
    const [flaggedProducts, setFlaggedProducts] = useState([]);
    const [nonFlaggedProducts, setNonFlaggedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [notificationOptions, setNotificationOptions] = useState([]);
    const [notes, setNotes] = useState('');

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/admin/products', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }

            const data = await response.json();

            // Extract flagged and non-flagged products from the response
            const { flagged = [], non_flagged = [] } = data;

            setFlaggedProducts(flagged);
            setNonFlaggedProducts(non_flagged);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(`Error fetching products: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleNotifyClick = (product) => {
        setSelectedProduct(product);
        setNotificationOptions([]);
        setNotes('');
        setShowModal(true);
    };

    const handleViewDetailsClick = (product) => {
        setSelectedProduct(product);
        setShowDetailsModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setShowDetailsModal(false);
    };

    const handleSendNotification = async () => {
        try {
            const response = await fetch(`http://localhost:3000/admin/products/${selectedProduct.id}/notify`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    options: notificationOptions,
                    notes: notes,
                }),
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }

            handleModalClose();
            await fetchProducts(); // Refresh product list
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    const handleNotificationOptionChange = (e) => {
        const { value, checked } = e.target;
        setNotificationOptions(prevOptions =>
            checked
                ? [...prevOptions, value] // Add the option if checked
                : prevOptions.filter(option => option !== value) // Remove the option if unchecked
        );
    };

    const handleFlagProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/products/${id}/flag`, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }

            await fetchProducts(); // Refresh product list
        } catch (error) {
            console.error('Error flagging product:', error);
        }
    };

    const handleRestoreProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/products/${id}/restore`, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }

            await fetchProducts(); // Refresh product list
        } catch (error) {
            console.error('Error flagging product:', error);
        }
    };

    const filteredNonFlaggedProducts = nonFlaggedProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <TopNavbar />
            <div className="products-management-page">
                <Container fluid className="p-0">
                    <Row>
                        <Col xs={12} md={2} className="p-0">
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={10} className="p-0">
                            <Row className="justify-content-center">
                                <Col xs={9} md={6} lg={4} className="mb-3 pt-3">
                                    <div className="search-container">
                                        <InputGroup>
                                            <FormControl
                                                placeholder="Search products..."
                                                aria-label="Search products"
                                                aria-describedby="search-icon"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                className="search-input"
                                            />
                                        </InputGroup>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                {filteredNonFlaggedProducts.length > 0 ? (
                                    filteredNonFlaggedProducts.map(product => (
                                        <Col key={product.id} xs={12} md={6} lg={3} className="mb-4">
                                            <Card>
                                                <Card.Img variant="top" src={product.imageUrl} />
                                                <Card.Body>
                                                    <Card.Title>{product.title}</Card.Title>
                                                    <Card.Text>
                                                        Price: Ksh {product.price}
                                                    </Card.Text>
                                                    <Button variant="warning" id="button" onClick={() => handleViewDetailsClick(product)}>
                                                        View Details
                                                    </Button>
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        className="delete-icon"
                                                        onClick={() => handleFlagProduct(product.id)}
                                                        title="Restore Product"
                                                    />
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <Col>
                                        <p>No non-flagged products found</p>
                                    </Col>
                                )}
                            </Row>

                            <h3 className="mb-4 text-center">Flagged Products</h3>
                            <Row>
                                {flaggedProducts.length > 0 ? (
                                    flaggedProducts.map(product => (
                                        <Col key={product.id} xs={12} md={6} lg={3} className="mb-4">
                                            <Card>
                                                <Card.Img variant="top" src={product.imageUrl} />
                                                <Card.Body>
                                                    <Card.Title>{product.title}</Card.Title>
                                                    <Card.Text>
                                                        Price: Ksh {product.price}
                                                    </Card.Text>
                                                    <Button variant="warning" id="button" onClick={() => handleNotifyClick(product)}>
                                                        Notify Vendor
                                                    </Button>
                                                    <FontAwesomeIcon
                                                        icon={faTrashRestore}
                                                        className="restore-icon"
                                                        onClick={() => handleRestoreProduct(product.id)}
                                                        title="Restore Product"
                                                    />
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <Col>
                                        <p>No flagged products found</p>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Container>

                <Modal show={showDetailsModal} onHide={handleModalClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedProduct?.title || 'Product Details'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedProduct && (
                            <>
                                <Carousel>
                                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                        selectedProduct.images.map((image, index) => (
                                            <Carousel.Item key={index}>
                                                <img
                                                    className="d-block w-100"
                                                    src={image}
                                                    alt={`Slide ${index}`}
                                                />
                                            </Carousel.Item>
                                        ))
                                    ) : (
                                        <Carousel.Item>
                                            <p>No images available</p>
                                        </Carousel.Item>
                                    )}
                                </Carousel>
                                <Row className="mt-3">
                                    <Col md={6}>
                                        <h5>Details</h5>
                                        <p><strong>Price:</strong> Ksh {selectedProduct.price}</p>
                                        <p><strong>Description:</strong> {selectedProduct.description}</p>
                                        <p><strong>Vendor:</strong> {selectedProduct.vendorName}</p>
                                    </Col>
                                    <Col md={6}>
                                        <h5>Reviews</h5>
                                        {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                                            <ul>
                                                {selectedProduct.reviews.map((review, index) => (
                                                    <li key={index}>
                                                        <p><strong>{review.reviewerName}:</strong> {review.comment}</p>
                                                        <p><strong>Rating:</strong> {review.rating} stars</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No reviews yet</p>
                                        )}
                                    </Col>
                                </Row>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showModal} onHide={handleModalClose}>
                    <Modal.Header>
                        <Modal.Title>Notify Vendor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="notificationOptions">
                                <Form.Label>Select reasons for notification:</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="Low-Quality Images"
                                    value="Low-Quality Images"
                                    onChange={handleNotificationOptionChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="Wrong Pricing"
                                    value="Wrong Pricing"
                                    onChange={handleNotificationOptionChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="Insufficient Description"
                                    value="Insufficient Description"
                                    onChange={handleNotificationOptionChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="Other"
                                    value="Other"
                                    onChange={handleNotificationOptionChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="notificationNotes" className="mt-3">
                                <Form.Label>Additional Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="warning" id="button" className="mx-2" onClick={handleModalClose}>
                            Close
                        </Button>
                        <Button variant="primary" id="button" onClick={handleSendNotification}>
                            Send Notification
                        </Button>
                    </Modal.Footer>
                </Modal>
                
            </div>
        </>
    );
};

export default ProductsManagement;
