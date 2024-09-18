import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Row, Col, Card, Carousel, Container } from 'react-bootstrap';
import TopNavbar from './components/TopNavbar';  // Import your TopNavbar component
import Sidebar from './components/Sidebar';      // Import your Sidebar component
import './ProductDetailsPage.css';    // Custom styling for the page

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);  // Manage sidebar state
    const [searchQuery, setSearchQuery] = useState('');     // Manage search query state

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
                                    <Row className="product-details">
                                        <Col xs={12} md={6} className="text-center">
                                        {renderCarousel()}
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <h2>{product.title}</h2>
                                            <p>{product.description}</p>
                                            <Row><h4><strong>Brand:</strong></h4> <p>{product.brand}</p></Row>
                                           
                                            <p><strong>Category:</strong> {product.category_name}</p>
                                            <p><strong>Subcategory:</strong> {product.subcategory_name}</p>
                                            <h4 className="product-price">
                                                Kshs: 
                                                <strong>
                                                    {product.price ? Number(product.price).toFixed(2).split('.').map((part, index) => (
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
                                            </h4>
                                            {/* Add more product details as necessary */}
                                        
                                            <Card className="mt-4">
                                                <Card.Header>Dimensions</Card.Header>
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
