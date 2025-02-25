import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Carousel, FormControl, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faStar, faStarHalfAlt, faStar as faStarEmpty, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/Sidebar';
import Spinner from "react-spinkit";
import TopNavbar from '../components/TopNavbar';
import { Cloudinary } from 'cloudinary-core';
import { Filter } from "content-checker";
import '../css/VendorAds.css'; 

const VendorAds = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAd, setSelectedAd] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    // const [newImageUrl, setNewImageUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [weightUnit, setWeightUnit] = useState('Grams');
    // const [selectedImages, setSelectedImages] = useState([]);
    // const [files, setFiles] = useState([]);
    const [editedAd, setEditedAd] = useState({
        item_length: '',
        item_width: '',
        item_height: '',
        item_weight: '',
        weight_unit: 'Grams', // Default weight unit
        media: []  // Assuming 'images' holds the URLs of the ad images
    });

    const [formValues, setFormValues] = useState({
        title: '',
        description: '',
        price: '',
        quantity: '',
        brand: '',
        manufacturer: '',
        item_length: '',
        item_width: '',
        item_height: '',
        weight_unit: '',
        item_weight: ''
    });

    const cloudinary = new Cloudinary({ cloud_name: 'dyyu5fwcz', secure: true });

    const vendorId = sessionStorage.getItem('vendorId');

    // Initialize the filter
    const filter = new Filter();

    const removeImage = (index) => {
        setEditedAd(prev => ({
            ...prev,
            media: prev.media.filter((_, i) => i !== index)
        }));
    };

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/vendor/ads?vendor_id=${vendorId}`, {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setAds(data);
            } catch (error) {
                console.error('Error fetching ads:', error);
                setError('Error fetching ads');
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, [vendorId]);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://carboncube-ke-rails-cu22.onrender.com/vendor/categories');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
    
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            const fetchSubcategories = async () => {
                try {
                    const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/vendor/subcategories?category_id=${selectedCategory}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setSubcategories(data);
    
                    // Set the selected subcategory to the one stored in the ad data
                    setSelectedSubcategory(editedAd.subcategory_id);
                } catch (error) {
                    console.error('Error fetching subcategories:', error);
                }
            };
    
            fetchSubcategories();
        }
    }, [selectedCategory, editedAd.subcategory_id]);  // Dependency on both selectedCategory and editedAd.subcategory_id
    

    const handleCategoryChange = (event) => {
        const category_id = event.target.value;
        setSelectedCategory(category_id);
        setSelectedSubcategory(''); // Reset subcategory when a new category is selected
        setEditedAd(prevState => ({
            ...prevState,
            category_id,  // Use category_id to match the server expectation
            subcategory_id: '' // Clear subcategory_id
        }));
    };

    const handleSubcategoryChange = (event) => {
        const subcategory_id = event.target.value;
        setSelectedSubcategory(subcategory_id);
        setEditedAd(prevState => ({
            ...prevState,
            subcategory_id // Update subcategory_id
        }));
    };

    const handleWeightUnitChange = (unit) => {
        setEditedAd((prev) => ({
            ...prev,
            weight_unit: unit,
        }));
    };
    
    
    const handleFormChange = (e) => {
        const { id, value } = e.target;
        setFormValues(prevValues => ({ ...prevValues, [id]: value }));
    };

    // Function to convert file to base64 for moderation
    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Function to check if an image is safe
    const checkImageBeforeUpload = async (file) => {
        if (!file) return { safe: false, reason: "No file provided" };

        try {
            const base64 = await convertFileToBase64(file);
            const moderationResult = filter.scan(base64); // Use scan() instead of moderateImage()

            if (moderationResult.safe) {
                console.log(`Image "${file.name}" is safe.`);
                return { safe: true };
            } else {
                console.warn(`Image "${file.name}" rejected: ${moderationResult.reason}`);
                return { safe: false, reason: moderationResult.reason };
            }
        } catch (error) {
            console.error("Error moderating image:", error);
            return { safe: false, reason: "Error in moderation" };
        }
    };

    const handleImageUpload = async (files) => {
        const formData = new FormData();
        formData.append('file', files);
        formData.append('upload_preset', 'carbonecom'); // Ensure this is set up in Cloudinary
    
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/image/upload/`, {
            method: 'POST',
            body: formData,
        });
    
        if (response.ok) {
            const data = await response.json();
            return data.secure_url; // The URL of the uploaded image
        } else {
            throw new Error('Failed to upload image');
        }
    };
    

    const handleAddNewAd = async () => {
        const { title, description, price, quantity, brand, manufacturer, item_length, item_width, item_height, item_weight } = formValues;
    
        if (!title || !description || !selectedCategory || !selectedSubcategory || !price || !quantity || !brand || !manufacturer || !item_length || !item_width || !item_height || !item_weight) {
            alert('Please fill in all required fields.');
            return;
        }
    
        const fileInput = document.querySelector('.custom-upload-btn input[type="file"]');
        let mediaUrls = [];
    
        if (fileInput && fileInput.files.length > 0) {
            for (let i = 0; i < fileInput.files.length; i++) {
                const mediaUrl = await handleImageUpload(fileInput.files[i]);
                mediaUrls.push(mediaUrl);
            }
        }
    
        // Assuming you have a state variable for weight unit, e.g. `weightUnit`
        const newAd = {
            title,
            description,
            category_id: selectedCategory,
            subcategory_id: selectedSubcategory,
            price: parseInt(price),
            quantity: parseInt(quantity),
            brand,
            manufacturer,
            item_length: parseInt(item_length),
            item_width: parseInt(item_width),
            item_height: parseInt(item_height),
            item_weight: parseInt(item_weight),
            weight_unit: weightUnit, // Include the weight unit in the ad object
            media: mediaUrls // Store all the uploaded image URLs
        };
    
        try {
            const response = await fetch('https://carboncube-ke-rails-cu22.onrender.com/vendor/ads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify(newAd),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const result = await response.json();
            console.log('Ad added successfully:', result);
    
            // Update the ads state to include the new ad
            setAds(prevAds => [...prevAds, result]);
    
            // Optionally clear form fields
            setFormValues({
                title: '',
                description: '',
                price: '',
                quantity: '',
                brand: '',
                manufacturer: '',
                item_length: '',
                item_width: '',
                item_height: '',
                item_weight: ''
            });
            setSelectedCategory('');
            setSelectedSubcategory('');
            setWeightUnit('Grams'); // Reset to default if needed
            setShowAddModal(false);
        } catch (error) {
            console.error('Error adding ad:', error);
            alert('Failed to add ad. Please try again.');
        }
    };
    

    const handleViewDetailsClick = (ad) => {
        setSelectedAd(ad);
        setShowDetailsModal(true);
    };

    const handleEditAd = (adId) => {
        const ad = ads.find(p => p.id === adId);
        setSelectedAd(ad);
        setEditedAd({ ...ad });
        
        // Set selected category and subcategory from the ad data
        setSelectedCategory(ad.category_id);
        setSelectedSubcategory(ad.subcategory_id);
        setShowEditModal(true);
    };
    

    const handleDeleteAd = async (adId) => {
        console.log('Delete ad clicked for ad ID:', adId);
        
        const confirmed = window.confirm("Are you sure you want to delete this ad?");
        if (!confirmed) return; // Exit if the user cancels the deletion
        
        try {
            const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/vendor/ads/${adId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete the ad.');
            }
    
            // If the ad was successfully deleted, remove it from the local state
            setAds(prevAds => prevAds.filter(ad => ad.id !== adId));
    
            console.log('Ad deleted successfully');
        } catch (error) {
            console.error('Error deleting ad:', error);
            alert('There was an error deleting the ad. Please try again.');
        }
    };
    

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredAds = ads.filter(ad =>
        ad.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleModalClose = () => {
        setShowDetailsModal(false);
        setShowEditModal(false);
        setShowAddModal(false);
    };

    const handleSaveEdit = async () => {
        setIsSaving(true);
        try {
        const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/vendor/ads/${editedAd.id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
            body: JSON.stringify({ ad: {
            title: editedAd.title,
            description: editedAd.description,
            category_id: editedAd.category_id, // Ensure it's category_id
            subcategory_id: editedAd.subcategory_id, // Ensure it's subcategory_id
            price: editedAd.price,
            quantity: editedAd.quantity,
            brand: editedAd.brand,
            manufacturer: editedAd.manufacturer,
            item_length: editedAd.item_length,
            item_width: editedAd.item_width,
            item_height: editedAd.item_height,
            item_weight: editedAd.item_weight,
            weight_unit: editedAd.weight_unit,
            flagged: editedAd.flagged,
            media: editedAd.media // Only include media if applicable
            } }),
        });
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    
        const updatedAd = await response.json();
        setAds(ads.map(p => p.id === updatedAd.id ? updatedAd : p));
        setShowEditModal(false);
        } catch (error) {
        console.error('Error saving changes:', error);
        } finally {
        setIsSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedAd(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Function to handle adding multiple images
    const handleAddImages = async (files) => {
        if (!files || files.length === 0) return;

        const uploadedUrls = [];

        for (const file of files) {
            const { safe, reason } = await checkImageBeforeUpload(file);

            if (!safe) {
                console.warn(`Skipping upload for "${file.name}" due to: ${reason}`);
                continue; // Skip this image and move to the next
            }

            try {
                const imageUrl = await handleImageUpload(file);
                uploadedUrls.push(imageUrl);
            } catch (error) {
                console.error(`Failed to upload "${file.name}":`, error);
            }
        }

        if (uploadedUrls.length > 0) {
            try {
                const updatedMedia = [...editedAd.media, ...uploadedUrls];

                // Update the ad's media array on the server
                const response = await fetch(
                    `https://carboncube-ke-rails-cu22.onrender.com/vendor/ads/${editedAd.id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + sessionStorage.getItem("token"),
                        },
                        body: JSON.stringify({ ad: { media: updatedMedia } }),
                    }
                );

                if (!response.ok) throw new Error("Failed to update ad");

                const updatedAd = await response.json();

                // Update local state
                setEditedAd(updatedAd);
                setAds((prevAds) => prevAds.map((p) => (p.id === updatedAd.id ? updatedAd : p)));

                console.log("Images added successfully");
            } catch (error) {
                console.error("Error updating ad with new images:", error);
            }
        } else {
            console.warn("No safe images were uploaded.");
        }
    };

    const handleFileSelect = async (files) => {
        if (files.length > 0) {
            try {
                const fileArray = Array.from(files);
    
                // Check if any file exceeds the 1MB limit
                for (const file of fileArray) {
                    console.log(`File name: ${file.name}, size: ${file.size} bytes`);
                    if (file.size >= 1024 * 1024) { // Includes files exactly 1MB
                        alert('File size exceeds the 1MB limit. Please select a smaller image.');
                        return; // Stop further processing if a file is too large
                    }
                }
    
                const uploadPromises = fileArray.map(file => handleImageUpload(file));
    
                // Upload all images
                const imageUrls = await Promise.all(uploadPromises);
    
                // Add the image URLs to the media array
                const updatedMedia = [...editedAd.media, ...imageUrls];
                setEditedAd(prev => ({
                    ...prev,
                    media: updatedMedia,
                }));
    
                console.log('Images uploaded and added successfully');
            } catch (error) {
                console.error('Error uploading images:', error);
            }
        }
    };

    const handleDeleteImage = async (index) => {
        try {
            // Filter out the image at the specific index
            const updatedMedia = editedAd.media.filter((_, i) => i !== index);

            // Send a PATCH request to update the ad's media array in the database
            const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/vendor/ads/${editedAd.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify({ ad: { media: updatedMedia } }),
            });

            if (!response.ok) {
                throw new Error('Failed to update ad');
            }

            const updatedAd = await response.json();

            // Update the ad in the local state
            setEditedAd(updatedAd);
            setAds(prevAds => 
                prevAds.map(p => p.id === updatedAd.id ? updatedAd : p)
            );

            console.log('Image deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const renderAdCard = (ad) => (
        <Col xs={6} md={6} lg={3} key={ad.id} className="mb-3 px-2 px-md-2">
            <Card>
                <Card.Img variant="top" className="ad-image" src={ad.media && ad.media.length > 0 ? ad.media[0] : 'default-image-url'}/> 
                <Card.Body className="px-2 py-1 py-md-2 bookmark-body">
                    <Card.Title className="mb-0 ad-title">{ad.title}</Card.Title>
                    <Card.Text>
                        <span className="text-success" style={{ fontSize: '15px' }}>Kshs: </span>
                        <strong style={{ fontSize: '20px' }} className="text-danger">
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
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1">
                            <Button
                                variant="warning"
                                id="button"
                                onClick={() => handleViewDetailsClick(ad)}
                            >
                                Details
                            </Button>
                        </div>
                        <div className="d-flex ml-2">
                            <Button
                                variant="secondary"
                                className="me-2"
                                id="button"
                                onClick={() => handleEditAd(ad.id)}
                            >
                                <FontAwesomeIcon
                                    icon={faPencilAlt}
                                    className="edit-icon"
                                    title="Edit Ad"
                                />
                            </Button>
                            <Button
                                variant="danger"
                                className="d-flex justify-content-center align-items-center"
                                id="button"
                                onClick={() => handleDeleteAd(ad.id)}
                            >
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="edit-icon"
                                    title="Delete Ad"
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
            <div className="ads-management-page">
                <Container fluid className="p-0">
                    <Row>
                        <Col xs={12} md={2} className="p-0">
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={9} lg={9} className="p-2">
                            <Row className="justify-content-center d-flex align-items-center">
                                <Col xs={7} md={8} lg={6} className="mb-1 mb-md-3 pt-2 pt-md-3 justify-content-end">
                                    <div className="search-container d-flex align-items-center">
                                        <FormControl
                                            placeholder="Search ads..."
                                            aria-label="Search ads"
                                            aria-describedby="search-icon"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            className="search-input text-center"
                                        />
                                    </div>
                                </Col>
                                <Col xs={5} md={4} lg={3} className="mb-1 mb-md-3 pt-2 pt-md-3 d-flex justify-content-start">
                                    <Button id="button" variant="warning" onClick={() => setShowAddModal(true)}>
                                        Add New Ad
                                    </Button>
                                </Col>
                            </Row>

                            <Row>
                                {filteredAds.length > 0 ? (
                                    filteredAds.map(renderAdCard)
                                ) : (
                                    <Col>
                                        <p>No ads found</p>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Container>

{/* ============================================================ START PRODUCT DETAILS MODAL ==================================================================================*/}

                <Modal centered show={showDetailsModal} onHide={handleModalClose} size="xl">
                    <Modal.Header className='justify-content-center p-1 p-lg-2'>
                        <Modal.Title>{selectedAd?.title || 'Ad Details'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-0 p-lg-2">
                        {selectedAd && (
                            <>
                                <Carousel className='mb-4'>
                                    {selectedAd.media && selectedAd.media.length > 0 ? (
                                        selectedAd.media.map((image, index) => (
                                            <Carousel.Item key={index} className="position-relative">
                                                <img
                                                    className="d-block w-100 ad-image"
                                                    src={image}
                                                    alt={`Ad ${selectedAd.title} - view ${index + 1}`} // Updated alt text
                                                    style={{ height: '300px', objectFit: 'contain' }}  // Adjust the height as needed
                                                />
                                            </Carousel.Item>
                                        ))
                                    ) : (
                                        <Carousel.Item>
                                            <p className="text-center">No images available</p>
                                        </Carousel.Item>
                                    )}
                                </Carousel>
                                <Container className="ad-details mb-4 p-1 p-lg-2">
                                    <Row>
                                        <Col xs={6} md={6}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Price</Card.Header>
                                                <Card.Body className="text-center">
                                                    <em className='ad-price-label'>Kshs: </em>
                                                    <strong className="text-success">
                                                        {selectedAd.price ? (
                                                            (() => {
                                                                const formattedPrice = parseFloat(selectedAd.price).toFixed(2);
                                                                const [integerPart, decimalPart] = formattedPrice.split('.');
                                                                return (
                                                                    <>
                                                                        <span className="price-integer">
                                                                            {parseInt(integerPart, 10).toLocaleString()}
                                                                        </span>
                                                                        <span style={{ fontSize: '16px' }}>.</span>
                                                                        <span className="price-decimal">{decimalPart}</span>
                                                                    </>
                                                                );
                                                            })()
                                                        ) : (
                                                            'N/A'
                                                        )}
                                                    </strong>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs={6} md={6}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Category</Card.Header>
                                                <Card.Body className="text-center">
                                                    {selectedAd.category?.name || 'N/A'}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={6} md={6}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Quantity Sold</Card.Header>
                                                <Card.Body className="text-center">
                                                    {selectedAd.quantity_sold || 0}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs={6} md={6}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Sold Out</Card.Header>
                                                <Card.Body className="text-center">
                                                    {selectedAd.sold_out ? 'Yes' : 'No'}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                    

                                    <Row>
                                        <Col xs={12}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Description</Card.Header>
                                                <Card.Body className="text-center">
                                                    {selectedAd.description}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12} md={6}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Rating</Card.Header>
                                                <Card.Body className="text-center">
                                                    <span className="star-rating">
                                                        {renderRatingStars(selectedAd.mean_rating || 0)}
                                                    </span>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Dimensions</Card.Header>
                                                <Card.Body className="text-center">
                                                    <Row>
                                                    <Col xs={6} md={6}>
                                                            <p><strong>Height:</strong> {selectedAd.item_height} cm</p>
                                                            <p><strong>Width:</strong> {selectedAd.item_width} cm</p>
                                                        </Col>
                                                        <Col xs={6} md={6}>
                                                            <p><strong>Length:</strong> {selectedAd.item_length} cm</p>
                                                            <p><strong>Weight:</strong> {selectedAd.item_weight} {selectedAd.weight_unit}</p>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        
                                    </Row>
                                </Container>
                                <h5 className="text-center" id="reviews">Reviews</h5>
                                {selectedAd.reviews && selectedAd.reviews.length > 0 ? (
                                    <div className="reviews-container text-center p-1 p-lg-2">
                                        {selectedAd.reviews.map((review, index) => (
                                            <div className="custom-card p-2" key={index}>
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
                    <Modal.Footer className=" p-0 p-lg-1">
                        <Button variant="danger" onClick={handleModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

{/* ============================================================ START EDIT PRODUCT MODAL ==================================================================================*/}

                <Modal centered show={showEditModal} onHide={handleModalClose} size="xl">
                    <Modal.Header className='justify-content-center p-1 p-lg-2'>
                        <Modal.Title>{selectedAd ? `Edit ${selectedAd.title}` : 'Edit Ad'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-1 p-lg-2">
                        <Form>

                            <Form.Group className="mb-3">
                                {editedAd.media && editedAd.media.length > 0 ? (
                                    <Carousel>
                                    {editedAd.media.map((image, index) => (
                                        <Carousel.Item key={index} className="position-relative">
                                            <img
                                                className="d-block w-100"
                                                src={image}
                                                alt={`Ad - view ${index + 1}`}
                                                style={{ height: '300px', objectFit: 'contain' }}
                                            />
                                            <Button 
                                                variant="danger"
                                                className="delete-button"
                                                onClick={() => handleDeleteImage(index)}  // Pass the index to delete the correct image
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                        </Carousel.Item>
                                    ))}
                                    </Carousel>
                                ) : (
                                    <p>No images available</p>
                                )}
                            </Form.Group>

                            <Row className="mb-1 mb-lg-3">
                                <Col xs={12} >
                                    <Form.Group className="d-flex flex-column align-items-center">
                                        <Form.Label className="text-center mb-0 fw-bold">Title</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Enter ad title" 
                                            name="title"
                                            id="button"
                                            value={editedAd.title || ''} 
                                            onChange={handleInputChange} 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-1 mb-lg-3">
                                <Col xs={6} md={6}>
                                    <Form.Group className="d-flex flex-column align-items-center">
                                        <Form.Label className="text-center mb-0 fw-bold">Category</Form.Label>
                                        <Form.Control 
                                            as="select" 
                                            name="category_id"
                                            id="button"
                                            value={selectedCategory} 
                                            onChange={handleCategoryChange}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col xs={6} md={6}>
                                    <Form.Group className="d-flex flex-column align-items-center">
                                        <Form.Label className="text-center mb-0 fw-bold">Subcategory</Form.Label>
                                        <Form.Control 
                                            as="select" 
                                            name="subcategory_id"
                                            id="button"
                                            value={selectedSubcategory} 
                                            onChange={handleSubcategoryChange}
                                        >
                                            <option value="">Select Subcategory</option>
                                            {subcategories.map(subcat => (
                                                <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-1 mb-lg-3">
                                <Col xs={6} md={6}>
                                    <Form.Group className="d-flex flex-column align-items-center">
                                        <Form.Label className="text-center mb-0 fw-bold">Price</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            placeholder="Enter ad price" 
                                            name="price"
                                            id="button"
                                            value={editedAd.price || ''} 
                                            onChange={handleInputChange} 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} md={6}>
                                    <Form.Group className="d-flex flex-column align-items-center">
                                        <Form.Label className="text-center mb-0 fw-bold">Quantity in Stock</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            placeholder="Enter quantity in stock" 
                                            name="quantity"
                                            id="button"
                                            value={editedAd.quantity || ''} 
                                            onChange={handleInputChange} 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-1 mb-lg-3">
                                <Col xs={12} md={6}>
                                    <Form.Group className="d-flex flex-column align-items-center">
                                        <Form.Label className=" text-center mb-0 fw-bold">Brand</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Enter ad brand" 
                                            name="brand"
                                            id="button"
                                            value={editedAd.brand || ''} 
                                            onChange={handleInputChange} 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Form.Group className="d-flex flex-column align-items-center">
                                        <Form.Label className="text-center mb-0 fw-bold">Manufacturer</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Enter ad manufacturer" 
                                            name="manufacturer"
                                            id="button"
                                            value={editedAd.manufacturer || ''} 
                                            onChange={handleInputChange} 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="d-flex flex-column align-items-center mb-1 mb-lg-3">
                                <Form.Label className="text-center mb-0 fw-bold">Add Images</Form.Label>
                                <Form.Control 
                                    type="file"
                                    id="button"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleFileSelect(e.target.files)}
                                />
                                <Button 
                                    variant="warning"
                                    onClick={handleAddImages} 
                                    className="mt-2"
                                    id="button"
                                >
                                    Upload and Add Images
                                </Button>
                            </Form.Group>

                            <Form.Group className="d-flex flex-column align-items-center">
                                <Form.Label className="text-center mb-0 fw-bold">Description</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={3} 
                                    placeholder="Enter ad description" 
                                    name="description"
                                    value={editedAd.description || ''} 
                                    onChange={handleInputChange} 
                                />
                            </Form.Group>

                            <Card className="custom-card-vendor">
                                <Card.Header className="justify-content-center fw-bold">Dimensions</Card.Header>
                                <Card.Body>
                                    <Row className="mb-1 -mb-lg-3">
                                        <Col xs={6} md={6}>
                                            <Form.Group className="d-flex flex-column align-items-center">
                                                <Form.Label className="text-center mb-0 fw-bold">Length</Form.Label>
                                                <Form.Control 
                                                    type="number" 
                                                    placeholder="Enter ad length" 
                                                    name="item_length"
                                                    value={editedAd.item_length || ''} 
                                                    onChange={handleInputChange} 
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={6} md={6}>
                                            <Form.Group className="d-flex flex-column align-items-center">
                                                <Form.Label className="text-center mb-0 fw-bold">Width</Form.Label>
                                                <Form.Control 
                                                    type="number" 
                                                    placeholder="Enter ad width" 
                                                    name="item_width"
                                                    value={editedAd.item_width || ''} 
                                                    onChange={handleInputChange} 
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mb-1 mb-lg-3">
                                        <Col xs={6} md={6}>
                                            <Form.Group className="d-flex flex-column align-items-center">
                                                <Form.Label className="text-center mb-0 fw-bold">Height</Form.Label>
                                                <Form.Control 
                                                    type="number" 
                                                    placeholder="Enter ad height" 
                                                    name="item_height"
                                                    value={editedAd.item_height || ''} 
                                                    onChange={handleInputChange} 
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={6} md={6}>
                                            <Form.Group className="d-flex flex-column align-items-center">
                                                <Form.Label className="text-center mb-0 fw-bold">Weight</Form.Label>
                                                <Form.Control 
                                                    type="number" 
                                                    placeholder="Enter ad weight" 
                                                    name="item_weight"
                                                    value={editedAd.item_weight || ''} 
                                                    onChange={handleInputChange} 
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group>
                                            <Form.Label>Weight Unit</Form.Label>
                                            <Row className="mb-3">                                                                                             
                                                <Col xs={6} md={6}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        name="weight_unit"
                                                        label="Grams"
                                                        checked={editedAd.weight_unit === 'Grams'}
                                                        onChange={() => handleWeightUnitChange('Grams')}
                                                    />
                                                </Col>
                                                <Col xs={6} md={6}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        name="weight_unit"
                                                        label="Kilograms"
                                                        checked={editedAd.weight_unit === 'Kilograms'}
                                                        onChange={() => handleWeightUnitChange('Kilograms')}
                                                    />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Row>
                                </Card.Body>
                            </Card>
                            
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className="p-0 p-lg-1">                        
                        <Button variant="warning" onClick={handleSaveEdit} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="danger" onClick={handleModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                                    
{/* ============================================================  START ADD PRODUCT MODAL ==================================================================================*/}

                <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="xl" centered className="custom-modal">
                    <Modal.Header className="custom-modal-header justify-content-center p-1 p-lg-2">
                        <Modal.Title>Add Ad</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="custom-modal-body">
                        <Form>
                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className="text-center mb-0 fw-bold">Title</Form.Label>
                                        <Form.Control
                                            id="title"
                                            type="text"
                                            placeholder="Enter ad title"
                                            value={formValues.title}
                                            onChange={handleFormChange}
                                            className="custom-input mb-1 rounded-pill"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Label className="text-center mb-0 fw-bold">Description</Form.Label>
                                        <Form.Control
                                            id="description"
                                            as="textarea"
                                            rows={10}
                                            placeholder="Enter ad description"
                                            value={formValues.description}
                                            onChange={handleFormChange}
                                            className="custom-input mb-1"
                                        />
                                    </Form.Group>

                                    {/* Inside your modal */}
                                    <Form.Group className="mb-2">
                                        <Form.Label className="text-center mb-0 fw-bold">Media</Form.Label>
                                        <div className="upload-section position-relative">
                                            <div className="upload-icon">&#8689;</div>
                                                <Button variant="warning" className="custom-upload-btn position-relative rounded-pill">
                                                    Upload Images
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) => handleFileSelect(e.target.files)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            opacity: 0,
                                                            cursor: 'pointer',
                                                        }}
                                                    />
                                                </Button>
                                            <div className="upload-instructions">Drag and Drop files Here</div>
                                            <div className="image-preview mt-2" style={{ 
                                                display: 'flex', 
                                                flexDirection: 'row',
                                                overflowX: 'auto',
                                                gap: '10px',
                                                padding: '10px 0'
                                                }}>
                                                {editedAd.media.map((imageUrl, index) => (
                                                    <div 
                                                        key={index} 
                                                        className="image-container position-relative"
                                                        style={{ flexShrink: 0 }}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-image position-absolute d-flex justify-content-center align-items-center"
                                                            onClick={() => removeImage(index)}
                                                            style={{
                                                                right: '-8px',
                                                                top: '-8px',
                                                                borderRadius: '50%',
                                                                padding: 0,
                                                                zIndex: 1,
                                                                height: '22px',
                                                                width: '22px',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                fontSize: '14px',
                                                                lineHeight: 1,
                                                                border: 'none'
                                                            }}
                                                        >
                                                            &times;
                                                        </button>
                                                        <img
                                                            src={imageUrl}
                                                            alt={`preview ${index + 1}`}
                                                            className="img-thumbnail"
                                                            style={{ 
                                                                width: '80px', 
                                                                height: '80px', 
                                                                objectFit: 'cover',
                                                                margin: 0
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* Preview Uploaded Images in a row at bottom */}
                                        
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group xs={6} className="d-flex flex-column align-items-center mb-2">
                                        <Form.Label className="text-center mb-0 fw-bold">Category</Form.Label>
                                        <Form.Control
                                            id="category_id"
                                            as="select"
                                            className="custom-input mb-1 rounded-pill"
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group xs={6} className="d-flex flex-column align-items-center mb-2">
                                        <Form.Label className="text-center mb-0 fw-bold">Sub-Category</Form.Label>
                                        <Form.Control
                                            id="subcategory_id"
                                            as="select"
                                            className="custom-input mb-1 rounded-pill"
                                            value={selectedSubcategory}
                                            onChange={(e) => setSelectedSubcategory(e.target.value)}
                                        >
                                            <option value="">Select Sub-Category</option>
                                            {subcategories.map((subcategory) => (
                                                <option key={subcategory.id} value={subcategory.id}>
                                                    {subcategory.name}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group className="d-flex flex-column align-items-center mb-2">
                                        <Form.Label className="text-center mb-0 fw-bold">Price</Form.Label>
                                        <Form.Control
                                            id="price"
                                            type="text"
                                            placeholder="Enter ad price"
                                            value={formValues.price}
                                            onChange={handleFormChange}
                                            className="custom-input mb-1 rounded-pill"
                                        />
                                    </Form.Group>

                                    <Form.Group className="d-flex flex-column align-items-center mb-2">
                                        <Form.Label className="text-center mb-0 fw-bold">Quantity</Form.Label>
                                        <Form.Control
                                            id="quantity"
                                            type="text"
                                            placeholder="Enter quantity"
                                            value={formValues.quantity}
                                            onChange={handleFormChange}
                                            className="custom-input mb-1 rounded-pill"
                                        />
                                    </Form.Group>

                                    <Form.Group className="d-flex flex-column align-items-center mb-2">
                                        <Form.Label className="text-center mb-0 fw-bold">Brand</Form.Label>
                                        <Form.Control
                                            id="brand"
                                            type="text"
                                            placeholder="Enter brand"
                                            value={formValues.brand}
                                            onChange={handleFormChange}
                                            className="custom-input mb-1 rounded-pill"
                                        />
                                    </Form.Group>

                                    <Form.Group className="d-flex flex-column align-items-center mb-2">
                                        <Form.Label className="text-center mb-0 fw-bold">Manufacturer</Form.Label>
                                        <Form.Control
                                            id="manufacturer"
                                            type="text"
                                            placeholder="Enter manufacturer"
                                            value={formValues.manufacturer}
                                            onChange={handleFormChange}
                                            className="custom-input mb-1 rounded-pill"
                                        />
                                    </Form.Group>

                                    <Container className="p-0">
                                        <Form.Group className="d-flex flex-column align-items-center mb-2">
                                            <Form.Label className="text-center mb-0 fw-bold">Item Dimensions</Form.Label>
                                            <Row>
                                                <Col xs={6} lg={12}>
                                                    <Form.Control
                                                        id="item_length"
                                                        type="text"
                                                        placeholder="Length"
                                                        value={formValues.item_length}
                                                        onChange={handleFormChange}
                                                        className="custom-input mb-2 rounded-pill"
                                                    />
                                                </Col>
                                                <Col xs={6} lg={12}>
                                                    <Form.Control
                                                        id="item_width"
                                                        type="text"
                                                        placeholder="Width"
                                                        value={formValues.item_width}
                                                        onChange={handleFormChange}
                                                        className="custom-input mb-2 rounded-pill"
                                                    />
                                                </Col>
                                            </Row>
                                            
                                            
                                            <Row>
                                                <Col xs={6} lg={12}>
                                                    <Form.Control
                                                        id="item_height"
                                                        type="text"
                                                        placeholder="Height"
                                                        value={formValues.item_height}
                                                        onChange={handleFormChange}
                                                        className="custom-input rounded-pill"
                                                    />
                                                </Col>
                                                <Col xs={6} lg={12} >
                                                    <Form.Control
                                                        id="item_weight"
                                                        type="text"
                                                        placeholder="Weight"
                                                        value={formValues.item_weight}
                                                        onChange={handleFormChange}
                                                        className="custom-input mb-1 rounded-pill"
                                                    />
                                                </Col>
                                            </Row>
                                            
                                        </Form.Group>
                                        <Row>
                                            <Form.Group className="d-flex flex-column align-items-center mb-2">
                                                <Form.Label className="text-center fw-bold">Weight Unit</Form.Label>
                                                <Row >
                                                    <Col xs={6} md={6} lg={6} className=" d-flex justify-content-center">
                                                        <Form.Check
                                                            type="checkbox"
                                                            label="Grams"
                                                            checked={weightUnit === 'Grams'}
                                                            onChange={() => handleWeightUnitChange('Grams')}
                                                        />
                                                    </Col>
                                                    <Col xs={6} md={6} ls={6} className=" d-flex justify-content-center">
                                                        <Form.Check
                                                            type="checkbox"
                                                            label="Kilograms"
                                                            checked={weightUnit === 'Kilograms'}
                                                            onChange={() => handleWeightUnitChange('Kilograms')}
                                                        />
                                                    </Col>
                                                </Row>
                                                    
                                            </Form.Group>
                                        </Row>
                                    </Container>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className="p-0 p-lg-1">
                        <Button variant="warning" onClick={handleAddNewAd} >
                            Add Ad
                        </Button>
                        <Button variant="danger" onClick={() => setShowAddModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default VendorAds;