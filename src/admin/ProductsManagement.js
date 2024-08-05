import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, InputGroup, FormControl, Modal, Form } from 'react-bootstrap';
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

            // Debug: Log entire response and data to check its structure
            console.log('Fetched products:', data);

            // Extract flagged and non-flagged products from the response
            const { flagged, non_flagged } = data;

            // Debug: Log flagged and non-flagged products
            console.log('Flagged products:', flagged);
            console.log('Non-flagged products:', non_flagged);

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

    const handleModalClose = () => {
        setShowModal(false);
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
                            {/* <h2 className="mb-4 text-center">Products Management</h2> */}
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
                            {/* <h3 className="mb-4">Non-Flagged Products</h3> */}
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
                                                    <Button variant="warning" id="button">View Details</Button>
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
                                                        title="Flag Product"
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
                        <Button variant="warning" id="button" onClick={handleModalClose}>
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
