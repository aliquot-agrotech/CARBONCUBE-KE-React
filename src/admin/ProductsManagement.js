import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, InputGroup, FormControl, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import './ProductsManagement.css';

const ProductsManagement = () => {
    const [products, setProducts] = useState([]);
    const [softDeletedProducts, setSoftDeletedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [notificationOptions, setNotificationOptions] = useState([]);
    const [notes, setNotes] = useState('');

    useEffect(() => {
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
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError(`Error fetching products: ${error.message}`);
            }
        };

        const fetchSoftDeletedProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/products/soft_deleted', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });

                if (!response.ok) {
                    throw new Error(`Network response was not ok. Status: ${response.status}`);
                }

                const data = await response.json();
                setSoftDeletedProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching soft-deleted products:', error);
                setError(`Error fetching soft-deleted products: ${error.message}`);
                setLoading(false);
            }
        };

        fetchProducts();
        fetchSoftDeletedProducts(); // Ensure this is called
    }, []); // Dependencies array is empty to only run on mount

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
            // Refresh the soft-deleted products list after sending notification
            await fetchSoftDeletedProducts();
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    const handleNotificationOptionChange = (e) => {
        const { value, checked } = e.target;
        setNotificationOptions(prevOptions =>
            checked ? [...prevOptions, value] : prevOptions.filter(option => option !== value)
        );
    };

    const handleDeleteProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }

            setSoftDeletedProducts(prevProducts =>
                prevProducts.filter(product => product.id !== id)
            );
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const fetchSoftDeletedProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/admin/products/soft_deleted', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });
    
            if (!response.ok) {
                // Log the full response for debugging
                const errorDetails = await response.text();
                throw new Error(`Network response was not ok. Status: ${response.status}, Details: ${errorDetails}`);
            }
    
            const data = await response.json();
            setSoftDeletedProducts(data);
        } catch (error) {
            console.error('Error fetching soft-deleted products:', error);
            setError(`Error fetching soft-deleted products: ${error.message}`);
        }
    };
    

    const filteredProducts = products.filter(product =>
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
                        <Col xs={12} md={10} className="p-4">
                            <h2 className="mb-4 text-center">Products Management</h2>
                            <Row className="justify-content-center">
                                <Col xs={9} md={6} lg={4} className="mb-3">
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
                                            <InputGroup.Text id="search-icon">
                                                <FontAwesomeIcon icon={faSearch} />
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map(product => (
                                        <Col key={product.id} xs={12} md={6} lg={3} className="mb-4">
                                            <Card>
                                                <Card.Img variant="top" src={product.imageUrl} />
                                                <Card.Body>
                                                    <Card.Title>{product.title}</Card.Title>
                                                    <Card.Text>
                                                        Price: Ksh {product.price}
                                                    </Card.Text>
                                                    <Button variant="primary">View Details</Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <Col>
                                        <p>No products found</p>
                                    </Col>
                                )}
                            </Row>

                            <h3 className="mb-4">Soft-Deleted Products</h3>
                            <Row>
                                {softDeletedProducts.length > 0 ? (
                                    softDeletedProducts.map(product => (
                                        <Col key={product.id} xs={12} md={6} lg={3} className="mb-4">
                                            <Card>
                                                <Card.Img variant="top" src={product.imageUrl} />
                                                <Card.Body>
                                                    <Card.Title>{product.title}</Card.Title>
                                                    <Card.Text>
                                                        Price: Ksh {product.price}
                                                    </Card.Text>
                                                    <Button variant="primary" onClick={() => handleNotifyClick(product)}>
                                                        Notify Vendor
                                                    </Button>
                                                </Card.Body>
                                                <Card.Footer className="text-muted">
                                                    <Button variant="link" className="text-danger" onClick={() => handleDeleteProduct(product.id)}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </Button>
                                                </Card.Footer>
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <Col>
                                        <p>No soft-deleted products found</p>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Container>

                {/* Notification Modal */}
                <Modal show={showModal} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Notify Vendor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="notificationOptions">
                                <Form.Label>Select Notification Reasons</Form.Label>
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
                                {/* Add more options if needed */}
                                <Form.Check
                                    type="checkbox"
                                    label="Missing Tags"
                                    value="Missing Tags"
                                    onChange={handleNotificationOptionChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="Expired Inventory"
                                    value="Expired Inventory"
                                    onChange={handleNotificationOptionChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="notes">
                                <Form.Label>Notes</Form.Label>
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
                        <Button variant="secondary" onClick={handleModalClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSendNotification}>
                            Send Notification
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default ProductsManagement;
