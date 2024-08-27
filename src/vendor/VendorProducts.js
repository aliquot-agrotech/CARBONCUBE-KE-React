import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Modal, Carousel, FormControl, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faStar, faStarHalfAlt, faStar as faStarEmpty, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';

const VendorProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const vendorId = localStorage.getItem('vendorId');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/vendor/products?vendor_id=${vendorId}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error fetching products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [vendorId]);

    const handleAddNewProduct = () => {
        // Implement logic to add a new product
        console.log('Add new product clicked');
    };

    const handleViewDetailsClick = (product) => {
        setSelectedProduct(product);
        setShowDetailsModal(true);
    };

    const handleEditProduct = (productId) => {
        // Set selected product for editing and show edit modal
        const product = products.find(p => p.id === productId);
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    const handleDeleteProduct = (productId) => {
        // Implement logic to delete product
        console.log('Delete product clicked for product ID:', productId);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleModalClose = () => {
        setShowDetailsModal(false);
        setShowEditModal(false);
    };

    const handleSaveEdit = () => {
        // Implement save logic
        console.log('Save changes clicked');
        setShowEditModal(false);
    };

    const renderProductCard = (product) => (
        <Col xs={12} md={6} lg={3} key={product.id} className="mb-4">
            <Card>
                <Card.Img variant="top" src={product.imageUrl} />
                <Card.Body>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text className="price-container">
                        <em className='product-price-label'>Kshs: </em>
                        <strong>
                            {product.price ? product.price.split('.').map((part, index) => (
                                <React.Fragment key={index}>
                                    {index === 0 ? (
                                        <span className="price-integer">
                                            {parseInt(part, 10).toLocaleString()}
                                        </span>
                                    ) : (
                                        <>
                                            <span style={{ fontSize: '16px' }}>.</span>
                                            <span className="price-decimal">{part}</span>
                                        </>
                                    )}
                                </React.Fragment>
                            )) : 'N/A'}
                        </strong>
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1">
                            <Button
                                variant="warning"
                                id="button"
                                onClick={() => handleViewDetailsClick(product)}
                            >
                                View Details
                            </Button>
                        </div>
                        <div className="d-flex ml-2">
                            <Button
                                variant="secondary"
                                className="me-2"
                                onClick={() => handleEditProduct(product.id)}
                            >
                                <FontAwesomeIcon
                                    icon={faPencilAlt}
                                    className="edit-icon"
                                    title="Edit Product"
                                />
                            </Button>
                            <Button
                                variant="danger"
                                className="d-flex justify-content-center align-items-center"
                                onClick={() => handleDeleteProduct(product.id)}
                            >
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="edit-icon"
                                    variant="danger"
                                    title="Delete Product"
                                />
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
    

    const renderRatingStars = (rating) => {
        if (typeof rating !== 'number' || rating < 0) {
            console.error('Invalid rating value:', rating);
            return <div className="rating-stars">Invalid rating</div>;
        }
    
        const fullStars = Math.floor(Math.max(0, Math.min(rating, 5)));
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
        return (
            <div className="rating-stars">
                {[...Array(fullStars)].map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} className="rating-star filled" />
                ))}
                {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} className="rating-star half-filled" />}
                {[...Array(emptyStars)].map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStarEmpty} className="rating-star empty" />
                ))}
            </div>
        );
    };

    const StarRating = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
        return (
            <span className="star-rating">
                {[...Array(fullStars)].map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} className="star filled" />
                ))}
                {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} className="star half-filled" />}
                {[...Array(emptyStars)].map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStarEmpty} className="star empty" />
                ))}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="centered-loader">
                <Spinner animation="border" variant="warning" style={{ width: 100, height: 100 }} />
            </div>
        );
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
                        <Col xs={12} md={10} className="p-2">
                            <Row className="justify-content-center d-flex">
                                <Col xs={12} md={8} lg={6} className="mb-3 pt-3">
                                    <div className="search-container d-flex align-items-center">
                                        <FormControl
                                            placeholder="Search products..."
                                            aria-label="Search products"
                                            aria-describedby="search-icon"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            className="search-input"
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map(renderProductCard)
                                ) : (
                                    <Col>
                                        <p>No products found</p>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Container>

                {/* Product Details Modal */}
                <Modal show={showDetailsModal} onHide={handleModalClose} size="lg">
                    <Modal.Header className='justify-content-center'>
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
                                <Container className="product-details mb-4">
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Price</Card.Header>
                                                <Card.Body className="text-center">
                                                    <em className='product-price-label'>Kshs: </em>
                                                    <strong>
                                                        {selectedProduct.price?.split('.').map((part, index) => (
                                                            <React.Fragment key={index}>
                                                                {index === 0 ? (
                                                                    <span className="price-integer">
                                                                        {parseInt(part, 10).toLocaleString()}
                                                                    </span>
                                                                ) : (
                                                                    <>
                                                                        <span style={{ fontSize: '16px' }}>.</span>
                                                                        <span className="price-decimal">{part}</span>
                                                                    </>
                                                                )}
                                                            </React.Fragment>
                                                        )) || 'N/A'}
                                                    </strong>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Category</Card.Header>
                                                <Card.Body className="text-center">
                                                    {selectedProduct.category?.name || 'N/A'}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12} md={6}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Quantity Sold</Card.Header>
                                                <Card.Body className="text-center">
                                                    {selectedProduct.quantity_sold || 0}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Sold Out</Card.Header>
                                                <Card.Body className="text-center">
                                                    {selectedProduct.sold_out ? 'Yes' : 'No'}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Description</Card.Header>
                                                <Card.Body className="text-center">
                                                    {selectedProduct.description}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Rating</Card.Header>
                                                <Card.Body className="text-center">
                                                    <span className="star-rating">
                                                        {renderRatingStars(selectedProduct.mean_rating || 0)}
                                                    </span>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Container>
                                <h5 className="text-center" id="reviews">Reviews</h5>
                                {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                                    <div className="reviews-container text-center">
                                        {selectedProduct.reviews.map((review, index) => (
                                            <div className="review-card" key={index}>
                                                <p className="review-comment"><em>"{review.review}"</em></p>
                                                <StarRating rating={review.rating} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center">No reviews yet</p>
                                )}
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Edit Product Modal */}
                <Modal show={showEditModal} onHide={handleModalClose} size="lg">
                    <Modal.Header className='justify-content-center'>
                        <Modal.Title>{selectedProduct ? `Edit ${selectedProduct.title}` : 'Edit Product'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            {/* Add form fields for editing product */}
                            {/* Example: */}
                            <Form.Group controlId="formProductTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" placeholder="Enter product title" defaultValue={selectedProduct?.title} />
                            </Form.Group>
                            {/* Add other fields as needed */}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveEdit}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default VendorProducts;
