import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Row, Col, Card } from 'react-bootstrap';
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

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Main Content Area */}
        <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <div className="product-details-page container">
            {product && (
                <Row className="product-details">
                <Col md={6} className="text-center">
                    <img src={product.image_url || 'default-image-url'} alt={product.title} className="product-image img-fluid" />
                </Col>
                <Col md={6}>
                    <h1>{product.title}</h1>
                    <p>{product.description}</p>
                    <h4>Kshs: {Number(product.price).toFixed(2)}</h4>
                    {/* Add more product details as necessary */}
                </Col>
                </Row>
            )}

            <h3 className="related-products-title">Related Products</h3>
            <Row className="related-products">
                {relatedProducts.map((relatedProduct) => (
                <Col key={relatedProduct.id} md={4} className="mb-4">
                    <Card onClick={() => window.location.href = `/products/${relatedProduct.id}`}>
                    <Card.Img variant="top" src={relatedProduct.image_url || 'default-image-url'} />
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
        </>
    );
};

export default ProductDetailsPage;
