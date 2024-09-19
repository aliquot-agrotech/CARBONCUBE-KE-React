import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Row, Col, Card, Carousel, Container, Button } from 'react-bootstrap';
import { Cart4, Heart } from 'react-bootstrap-icons';
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
    
        try {
            setBookmarkLoading(true);
            setBookmarkError(null);
    
            // Assuming you have a function to get the auth token
            const token = localStorage.getItem('token');
    
            // Replace this with your actual API endpoint
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
        try {
          await fetch(`http://localhost:3000/purchaser/cart_items`, {
            method: 'POST',
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ product_id: productId })
          });
          window.alert("Product added to cart!");
        } catch (error) {
          console.error("Error adding to cart:", error);
        }
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
                    <Col xs={12} md={10} className="p-2">
                        {/* Main Content Area */}
                        <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                            <div className="product-details-page container">
                                {product && (
                                    <Row className="product-details mt-1 p-4 shadow-lg rounded border">
                                        <Col xs={12} md={6} className="text-center">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                {renderCarousel()}
                                            </motion.div>
                                        </Col>
                                        <Col xs={12} md={4} className="d-flex flex-column justify-content-center">
                                            <h3 className="display-6 text-dark mb-3">{product.title}</h3>
                                            <p style={{ fontSize: '17px' }} className="lead text-muted text-dark">{product.description}</p>
                                            <p><strong style={{ fontSize: '18px' }} className="text-secondary">Brand:</strong> {product.brand}</p>
                                            <p><strong style={{ fontSize: '18px' }} className="text-secondary">Category:</strong> {product.category_name}</p>
                                            <p><strong style={{ fontSize: '18px' }} className="text-secondary">Subcategory:</strong> {product.subcategory_name}</p>
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

                                            <Card className="mt-4 border-0 shadow">
                                                <Card.Header className="bg-black text-warning justify-content-start">Dimensions</Card.Header>
                                                <Card.Body>
                                                    <Row>
                                                        <Col xs={12} md={6}>
                                                            <p><strong>Height:</strong> {product.item_height}</p>
                                                            <p><strong>Width:</strong> {product.item_width}</p>
                                                        </Col>
                                                        <Col xs={12} md={6}>
                                                            <p><strong>Length:</strong> {product.item_length}</p>
                                                            <p><strong>Weight:</strong> {product.item_weight}</p>
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

                                            {bookmarkError && <div className="text-danger text-center mt-3">{bookmarkError}</div>}
                                        </Col>
                                    </Row>
                                )}

                                <h3 className="related-products-title">Related Products</h3>
                                    <Row className="related-products">
                                        {relatedProducts.map((relatedProduct) => (
                                        <Col key={relatedProduct.id} md={3} className="mb-4">
                                            <Card onClick={() => window.location.href = `/products/${relatedProduct.id}`}>
                                            <Card.Img variant="top" src={relatedProduct.media_urls[0] || 'default-image-url'} />
                                            <Card.Body>
                                                <Card.Title>{relatedProduct.title}</Card.Title>
                                                <Card.Text>Kshs: {Number(relatedProduct.price).toFixed(2)}</Card.Text>
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
        </div>
        
        
        </>
    );
};

export default ProductDetailsPage;
