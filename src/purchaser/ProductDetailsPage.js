import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Row, Col, Card, Carousel, Container, Button, Modal } from 'react-bootstrap';
import { Cart4, Heart } from 'react-bootstrap-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from '@fortawesome/free-solid-svg-icons';
import TopNavbar from './components/TopNavbar';  // Import your TopNavbar component
import Sidebar from './components/Sidebar';      // Import your Sidebar component
import { motion } from 'framer-motion'; // For animations
import axios from 'axios';  // Assuming you're using axios
import './ProductDetailsPage.css';    // Custom styling for the page

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);  // Manage sidebar state
    const [searchQuery, setSearchQuery] = useState('');     // Manage search query state
    const [bookmarkLoading, setBookmarkLoading] = React.useState(false);
    const [bookmarkError, setBookmarkError] = React.useState(null);
    const [showModal, setShowModal] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviewsError, setReviewsError] = useState(null);

    const handleShowModal = async () => {
        setShowModal(true);
        setLoadingReviews(true);
        
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}/reviews`);
            if (!response.ok) throw new Error('Failed to fetch reviews');
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            setReviewsError('Error loading reviews.');
        } finally {
            setLoadingReviews(false);
        }
    };
    
    const handleCloseModal = () => setShowModal(false);


    useEffect(() => {
        if (!productId) {
            setError('Product ID is missing.');
            setLoading(false);
            return;
        }

        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/purchaser/products/${productId}`);
                if (!response.ok) throw new Error('Failed to fetch product details');
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                setError('Error loading product details.');
            } finally {
                setLoading(false);
            }
        };

        const fetchRelatedProducts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/purchaser/products/${productId}/related`);
                if (!response.ok) throw new Error('Failed to fetch related products');
                const data = await response.json();
                setRelatedProducts(data);
            } catch (error) {
                console.error('Error fetching related products:', error);
                setError('Error fetching related products.');
            }
        };

        fetchProductDetails();
        fetchRelatedProducts();
    }, [productId]);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);  // Toggle the sidebar open state
    };

    const handleSearch = () => {
        // Implement search functionality here
        console.log('Search for:', searchQuery);
    };
    const handleAddToWishlist = async () => {
        if (!product) return;
    
        // Check if the token is available
        const token = localStorage.getItem('token');
    
        if (!token) {
            // Token not found, show alert to log in
            window.alert("You need to log in to add items to your wishlist.");
            return; // Exit the function early if no token
        }
    
        try {
            setBookmarkLoading(true);
            setBookmarkError(null);
    
            // API call to add the product to the wishlist
            const response = await axios.post(
                `http://localhost:3000/purchaser/bookmarks`,
                { product_id: product.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            // Check if the response is successful
            if (response.status === 201) {
                window.alert('Product bookmarked successfully!');
            } else {
                window.alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            setBookmarkError('Failed to bookmark the product. Please try again.');
            window.alert('Failed to bookmark the product. Please try again.');
        } finally {
            setBookmarkLoading(false);
        }
    };
    
    
    const handleAddToCart = async (productId) => {
        const token = localStorage.getItem('token');
    
        if (!token) {
        // Token not found, show alert to log in
            window.alert("You need to log in to add items to your cart.");
        return; // Exit function early if no token
        }
    
        try {
        const response = await fetch(`http://localhost:3000/purchaser/cart_items`, {
            method: 'POST',
            headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ product_id: productId })
        });
    
        if (response.ok) {
            window.alert("Product added to cart!");
        } else {
            window.alert("Failed to add product to cart. Please try again.");
        }
        } catch (error) {
            window.alert("An error occurred. Please try again later.");
        }
    };
    
    const renderRatingStars = (rating, reviewCount) => {
        if (typeof rating !== 'number' || rating < 0) {
            console.error('Invalid rating value:', rating);
            return <div className="rating-stars">Invalid rating</div>;
        }
    
        const fullStars = Math.floor(Math.max(0, Math.min(rating, 5)));
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
        return (
            <div className="rating-container">
                <div className="rating-stars">
                    {[...Array(fullStars)].map((_, index) => (
                        <FontAwesomeIcon key={index} icon={faStar} className="rating-star filled" />
                    ))}
                    {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} className="rating-star half-filled" />}
                    {[...Array(emptyStars)].map((_, index) => (
                        <FontAwesomeIcon key={index} icon={faStarEmpty} className="rating-star empty text-white" />
                    ))}
                </div>
                <span style={{ fontSize: '14px' }} className="review-count text-secondary"><em>{rating.toFixed(1)}/5</em>  <em>({reviewCount} Ratings)</em></span>
            </div>
        );
    };
    
    
    

    const renderCarousel = () => {
        if (!product.media_urls || product.media_urls.length === 0) {
        return (
            <img
            src="default-image-url"
            alt="default"
            className="product-image img-fluid"
            />
        );
        }

        return (
        <Carousel>
            {product.media_urls.map((url, index) => (
            <Carousel.Item key={index}>
                <img
                className="d-block h-50 product-image"
                src={url}
                alt={`Slide ${index}`}
                />
            </Carousel.Item>
            ))}
        </Carousel>
        );
    };

    if (loading) {
        return (
        <div className="text-center py-5">
            <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
        );
    }

    if (error) {
        return <div className="text-center py-5 text-danger">{error}</div>;
    }

    return (
        <>
        {/* Top Navbar */}
        <TopNavbar
            onSidebarToggle={handleSidebarToggle}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
        />
        <div className="products-details-page">
            <Container fluid>
                <Row> 
                    <Col xs={12} md={2} className="p-0">
                        <Sidebar isOpen={sidebarOpen} />
                    </Col>
                    <Col xs={12} md={10} className="p-1">
                        {/* Main Content Area */}
                        <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                            <div className="product-details-page container">
                                {product && (
                                    <Row className="product-details mt-1 p-1 shadow-lg rounded border">
                                        <Col 
                                            xs={12} 
                                            md={7} 
                                            className="d-flex flex-column justify-content-center text-center"
                                            >
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                {renderCarousel()}
                                            </motion.div>
                                        </Col>

                                        <Col xs={12} md={4} className="d-flex flex-column justify-content-center">
                                            <h3 className="display-6 text-dark mb-3"><strong>{product.title}</strong></h3>
                                            <p><strong style={{ fontSize: '18px' }} className="text-dark">Brand:</strong> {product.brand}</p>
                                            <p><strong style={{ fontSize: '18px' }} className="text-dark">Manufacturer:</strong> {product.manufacturer}</p>
                                            <p><strong style={{ fontSize: '18px' }} className="text-dark">Category:</strong> {product.category_name}</p>
                                            <p><strong style={{ fontSize: '18px' }} className="text-dark">Subcategory:</strong> {product.subcategory_name}</p>
                                            <Row 
                                                onClick={handleShowModal} 
                                                style={{ cursor: 'pointer' }} 
                                                className="link-hover"
                                                >
                                                <span className="star-rating">
                                                    {renderRatingStars(product.mean_rating, product.review_count)}
                                                </span>
                                            </Row>


                                            <h4 className="product-price my-4">
                                                <span className="text-success">Kshs: </span>
                                                <strong className="text-danger display-6">
                                                    {product.price ? Number(product.price).toFixed(2).split('.').map((part, index) => (
                                                        <React.Fragment key={index}>
                                                            {index === 0 ? (
                                                                <span className="price-integer">{parseInt(part, 10).toLocaleString()}</span>
                                                            ) : (
                                                                <>
                                                                    <span style={{ fontSize: '16px' }}>.</span>
                                                                    <span className="price-decimal">{part}</span>
                                                                </>
                                                            )}
                                                        </React.Fragment>
                                                    )) : 'N/A'}
                                                </strong>
                                            </h4>

                                            <Card className="mt-4 border-0 shadow custom-card">
                                                <Card.Header className="bg-black text-warning justify-content-start">Dimensions</Card.Header>
                                                <Card.Body>
                                                    <Row>
                                                        <Col xs={12} md={6}>
                                                            <p><strong>Height:</strong> {product.item_height} cm</p>
                                                            <p><strong>Width:</strong> {product.item_width} cm</p>
                                                        </Col>
                                                        <Col xs={12} md={6}>
                                                            <p><strong>Length:</strong> {product.item_length} cm</p>
                                                            <p>
                                                                <strong>Weight:</strong> {product.item_weight} {product.weight_unit}
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>


                                            <Container className="mt-4 d-flex justify-content-center">
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Button 
                                                        variant="warning" 
                                                        className="modern-btn me-3 px-4 py-2"
                                                        id="button" 
                                                        disabled={!product} 
                                                        onClick={() => handleAddToCart(product.id)}
                                                    >
                                                        <Cart4 className="me-2" /> Add to cart
                                                    </Button>
                                                </motion.div>

                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Button
                                                        variant="dark"
                                                        className="modern-btn-dark px-4 py-2"
                                                        id="button"
                                                        disabled={!product || bookmarkLoading}
                                                        onClick={handleAddToWishlist}
                                                    >
                                                        {bookmarkLoading ? (
                                                            <Spinner animation="border" size="sm" className="me-2" />
                                                        ) : (
                                                            <Heart className="me-2" />
                                                        )}
                                                        Add to Wishlist
                                                    </Button>
                                                </motion.div>
                                            </Container>
                                            <Container className="mt-4">
                                                <Row>
                                                    <h3>Description</h3>
                                                    <p style={{ fontSize: '17px' }} className="lead text-secondary text-dark">{product.description}</p>
                                                </Row>
                                            </Container>

                                            {bookmarkError && <div className="text-danger text-center mt-3">{bookmarkError}</div>}
                                        </Col>
                                    </Row>
                                )}

                                <h3 className="related-products-title">Related Products</h3>
                                    <Row className="related-products">
                                        {relatedProducts.slice(0, 4).map((relatedProduct) => (
                                        <Col key={relatedProduct.id} md={3} className="mb-4">
                                            <Card onClick={() => window.location.href = `/products/${relatedProduct.id}`}>
                                            <Card.Img variant="top" src={relatedProduct.media_urls[0] || 'default-image-url'} />
                                            <Card.Body>
                                                <Card.Title>{relatedProduct.title}</Card.Title>
                                                <Card.Text>
                                                    <span className="text-success">Kshs: </span>
                                                    <strong style={{ fontSize: '20px' }} className="text-danger">
                                                        {relatedProduct.price ? Number(relatedProduct.price).toFixed(2).split('.').map((part, index) => (
                                                            <React.Fragment key={index}>
                                                                {index === 0 ? (
                                                                    <span className="price-integer">{parseInt(part, 10).toLocaleString()}</span>
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
                                            </Card.Body>
                                            </Card>
                                        </Col>
                                        ))}
                                    </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header >
                    <Modal.Title>Product Ratings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loadingReviews ? (
                    <div className="text-center">
                        <Spinner animation="border" />
                        <p>Loading reviews...</p>
                    </div>
                    ) : reviewsError ? (
                    <div className="text-danger">{reviewsError}</div>
                    ) : reviews.length === 0 ? (
                    <p>No reviews available for this product.</p>
                    ) : (
                    <div>
                        {reviews.map((review, index) => {
                        // Determine full stars, half stars, and empty stars based on the review rating
                        const fullStars = Math.floor(review.rating);
                        const halfStar = review.rating % 1 !== 0;
                        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

                        return (
                            <Card key={index} className="my-3 custom-card">
                            <Card.Body>
                                <Card.Title>{review.purchaser.name}</Card.Title>
                                <Card.Text>{review.review}</Card.Text>
                                <div className="rating-stars d-flex align-items-center">
                                {[...Array(fullStars)].map((_, i) => (
                                    <FontAwesomeIcon key={i} icon={faStar} className="rating-star filled" />
                                ))}
                                {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} className="rating-star half-filled" />}
                                {[...Array(emptyStars)].map((_, i) => (
                                    <FontAwesomeIcon key={i} icon={faStarEmpty} className="rating-star empty text-white" />
                                ))}
                                </div>
                            </Card.Body>
                            </Card>
                        );
                        })}
                    </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseModal}>
                    Close
                    </Button>
                </Modal.Footer>
            </Modal> 
        </div>
        </>
    );
};

export default ProductDetailsPage;
