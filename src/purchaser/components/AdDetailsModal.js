import React from 'react';
import { Modal, Button, Row, Col, Spinner, Carousel } from 'react-bootstrap';
import { Star, StarFill, Cart4, Heart } from 'react-bootstrap-icons';
import './AdDetailsModal.css';  // Your custom styling
import axios from 'axios';  // Assuming you're using axios

const AdDetailsModal = ({ show, onHide, ad, loading, error }) => {
    const [bookmarkLoading, setBookmarkLoading] = React.useState(false);
    const [bookmarkError, setBookmarkError] = React.useState(null);

    const renderRating = (mean_rating) => {
        return Array(5).fill(0).map((_, i) =>
        i < Math.floor(mean_rating) ? <StarFill key={i} className="text-warning" /> : <Star key={i} className="text-warning" />
        );
    };

    const renderCarousel = () => {
        if (!ad.media_urls || ad.media_urls.length === 0) {
        return (
            <img
            src="default-image-url"
            alt="default"
            className="ad-image img-fluid"
            />
        );
        }

        return (
        <Carousel>
            {ad.media_urls.map((url, index) => (
            <Carousel.Item key={index}>
                <img
                className="d-block w-100 ad-image"
                src={url}
                alt={`Slide ${index}`}
                />
            </Carousel.Item>
            ))}
        </Carousel>
        );
    };

    const handleAddToWishlist = async () => {
        if (!ad) return;
    
        try {
            setBookmarkLoading(true);
            setBookmarkError(null);
    
            // Assuming you have a function to get the auth token
            const token = sessionStorage.getItem('token');
    
            // Replace this with your actual API endpoint
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/purchaser/bookmarks`,
                { ad_id: ad.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            // Check if the response is successful
            if (response.status === 201) {
                window.alert('Ad bookmarked successfully!');
            } else {
                window.alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            setBookmarkError('Failed to bookmark the ad. Please try again.');
            window.alert('Failed to bookmark the ad. Please try again.');
        } finally {
            setBookmarkLoading(false);
        }
    };
    
    const handleAddToCart = async (adId) => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/purchaser/cart_items`, {
                method: 'POST',
                headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                "Content-Type": "application/json"
                },
                body: JSON.stringify({ ad_id: adId })
            });
            window.alert("Ad added to cart!");
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
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
            <p>Error loading ad details. Please try again.</p>
            </div>
        );
        }

        if (!ad) {
        return (
            <div className="text-center py-5">
            <p>No ad details available.</p>
            </div>
        );
        }

        return (
        <Row className="ad-modal-content">
            <Col md={6} className="text-center">
            {renderCarousel()}
            </Col>
            <Col md={6}>
            <div className="ad-details">
                <h4>{ad.title}</h4>
                <p><strong>Brand:</strong> {ad.brand}</p>
                <p><strong>Description:</strong> {ad.description}</p>
                <p><strong>Category:</strong> {ad.category_name}</p>
                <p><strong>Subcategory:</strong> {ad.subcategory_name}</p>
                <p><strong>Stock Status:</strong> {ad.quantity}</p>
                {/* {Item Dimensions} */}
                <p><strong>Height:</strong> {ad.item_height}</p>
                <p><strong>Width:</strong> {ad.item_width}</p>
                <p><strong>Length:</strong> {ad.item_length}</p>
                <p><strong>Weight:</strong> {ad.item_weight}</p>
                <div className="ad-rating">
                {renderRating(ad.mean_rating)}
                </div>
                <h4 className="ad-price">
                    Kshs: 
                    <strong>
                        {ad.price ? Number(ad.price).toFixed(2).split('.').map((part, index) => (
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
            </div>
            </Col>
        </Row>
        );
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg" dialogClassName="custom-modal">
        <Modal.Header closeButton className="modal-header-gradient">
            <Modal.Title className="text-center w-100">
            {ad?.title || 'Ad Details'}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-modern">
            {renderContent()}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
            <Button variant="warning" className="w-30 modern-btn" disabled={!ad} id="button" onClick={() => handleAddToCart(ad.id)}>
                <Cart4 className="me-2" /> Add to cart
            </Button>
            {/* <Button variant="primary" id="button" className="w-30 modern-btn-outline" disabled={!ad}>
            <BoxArrowInRight className="me-2" /> Buy Now
            </Button> */}
            <Button
            variant="dark"
            className="w-30 modern-btn-dark"
            disabled={!ad || bookmarkLoading}
            onClick={handleAddToWishlist}
            id="button"
            >
            {bookmarkLoading ? (
                <Spinner animation="border" size="sm" className="me-2" />
            ) : (
                <Heart className="me-2" />
            )}
            Add to Wishlist
            </Button>
        </Modal.Footer>
        {bookmarkError && <div className="text-danger text-center mt-3">{bookmarkError}</div>}
        </Modal>
    );
};

export default AdDetailsModal;
