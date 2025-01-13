import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Carousel, FormControl, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faStar, faStarHalfAlt, faStar as faStarEmpty, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/Sidebar';
import Spinner from "react-spinkit";
import TopNavbar from '../components/TopNavbar';
import { Cloudinary } from 'cloudinary-core';
import '../css/VendorProducts.css'; 

const VendorProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [weightUnit, setWeightUnit] = useState('Grams');
    // const [files, setFiles] = useState([]);
    const [editedProduct, setEditedProduct] = useState({
        item_length: '',
        item_width: '',
        item_height: '',
        item_weight: '',
        weight_unit: 'Grams', // Default weight unit
        media: []  // Assuming 'images' holds the URLs of the product images
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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/vendor/products?vendor_id=${vendorId}`, {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
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
    
                    // Set the selected subcategory to the one stored in the product data
                    setSelectedSubcategory(editedProduct.subcategory_id);
                } catch (error) {
                    console.error('Error fetching subcategories:', error);
                }
            };
    
            fetchSubcategories();
        }
    }, [selectedCategory, editedProduct.subcategory_id]);  // Dependency on both selectedCategory and editedProduct.subcategory_id
    

    const handleCategoryChange = (event) => {
        const category_id = event.target.value;
        setSelectedCategory(category_id);
        setSelectedSubcategory(''); // Reset subcategory when a new category is selected
        setEditedProduct(prevState => ({
            ...prevState,
            category_id,  // Use category_id to match the server expectation
            subcategory_id: '' // Clear subcategory_id
        }));
    };

    const handleSubcategoryChange = (event) => {
        const subcategory_id = event.target.value;
        setSelectedSubcategory(subcategory_id);
        setEditedProduct(prevState => ({
            ...prevState,
            subcategory_id // Update subcategory_id
        }));
    };

    const handleWeightUnitChange = (unit) => {
        setEditedProduct((prev) => ({
            ...prev,
            weight_unit: unit,
        }));
    };
    
    
    const handleFormChange = (e) => {
        const { id, value } = e.target;
        setFormValues(prevValues => ({ ...prevValues, [id]: value }));
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
    

    const handleAddNewProduct = async () => {
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
        const newProduct = {
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
            weight_unit: weightUnit, // Include the weight unit in the product object
            media: mediaUrls // Store all the uploaded image URLs
        };
    
        try {
            const response = await fetch('https://carboncube-ke-rails-cu22.onrender.com/vendor/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify(newProduct),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const result = await response.json();
            console.log('Product added successfully:', result);
    
            // Update the products state to include the new product
            setProducts(prevProducts => [...prevProducts, result]);
    
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
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
        }
    };
    

    const handleViewDetailsClick = (product) => {
        setSelectedProduct(product);
        setShowDetailsModal(true);
    };

    const handleEditProduct = (productId) => {
        const product = products.find(p => p.id === productId);
        setSelectedProduct(product);
        setEditedProduct({ ...product });
        
        // Set selected category and subcategory from the product data
        setSelectedCategory(product.category_id);
        setSelectedSubcategory(product.subcategory_id);
        setShowEditModal(true);
    };
    

    const handleDeleteProduct = async (productId) => {
        console.log('Delete product clicked for product ID:', productId);
        
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (!confirmed) return; // Exit if the user cancels the deletion
        
        try {
            const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/vendor/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete the product.');
            }
    
            // If the product was successfully deleted, remove it from the local state
            setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
    
            console.log('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('There was an error deleting the product. Please try again.');
        }
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
        setShowAddModal(false);
    };

    const handleSaveEdit = async () => {
        setIsSaving(true);
        try {
        const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/vendor/products/${editedProduct.id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
            body: JSON.stringify({ product: {
            title: editedProduct.title,
            description: editedProduct.description,
            category_id: editedProduct.category_id, // Ensure it's category_id
            subcategory_id: editedProduct.subcategory_id, // Ensure it's subcategory_id
            price: editedProduct.price,
            quantity: editedProduct.quantity,
            brand: editedProduct.brand,
            manufacturer: editedProduct.manufacturer,
            item_length: editedProduct.item_length,
            item_width: editedProduct.item_width,
            item_height: editedProduct.item_height,
            item_weight: editedProduct.item_weight,
            weight_unit: editedProduct.weight_unit,
            flagged: editedProduct.flagged,
            media: editedProduct.media // Only include media if applicable
            } }),
        });
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    
        const updatedProduct = await response.json();
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        setShowEditModal(false);
        } catch (error) {
        console.error('Error saving changes:', error);
        } finally {
        setIsSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Function to add an image URL
    const handleAddImages = async () => {
        if (newImageUrl.trim()) {
            try {
                // Upload image to Cloudinary
                const imageUrl = await handleImageUpload(newImageUrl);
                
                // Append new image URL to media array
                const updatedMedia = [...editedProduct.media, imageUrl];
    
                // Update the product's media array on the server
                const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/vendor/products/${editedProduct.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                    body: JSON.stringify({ product: { media: updatedMedia } }),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to update product');
                }
    
                const updatedProduct = await response.json();
    
                // Update the product in the local state
                setEditedProduct(updatedProduct);
                setProducts(prevProducts => 
                    prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
                );
    
                setNewImageUrl('');
                console.log('Image added successfully');
            } catch (error) {
                console.error('Error adding image:', error);
            }
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
                const updatedMedia = [...editedProduct.media, ...imageUrls];
                setEditedProduct(prev => ({
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
            const updatedMedia = editedProduct.media.filter((_, i) => i !== index);

            // Send a PATCH request to update the product's media array in the database
            const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/vendor/products/${editedProduct.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify({ product: { media: updatedMedia } }),
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            const updatedProduct = await response.json();

            // Update the product in the local state
            setEditedProduct(updatedProduct);
            setProducts(prevProducts => 
                prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
            );

            console.log('Image deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const renderProductCard = (product) => (
        <Col xs={6} md={6} lg={3} key={product.id} className="mb-3 px-2 px-md-2">
            <Card>
                <Card.Img variant="top" className="product-image" src={product.media && product.media.length > 0 ? product.media[0] : 'default-image-url'}/> 
                <Card.Body className="px-2 py-1 py-md-2 bookmark-body">
                    <Card.Title className="mb-0 product-title">{product.title}</Card.Title>
                    <Card.Text>
                        <span className="text-success" style={{ fontSize: '15px' }}>Kshs: </span>
                        <strong style={{ fontSize: '20px' }} className="text-danger">
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
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1">
                            <Button
                                variant="warning"
                                id="button"
                                onClick={() => handleViewDetailsClick(product)}
                            >
                                Details
                            </Button>
                        </div>
                        <div className="d-flex ml-2">
                            <Button
                                variant="secondary"
                                className="me-2"
                                id="button"
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
                                id="button"
                                onClick={() => handleDeleteProduct(product.id)}
                            >
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="edit-icon"
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
                        <Col xs={12} md={9} lg={9} className="p-2">
                            <Row className="justify-content-center d-flex align-items-center">
                                <Col xs={7} md={8} lg={6} className="mb-1 mb-md-3 pt-2 pt-md-3 justify-content-end">
                                    <div className="search-container d-flex align-items-center">
                                        <FormControl
                                            placeholder="Search products..."
                                            aria-label="Search products"
                                            aria-describedby="search-icon"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            className="search-input text-center"
                                        />
                                    </div>
                                </Col>
                                <Col xs={5} md={4} lg={3} className="mb-1 mb-md-3 pt-2 pt-md-3 d-flex justify-content-start">
                                    <Button id="button" variant="warning" onClick={() => setShowAddModal(true)}>
                                        Add New Product
                                    </Button>
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

{/* ============================================================ START PRODUCT DETAILS MODAL ==================================================================================*/}

                <Modal centered show={showDetailsModal} onHide={handleModalClose} size="xl">
                    <Modal.Header className='justify-content-center p-1 p-lg-2'>
                        <Modal.Title>{selectedProduct?.title || 'Product Details'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-0 p-lg-2">
                        {selectedProduct && (
                            <>
                                <Carousel className='mb-4'>
                                    {selectedProduct.media && selectedProduct.media.length > 0 ? (
                                        selectedProduct.media.map((image, index) => (
                                            <Carousel.Item key={index} className="position-relative">
                                                <img
                                                    className="d-block w-100 product-image"
                                                    src={image}
                                                    alt={`Product ${selectedProduct.title} - view ${index + 1}`} // Updated alt text
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
                                <Container className="product-details mb-4 p-1 p-lg-2">
                                    <Row>
                                        <Col xs={6} md={6}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Price</Card.Header>
                                                <Card.Body className="text-center">
                                                    <em className='product-price-label'>Kshs: </em>
                                                    <strong className="text-success">
                                                        {selectedProduct.price ? (
                                                            (() => {
                                                                const formattedPrice = parseFloat(selectedProduct.price).toFixed(2);
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
                                                    {selectedProduct.category?.name || 'N/A'}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={6} md={6}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Quantity Sold</Card.Header>
                                                <Card.Body className="text-center">
                                                    {selectedProduct.quantity_sold || 0}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs={6} md={6}>
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
                                        <Col xs={12} md={6}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Rating</Card.Header>
                                                <Card.Body className="text-center">
                                                    <span className="star-rating">
                                                        {renderRatingStars(selectedProduct.mean_rating || 0)}
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
                                                            <p><strong>Height:</strong> {selectedProduct.item_height} cm</p>
                                                            <p><strong>Width:</strong> {selectedProduct.item_width} cm</p>
                                                        </Col>
                                                        <Col xs={6} md={6}>
                                                            <p><strong>Length:</strong> {selectedProduct.item_length} cm</p>
                                                            <p><strong>Weight:</strong> {selectedProduct.item_weight} {selectedProduct.weight_unit}</p>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        
                                    </Row>
                                </Container>
                                <h5 className="text-center" id="reviews">Reviews</h5>
                                {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                                    <div className="reviews-container text-center p-1 p-lg-2">
                                        {selectedProduct.reviews.map((review, index) => (
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
                        <Modal.Title>{selectedProduct ? `Edit ${selectedProduct.title}` : 'Edit Product'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-1 p-lg-2">
                        <Form>

                            <Form.Group className="mb-3">
                                {editedProduct.media && editedProduct.media.length > 0 ? (
                                    <Carousel>
                                    {editedProduct.media.map((image, index) => (
                                        <Carousel.Item key={index} className="position-relative">
                                            <img
                                                className="d-block w-100"
                                                src={image}
                                                alt={`Product - view ${index + 1}`}
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
                                            placeholder="Enter product title" 
                                            name="title"
                                            id="button"
                                            value={editedProduct.title || ''} 
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
                                            placeholder="Enter product price" 
                                            name="price"
                                            id="button"
                                            value={editedProduct.price || ''} 
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
                                            value={editedProduct.quantity || ''} 
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
                                            placeholder="Enter product brand" 
                                            name="brand"
                                            id="button"
                                            value={editedProduct.brand || ''} 
                                            onChange={handleInputChange} 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Form.Group className="d-flex flex-column align-items-center">
                                        <Form.Label className="text-center mb-0 fw-bold">Manufacturer</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Enter product manufacturer" 
                                            name="manufacturer"
                                            id="button"
                                            value={editedProduct.manufacturer || ''} 
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
                                    placeholder="Enter product description" 
                                    name="description"
                                    value={editedProduct.description || ''} 
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
                                                    placeholder="Enter product length" 
                                                    name="item_length"
                                                    value={editedProduct.item_length || ''} 
                                                    onChange={handleInputChange} 
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={6} md={6}>
                                            <Form.Group className="d-flex flex-column align-items-center">
                                                <Form.Label className="text-center mb-0 fw-bold">Width</Form.Label>
                                                <Form.Control 
                                                    type="number" 
                                                    placeholder="Enter product width" 
                                                    name="item_width"
                                                    value={editedProduct.item_width || ''} 
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
                                                    placeholder="Enter product height" 
                                                    name="item_height"
                                                    value={editedProduct.item_height || ''} 
                                                    onChange={handleInputChange} 
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={6} md={6}>
                                            <Form.Group className="d-flex flex-column align-items-center">
                                                <Form.Label className="text-center mb-0 fw-bold">Weight</Form.Label>
                                                <Form.Control 
                                                    type="number" 
                                                    placeholder="Enter product weight" 
                                                    name="item_weight"
                                                    value={editedProduct.item_weight || ''} 
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
                                                        checked={editedProduct.weight_unit === 'Grams'}
                                                        onChange={() => handleWeightUnitChange('Grams')}
                                                    />
                                                </Col>
                                                <Col xs={6} md={6}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        name="weight_unit"
                                                        label="Kilograms"
                                                        checked={editedProduct.weight_unit === 'Kilograms'}
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
                        <Modal.Title>Add Product</Modal.Title>
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
                                            placeholder="Enter product title"
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
                                            placeholder="Enter product description"
                                            value={formValues.description}
                                            onChange={handleFormChange}
                                            className="custom-input mb-1"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Label className="text-center mb-0 fw-bold">Media</Form.Label>
                                        <div className="upload-section">
                                            <div className="upload-icon">&#8689;</div>
                                            <Button variant="light" className="custom-upload-btn">
                                                {/* Add onChange to handle file selection */}
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
                                            <div className="upload-instructions">or Drag and Drop files Here</div>
                                        </div>
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
                                            placeholder="Enter product price"
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
                        <Button variant="warning" onClick={handleAddNewProduct} >
                            Add Product
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

export default VendorProducts;
