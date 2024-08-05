import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, InputGroup, FormControl, Modal, Form, Carousel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTrashRestore, faStar } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import './ProductsManagement.css';

const ProductsManagement = () => {
    const [flaggedProducts, setFlaggedProducts] = useState([]);
    const [nonFlaggedProducts, setNonFlaggedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNotifyVendorModal, setShowNotifyVendorModal] = useState(false);
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
        setShowNotifyVendorModal(true);
    };

    const handleViewDetailsClick = async (product) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/products/${product.id}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }

            const data = await response.json();
            setSelectedProduct(data);
            setShowDetailsModal(true);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    const handleModalClose = () => {
        setShowNotifyVendorModal(false);
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
            console.error('Error restoring product:', error);
        }
    };

    const filteredNonFlaggedProducts = nonFlaggedProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderRatingStars = (rating) => {
        // Adjust the rating to be between 0 and 5
        const roundedRating = Math.min(5, Math.max(0, Math.round(rating)));
    
        // Create an array of star states (filled or empty)
        const stars = Array(5).fill(false).map((_, index) => index < roundedRating);
    
        return (
            <div className="rating-stars">
                {stars.map((filled, index) => (
                    <FontAwesomeIcon
                        key={index}
                        icon={filled ? faStar : faStar} // use filled or empty star
                        className={`rating-star ${filled ? 'filled' : ''}`}
                    />
                ))}
            </div>
        );
    };
    
    

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
                                                    <Card.Text className="price-container">
                                                        <strong>Kshs: </strong>
                                                        {product.price.split('.').map((part, index) => (
                                                            <React.Fragment key={index}>
                                                                {index === 0 ? part : (
                                                                    <>
                                                                        <span style={{ fontSize: '16px' }}>.</span>
                                                                        <span className="price-decimal">{part}</span>
                                                                    </>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </Card.Text>
                                                    <Button variant="warning" id="button" onClick={() => handleViewDetailsClick(product)}>
                                                        View Details
                                                    </Button>
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        className="delete-icon"
                                                        onClick={() => handleFlagProduct(product.id)}
                                                        title="Flag Product"
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
                                                    <Card.Text className="price-container">
                                                        <strong>Kshs: </strong>
                                                            {product.price.split('.').map((part, index) => (
                                                            <React.Fragment key={index}>
                                                                {index === 0 ? part : (
                                                                    <>
                                                                        <span style={{ fontSize: '16px' }}>.</span>
                                                                        <span className="price-decimal">{part}</span>
                                                                    </>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
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
                <Modal.Header>
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
                                        <p className="text-center">No images available</p>
                                    </Carousel.Item>
                                )}
                            </Carousel>
                            <div className="product-details mb-4 text-center">
                                <div className="product-detail-item">
                                    <strong>Price:</strong> 
                                    <p>
                                        Kshs
                                        {selectedProduct.price.split('.').map((part, index) => (
                                            <React.Fragment key={index}>
                                                {index === 0 ? part : (
                                                    <>
                                                        <span style={{ fontSize: '16px' }}>.</span>
                                                        <span className="price-decimal">{part}</span>
                                                    </>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </p>
                                </div>
                                <div className="product-detail-item">
                                    <strong>Vendor:</strong> 
                                    <p>{selectedProduct.vendor?.fullname || 'Unknown'}</p>
                                </div>
                                <div className="product-detail-item">
                                    <strong>Category:</strong> 
                                    <p>{selectedProduct.category?.name || 'N/A'}</p>
                                </div>
                                <div className="product-detail-item">
                                    <strong>Sold Out:</strong> 
                                    <p>{selectedProduct.sold_out ? 'Yes' : 'No'}</p>
                                </div>
                                <div className="product-detail-item">
                                    <strong>Quantity Sold:</strong> 
                                    <p>{selectedProduct.quantity_sold || 0}</p>
                                </div>
                                <div className="product-detail-item">
                                        <strong>Rating:</strong> 
                                        <p>
                                            <span className="star-rating">
                                                {renderRatingStars(selectedProduct.mean_rating)}
                                            </span>
                                            <p>{selectedProduct.mean_rating}</p>
                                        </p>
                                </div>
                            </div>
                            <div className="product-detail-item text-center">
                                <strong>Description:</strong> 
                                <p>{selectedProduct.description}</p>
                            </div>
                            <h5 className="text-center">Reviews</h5>
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
                                <p className="text-center">No reviews yet</p>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" id="button" onClick={handleModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


                <Modal show={showNotifyVendorModal} onHide={handleModalClose}>
                    <Modal.Header >
                        <Modal.Title>Notify Vendor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="notificationOptions">
                                <Form.Label>Select Notification Reasons:</Form.Label>
                                <div>
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
                                    {/* Add more options here if needed */}
                                </div>
                            </Form.Group>
                            <Form.Group controlId="notes">
                                <Form.Label>Notes:</Form.Label>
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
                        <Button variant="warning" id="button" className='mx-2' onClick={handleModalClose}>
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
