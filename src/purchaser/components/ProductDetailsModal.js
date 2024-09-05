    import React from 'react';
    import { Modal, Button, Row, Col, Spinner, Carousel } from 'react-bootstrap';
    import { Star, StarFill, Cart4, Heart, BoxArrowInRight } from 'react-bootstrap-icons';
    import './ProductDetailsModal.css';  // Your custom styling

    const ProductDetailsModal = ({ show, onHide, product, loading, error }) => {
    const renderRating = (rating) => {
        return Array(5).fill(0).map((_, i) => 
        i < Math.floor(rating) ? <StarFill key={i} className="text-warning" /> : <Star key={i} className="text-warning" />
        );
    };

    const formatPrice = (price) => {
        if (typeof price === 'number') {
        return price.toFixed(2);
        } else if (typeof price === 'string') {
        return parseFloat(price).toFixed(2);
        }
        return 'N/A';
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
                className="d-block w-100 product-image"
                src={url}
                alt={`Slide ${index}`}
                />
            </Carousel.Item>
            ))}
        </Carousel>
        );
    };

    const renderContent = () => {
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
        return (
            <div className="text-center py-5 text-danger">
            <p>Error loading product details. Please try again.</p>
            </div>
        );
        }

        if (!product) {
        return (
            <div className="text-center py-5">
            <p>No product details available.</p>
            </div>
        );
        }

        return (
        <Row className="product-modal-content">
            <Col md={5} className="text-center">
            {renderCarousel()}
            </Col>
            <Col md={7}>
            <div className="product-details">
                <h5>{product.title}</h5>
                <p><strong>Brand:</strong> {product.brand}</p>
                <p><strong>Stock Status:</strong> {product.quantity}</p>
                <p><strong>SKU:</strong> {product.sku}</p>
                <p><strong>Colors:</strong> {product.colors}</p>
                <p><strong>Add-ons:</strong> {product.addOns}</p>
                <div className="product-rating">
                {renderRating(product.rating)}
                </div>
                <h4 className="product-price">Kshs: {formatPrice(product.price)}</h4>
            </div>
            </Col>
        </Row>
        );
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg" dialogClassName="custom-modal">
        <Modal.Header closeButton className="modal-header-gradient">
            <Modal.Title className="text-center w-100">
            {product?.title || 'Product Details'}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-modern">
            {renderContent()}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
            <Button variant="warning" className="w-30 modern-btn" disabled={!product} id="button">
            <Cart4 className="me-2" /> Add to cart
            </Button>
            <Button variant="outline-primary" id="button" className="w-30 modern-btn-outline" disabled={!product}>
            <BoxArrowInRight className="me-2" /> Buy Now
            </Button>
            <Button variant="dark" className="w-30 modern-btn-dark" disabled={!product} id="button">
            <Heart className="me-2" /> Add to Wishlist
            </Button>
        </Modal.Footer>
        </Modal>
    );
    };

    export default ProductDetailsModal;
