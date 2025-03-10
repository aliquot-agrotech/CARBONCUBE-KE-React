import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {  Row, Col, Card, Carousel, Container, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from '@fortawesome/free-solid-svg-icons';
import TopNavbar from '../components/TopNavbar';  // Import your TopNavbar component
import Sidebar from '../components/Sidebar';      // Import your Sidebar component
import { motion } from 'framer-motion'; // For animations
import Spinner from "react-spinkit";
import AlertModal from '../components/AlertModal';
import axios from 'axios';  // Assuming you're using axios
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/AdDetails.css';    // Custom styling for the page

const AdDetails = () => {
    const { adId } = useParams();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedAds, setRelatedAds] = useState([]);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);  // Manage sidebar state
    const [searchQuery, setSearchQuery] = useState('');     // Manage search query state
    const [wish_listLoading, setBookmarkLoading] = React.useState(false);
    const [wish_listError, setBookmarkError] = React.useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertModal, setAlertModal] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviewsError, setReviewsError] = useState(null);
    const [vendor, setVendor] = useState(null);
    const [showVendorDetails, setShowVendorDetails] = useState(false); // State to toggle visibility
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate


    const handleShowModal = async () => {
        setShowModal(true);
        setLoadingReviews(true);
        
        try {
            const response = await fetch(`http://127.0.0.1:3001/ads/${adId}/reviews`);
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

    const handleShowReviewModal = () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setShowAlertModal(true);
            setAlertModal("You must be Signed In to post a review.");
            return;
        }
        setShowReviewModal(true);
    };
    
    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        setReviewText('');
        setRating(0);
        setSubmitError(null);
    };
    
    const handleRatingClick = (selectedRating) => {
        setRating(selectedRating);
    };

    
    useEffect(() => {
        if (!adId) {
            setError('Ad ID is missing.');
            setLoading(false);
            return;
        }

        // Fetch Ad Details
        const fetchAdDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3001/purchaser/ads/${adId}`);
                if (!response.ok) throw new Error('Failed to fetch ad details');
                const data = await response.json();
                setAd(data);
            } catch (error) {
                setError('Error loading ad details.');
            } finally {
                setLoading(false);
            }
        };

        // Fetch Related Ads
        const fetchRelatedAds = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3001/purchaser/ads/${adId}/related`);
                if (!response.ok) throw new Error('Failed to fetch related ads');
                const data = await response.json();
                setRelatedAds(data);
            } catch (error) {
                setError('Error fetching related ads.');
            }
        };

        // Fetch all data
        fetchAdDetails();
        fetchRelatedAds();
    }, [adId]);

    const handleCloseAlertModal = () => {
        setShowAlertModal(false); // Close the modal
    };

    const fetchVendorDetails = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token'); // Retrieve the token
    
            if (!token) {
                throw new Error('You must be logged in to view vendor details.');
            }
    
            const response = await fetch(`http://127.0.0.1:3001/purchaser/ads/${adId}/vendor`, {
                signal: AbortSignal.timeout(10000), // 10-second timeout
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token in the headers
                },
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Fetch error:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText,
                });
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
    
            const data = await response.json();
            setVendor(data);
        } catch (error) {
            console.error('Detailed error:', {
                message: error.message,
                name: error.name,
                stack: error.stack,
            });
    
            if (error.message.includes('logged in')) {
                alert(error.message); // Notify the user they need to log in
            }
    
            setError(`Failed to fetch vendor details: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setSubmitError('You must be signed in to submit a review.');
            return;
        }
    
        if (rating === 0) {
            setSubmitError('Please select a rating.');
            return;
        }
    
        if (!reviewText.trim()) {
            setSubmitError('Please enter a review.');
            return;
        }
    
        setIsSubmitting(true);
        setSubmitError(null);
    
        try {
            const response = await fetch(`http://127.0.0.1:3001/purchaser/ads/${adId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    review: {
                        rating: rating,
                        review: reviewText
                    }
                })
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit review');
            }
    
            // Close review modal first
            handleCloseReviewModal();
    
            // Show success alert after a slight delay to ensure smooth transition
            setTimeout(() => {
                setShowAlertModal(true);
                setAlertModal('Review submitted successfully!');
            }, 300);
    
            // Optional: Trigger a refresh of reviews here if needed
            // fetchReviews();
        } catch (error) {
            setSubmitError('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
        
    
    const handleRevealVendorDetails = async () => {
        console.log('Button clicked, adId:', adId);
    
        const token = sessionStorage.getItem('token');
        if (!token) {
            setShowAlertModal(true); // Inform the user
            setAlertModal("You must be Signed In to view vendor details.");
            return; // Exit the function early
        }
    
        // Log the button click event
        await logClickEventRevealVendorDetails(adId, 'Reveal-Vendor-Details');
    
        // Fetch vendor details if not already fetched
        if (!vendor) {
            await fetchVendorDetails();
        }
    
        // Show vendor details
        setShowVendorDetails(true);
    };
    
    // Function to log button click events
    const logClickEventRevealVendorDetails = async (adId, eventType) => {
        try {
            const token = sessionStorage.getItem('token'); // Retrieve the token
    
            if (!token) {
                console.warn('Cannot log event without a valid session.');
                return;
            }
    
            const response = await fetch('http://127.0.0.1:3001/click_events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include token in the headers
                },
                body: JSON.stringify({
                    ad_id: adId,
                    event_type: eventType,
                    metadata: {}, // Optional metadata
                }),
            });
    
            if (!response.ok) {
                console.warn('Failed to log event:', eventType);
            }
        } catch (error) {
            console.error('Error logging event:', eventType, error);
        }
    };

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);  // Toggle the sidebar open state
    };

    const handleSearch = () => {
        // Implement search functionality here
        // console.log('Search for:', searchQuery);
    };

    const handleAddToWishlist = async () => {
        if (!ad) return;
    
        // Check if the token is available
        const token = sessionStorage.getItem('token');
    
        if (!token) {
            // Token not found, show the AlertModal
            setShowAlertModal(true);
            setAlertModal("You need to Signed In to add items to your wishlist.");
            return; // Exit the function early if no token
        }
    
        try {
            setBookmarkLoading(true);
            setBookmarkError(null);
    
            // Step 1: Log the 'Add-to-Wishlist' event
            await logClickEventAddtoWishList(ad.id, 'Add-to-Wish-List');
    
            // Step 2: API call to add the ad to the wishlist
            const response = await axios.post(
                `http://127.0.0.1:3001/purchaser/wish_lists`,
                { ad_id: ad.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            // Check if the response is successful
            if (response.status === 201) {
                setShowAlertModal(true);
                setAlertModal('Ad successfully added to the Wish List');
            } else {
                setShowAlertModal(true);
                setAlertModal('Something went wrong. Please try again.');
            }
        } catch (error) {
            setBookmarkError('Failed to add ad to the wishlist. Please try again.');
            setShowAlertModal(true);
            setAlertModal('Failed to add ad to the wishlist. Please try again.');
        } finally {
            setBookmarkLoading(false);
        }
    };
    
    
    // Function to log button click events
    const logClickEventAddtoWishList = async (adId, eventType) => {
        try {
            const response = await fetch('http://127.0.0.1:3001/click_events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify({
                    ad_id: adId,
                    event_type: eventType, // 'Add-to-Wishlist'
                }),
            });
    
            if (!response.ok) {
                console.warn('Failed to log event:', eventType);
            }
        } catch (error) {
            console.error('Error logging event:', eventType, error);
        }
    };    

    const renderRatingStars = (rating, reviewCount) => {
        if (typeof rating !== 'number' || rating < 0) {
            // console.error('Invalid rating value:', rating);
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

    const handleAdClick = async (adId) => {
        if (!adId) {
            console.error('Invalid adId');
            return;
        }
    
        try {
            // Log the 'Ad-Click' event before navigating
            await logClickEvent(adId, 'Ad-Click');
    
            // Navigate to the ad details page
            navigate(`/ads/${adId}`);
        } catch (error) {
            console.error('Error logging ad click:', error);
    
            // Proceed with navigation even if logging fails
            navigate(`/ads/${adId}`);
        }
    };

    // Function to log a click event
    const logClickEvent = async (adId, eventType) => {
        try {
            const response = await fetch('http://127.0.0.1:3001/click_events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify({
                    ad_id: adId,
                    event_type: eventType, // e.g., 'Ad-Click'
                }),
            });
    
            if (!response.ok) {
                console.warn('Failed to log click event');
            }
        } catch (error) {
            console.error('Error logging click event:', error);
        }
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
                className="d-block h-50 ad-image"
                src={url}
                alt={`Slide ${index}`}
                />
            </Carousel.Item>
            ))}
        </Carousel>
        );
    };

    const getBorderColor = (tierId) => {
        const tierColors = {
            2: '#FF5733',  // Basic (Red-Orange)
            3: '#28A745',  // Standard (Bright Green)
            4: '#FFC107',  // Premium (Gold-like yellow)
        };
        return tierColors[tierId] || 'transparent'; // No border color for Free tier
    };

    if (loading) {
        return (
            <div className="centered-loader">
                <Spinner variant="warning" name="cube-grid" style={{ width: 100, height: 100 }} />
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
            <div className="ads-details-page">
                <Container fluid>
                    <Row> 
                        <Col xs={12} md={2} className="p-0">
                            <Sidebar isOpen={sidebarOpen} />
                        </Col>
                        <Col xs={12} md={10} lg={9} className="p-0 p-lg-1">
                            {/* Main Content Area */}
                            <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                                <div className="ad-details-page container">
                                    {ad && (
                                        <Row className="ad-details mt-1 p-1 shadow-lg rounded border">
                                            <Col xs={12} md={7} className="d-flex flex-column justify-content-center text-center">
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    {renderCarousel()}
                                                </motion.div>
                                            </Col>

                                            <Col xs={12} md={4} className="d-flex flex-column justify-content-center p-0 ">
                                                <h3 className="display-6 text-dark mb-0 px-2"><strong>{ad.title}</strong></h3>
                                                <div className="p-2">
                                                    <p><strong style={{ fontSize: '18px' }} className="text-dark">Brand:</strong> {ad.brand}</p>
                                                    <p><strong style={{ fontSize: '18px' }} className="text-dark">Manufacturer:</strong> {ad.manufacturer}</p>
                                                    <p><strong style={{ fontSize: '18px' }} className="text-dark">Category:</strong> {ad.category_name}</p>
                                                    <p><strong style={{ fontSize: '18px' }} className="text-dark">Subcategory:</strong> {ad.subcategory_name}</p>
                                                </div>
                                                <Row 
                                                    onClick={handleShowModal} 
                                                    style={{ cursor: 'pointer' }} 
                                                    className="link-hover px-2"
                                                    >
                                                    <span className="star-rating">
                                                        {renderRatingStars(ad.mean_rating, ad.review_count)}
                                                    </span>
                                                </Row>

                                                <h4 className="ad-price my-1 px-2">
                                                    <span className="text-success" style={{ fontSize: '15px' }}> <em>Kshs: </em></span>
                                                    <strong className="text-danger display-6">
                                                        {ad.price ? Number(ad.price).toFixed(2).split('.').map((part, index) => (
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

                                                <Card className="mt-2 border-0 shadow custom-card">
                                                    <Card.Header className="bg-black text-warning justify-content-start">Dimensions</Card.Header>
                                                    <Card.Body>
                                                        <Row>
                                                            <Col xs={6} md={6} lg={6}>
                                                                <p><strong>Height:</strong> {ad.item_height} cm</p>
                                                                <p><strong>Width:</strong> {ad.item_width} cm</p>
                                                            </Col>
                                                            <Col xs={6} md={6} lg={6}>
                                                                <p><strong>Length:</strong> {ad.item_length} cm</p>
                                                                <p>
                                                                    <strong>Weight:</strong> {ad.item_weight} {ad.weight_unit}
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>

                                                <Container className="mt-3 justify-content-center">
                                                    <Row>
                                                        <Col xs={6} md={12} lg={6} className="d-flex justify-content-center">
                                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                <Button
                                                                    variant="outline-dark"
                                                                    className="modern-btn-dark px-4 py-2"
                                                                    id="button"
                                                                    onClick={(e) => {
                                                                        e.preventDefault(); // Prevent page reload
                                                                        handleRevealVendorDetails();
                                                                    }}
                                                                >
                                                                    {/* Display loading spinner inside the button when fetching */}
                                                                    {loading ? (
                                                                        <Spinner animation="border" size="sm" className="me-2" />
                                                                    ) : showVendorDetails && vendor ? (
                                                                        // Display vendor name and phone number inside the button after it's revealed
                                                                        <span>
                                                                            {vendor.enterprise_name} | {vendor.phone_number}
                                                                        </span>
                                                                    ) : (
                                                                        '📞 Contact Vendor' // Default text before clicking
                                                                    )}
                                                                </Button>
                                                            </motion.div>
                                                        </Col>

                                                        <Col xs={6} md={12} lg={6} className="d-flex justify-content-center">
                                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                <Button
                                                                    variant="outline-dark"
                                                                    className="modern-btn-dark px-4 py-2 rounded-pill"
                                                                    onClick={handleShowReviewModal}
                                                                >
                                                                    💬 Leave a Review
                                                                </Button>
                                                            </motion.div>
                                                        </Col>
                                                    </Row>

                                                    <div>
                                                        <Row className="mt-2">
                                                            <Col md={12} className="d-flex justify-content-center">
                                                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                    <Button
                                                                        variant="outline-dark"
                                                                        className="modern-btn-dark px-4 py-2"
                                                                        id="button"
                                                                        disabled={!ad || wish_listLoading}
                                                                        onClick={handleAddToWishlist} // Trigger handleAddToWishlist
                                                                    >
                                                                        🖤 Add to Wish List
                                                                    </Button>
                                                                </motion.div>
                                                            </Col>
                                                        </Row>

                                                        {/* Render the Login Modal */}
                                                        <AlertModal 
                                                            isVisible={showAlertModal} 
                                                            message={alertModal} 
                                                            onClose={handleCloseAlertModal} 
                                                            loading={false} 
                                                        />
                                                    </div>
                                                </Container>

                                                <Container className="mt-2">
                                                    <Row>
                                                        <h3>Description</h3>
                                                        <p style={{ fontSize: '17px' }} className="lead text-secondary text-dark">{ad.description}</p>
                                                    </Row>
                                                </Container>

                                                {wish_listError && <div className="text-danger text-center mt-3">{wish_listError}</div>}
                                            </Col>
                                        </Row>
                                    )}

                                    <h3 className="related-ads-title">Related Ads</h3>
                                    <Row className="related-ads">
                                        {relatedAds.slice(0, 4).map((relatedAd) => {
                                            const borderColor = getBorderColor(relatedAd.vendor_tier); // Get the border color based on the tier

                                            return (
                                                <Col key={relatedAd.id} xs={6} md={3} className="mb-4 px-1">
                                                    <Card 
                                                        onClick={() => handleAdClick(relatedAd.id)} 
                                                        style={{ border: `2px solid ${borderColor}` }}
                                                    >
                                                        <div style={{ position: 'relative' }}>
                                                            {/* Tier Label */}
                                                            <div
                                                                className="tier-label text-dark"
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '0px',
                                                                    left: '0px',
                                                                    padding: '0px 5px',
                                                                    fontSize: '12px',
                                                                    backgroundColor: borderColor, // Match background color to the tier's border color
                                                                    borderRadius: '4px',
                                                                    zIndex: 20,
                                                                }}
                                                            >
                                                                {relatedAd.tier_name}
                                                            </div>

                                                            {/* Ad Image */}
                                                            <Card.Img
                                                                className="ad-image"
                                                                variant="top"
                                                                src={relatedAd.media_urls[0] || 'default-image-url'}
                                                                alt={relatedAd.title}
                                                            />
                                                        </div>
                                                        <Card.Body className="px-2 py-1">
                                                            <Card.Title className="mb-0 mb-lg-1 ad-title">{relatedAd.title}</Card.Title>
                                                            <Card.Text>
                                                                <span className="text-success" style={{ fontSize: '15px' }}>
                                                                    <em>Kshs: </em>
                                                                </span>
                                                                <strong style={{ fontSize: '20px' }} className="text-danger">
                                                                    {relatedAd.price
                                                                        ? Number(relatedAd.price)
                                                                            .toFixed(2)
                                                                            .split('.')
                                                                            .map((part, index) => (
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
                                                                            ))
                                                                        : 'N/A'}
                                                                </strong>
                                                            </Card.Text>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <Modal centered show={showModal} onHide={handleCloseModal}>
                    <Modal.Header className="justify-content-center p-1 p-lg-2">
                        <Modal.Title>Ad Ratings</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="px-1 px-lg-2 py-0">
                        {loadingReviews ? (
                        <div className="text-center">
                            <Spinner animation="border" />
                            <p>Loading reviews...</p>
                        </div>
                        ) : reviewsError ? (
                        <div className="text-danger">{reviewsError}</div>
                        ) : reviews.length === 0 ? (
                        <p>No reviews available for this ad.</p>
                        ) : (
                        <div>
                            {reviews.map((review, index) => {
                            // Determine full stars, half stars, and empty stars based on the review rating
                            const fullStars = Math.floor(review.rating);
                            const halfStar = review.rating % 1 !== 0;
                            const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

                            return (
                                <Card key={index} className="my-2 my-lg-3 custom-card">
                                <Card.Body className="py-2">
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
                    <Modal.Footer className="p-0 p-lg-1">
                        <Button variant="danger" onClick={handleCloseModal}>
                        Close
                        </Button>
                    </Modal.Footer>
                </Modal> 

                {/* Add this JSX right after your existing Modal component in the return statement */}
                <Modal centered show={showReviewModal} onHide={handleCloseReviewModal} className="futuristic-modal">
                    <Modal.Header className="border-0 text-center p-1 p-lg-2">
                        <Modal.Title className="modal-title">Write a Review</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-2">
                            <label className="form-label">Rating:</label>
                            <div className="rating-selector">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FontAwesomeIcon
                                        key={star}
                                        icon={star <= rating ? faStar : faStarEmpty}
                                        style={{ cursor: 'pointer', fontSize: '24px', marginRight: '8px' }}
                                        className={`rating-star ${star <= rating ? 'filled' : 'empty'}`}
                                        onClick={() => handleRatingClick(star)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Review:</label>
                            <textarea
                                className="form-control review-input"
                                rows="5"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Write your review here..."
                            />
                        </div>
                        {submitError && (
                            <div className="alert alert-danger error-alert">
                                {submitError}
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="border-0 d-flex justify-content-between p-0 p-lg-1">
                        <Button variant="danger" className="btn-modern cancel-btn" onClick={handleCloseReviewModal}>
                            Cancel
                        </Button>
                        <Button 
                            variant="outline-warning" 
                            className="btn-modern submit-btn" 
                            onClick={handleSubmitReview}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default AdDetails;