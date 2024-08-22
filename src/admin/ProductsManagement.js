import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, FormControl, Modal, Form, Carousel, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTrashRestore, faStar, faStarHalfAlt, faStar as faStarEmpty, faFilter } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import Spinner from "react-spinkit";
import './ProductsManagement.css';

const ProductsManagement = () => {
    const [flaggedProducts, setFlaggedProducts] = useState([]);
    const [nonFlaggedProducts, setNonFlaggedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSubcategory, setSelectedSubcategory] = useState('All');
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

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:3000/admin/categories', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });
    
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
    
            const data = await response.json();
            // Assuming subcategories are included with categories in the response
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
      
    
    

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setSelectedSubcategory('All');
    };

    const handleSubcategorySelect = (subcategoryId) => {
        setSelectedSubcategory(subcategoryId);
    };
    

    const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);

    const filteredNonFlaggedProducts = nonFlaggedProducts
    .filter(product => selectedCategory === 'All' || product.category_id === selectedCategory)
    .filter(product => selectedSubcategory === 'All' || product.subcategory_id === selectedSubcategory)
    .filter(product => {
        const titleMatches = searchTerms.every(term => product.title.toLowerCase().includes(term));
        const descriptionMatches = searchTerms.every(term => product.description.toLowerCase().includes(term));
        return titleMatches || descriptionMatches;
    })
    .sort((a, b) => a.price - b.price); // Sort by price in ascending order


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
                                        
                                        <Dropdown className="dropdown-filter me-2">
                                            <Dropdown.Toggle
                                                variant="secondary"
                                                id="button"
                                                className={`filter-toggle ${selectedCategory === 'All' && selectedSubcategory === 'All' ? 'filter-icon' : 'active-category'}`}
                                            >
                                                {selectedCategory === 'All' && selectedSubcategory === 'All' ? (
                                                    <FontAwesomeIcon icon={faFilter} />
                                                ) : (
                                                    <>
                                                        {categories.find(c => c.id === selectedCategory)?.name || 'Select Category'}
                                                        {selectedSubcategory !== 'All' && (
                                                            ` > ${categories
                                                                .find(c => c.id === selectedCategory)
                                                                ?.subcategories.find(sc => sc.id === selectedSubcategory)?.name}`
                                                        )}
                                                    </>
                                                )}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="dropdown-menu">
                                                <Dropdown.Item id="button" onClick={() => handleCategorySelect('All')}>
                                                <FontAwesomeIcon icon={faFilter} /> All Categories
                                                </Dropdown.Item>
                                                {categories.map(category => (
                                                <Dropdown.Item key={category.id} id="button" onClick={() => { handleCategorySelect(category.id); setSelectedSubcategory('All'); }}>
                                                    {category.name}
                                                    {category.subcategories.length > 0 && (
                                                        <div className="dropdown-submenu">
                                                            {category.subcategories.map(subcategory => (
                                                                <Dropdown.Item 
                                                                    key={subcategory.id}
                                                                    id="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleSubcategorySelect(subcategory.id);
                                                                    }}
                                                                >
                                                                    * {subcategory.name}
                                                                </Dropdown.Item>
                                                            ))}
                                                        </div>
                                                    )}
                                                </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <FormControl
                                            placeholder="Search products..."
                                            aria-label="Search products"
                                            aria-describedby="search-icon"
                                            id="button"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            className="search-input"
                                        />
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
                                                        <em className='product-price-label'>Kshs: </em>
                                                        <strong>
                                                            {product.price ? product.price.split('.').map((part, index) => (
                                                                <React.Fragment key={index}>
                                                                    {index === 0 ? (
                                                                        <span className="price-integer">
                                                                            {parseInt(part, 10).toLocaleString()} {/* Add commas to the integer part */}
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

                            <Row>
                                <h3 className="mb-4 text-center">Flagged Products</h3>
                                {flaggedProducts.length > 0 ? (
                                    flaggedProducts.map(product => (
                                        <Col key={product.id} xs={12} md={6} lg={3} className="mb-4">
                                            <Card>
                                                <Card.Img variant="top" src={product.imageUrl} />
                                                <Card.Body>
                                                    <Card.Title>{product.title}</Card.Title>
                                                    <Card.Text className="price-container">
                                                        <em className='product-price-label'>Kshs: </em>
                                                        <strong>
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
                                                        </strong>
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
                                                        {selectedProduct.price.split('.').map((part, index) => (
                                                            <React.Fragment key={index}>
                                                                {index === 0 ? (
                                                                    <span className="price-integer">
                                                                        {parseInt(part, 10).toLocaleString()} {/* Add commas to the integer part */}
                                                                    </span>
                                                                ) : (
                                                                    <>
                                                                        <span style={{ fontSize: '16px' }}>.</span>
                                                                        <span className="price-decimal">{part}</span>
                                                                    </>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </strong>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Vendor</Card.Header>
                                                <Card.Body className="text-center">
                                                    {selectedProduct.vendor?.fullname || 'Unknown'}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12} md={6}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Category</Card.Header>
                                                <Card.Body className="text-center">
                                                    {selectedProduct.category?.name || 'N/A'}
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
                                                <Card.Header as="h6" className="justify-content-center">Rating</Card.Header>
                                                <Card.Body className="text-center">
                                                    <span className="star-rating">
                                                        {renderRatingStars(selectedProduct.mean_rating)}
                                                    </span>
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
                                </Container>
                                <h5 className="text-center" id="reviews">Reviews</h5>
                                    {selectedProduct && selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                                    <div className="reviews-container text-center">
                                        {selectedProduct.reviews.map((review, index) => (
                                            <div className="review-card" key={index}>
                                                <p className="review-comment"><em>"{review.review}"</em></p>
                                                <StarRating rating={review.rating} />
                                                <p className="reviewer-name"><strong>{review.purchaser.fullname}</strong></p>
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
                        <Button variant="danger" id="button" onClick={handleModalClose}>
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
                        <Button variant="danger" id="button" className='mx-2' onClick={handleModalClose}>
                            Close
                        </Button>
                        <Button variant="warning" id="button" onClick={handleSendNotification}>
                            Send Notification
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default ProductsManagement;
