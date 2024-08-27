import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Modal, Carousel, FormControl, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faStar, faStarHalfAlt, faStar as faStarEmpty, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import './VendorProducts.css'; 

const VendorProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editedProduct, setEditedProduct] = useState({});
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    
    const vendorId = localStorage.getItem('vendorId');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/vendor/products?vendor_id=${vendorId}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
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

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/vendor/categories');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchProducts();
        fetchCategories();
    }, [vendorId]);

    useEffect(() => {
        if (selectedCategory) {
            const fetchSubcategories = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/vendor/subcategories?category_id=${selectedCategory}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setSubcategories(data);
                } catch (error) {
                    console.error('Error fetching subcategories:', error);
                }
            };
    
            fetchSubcategories();
        }
    }, [selectedCategory]);

    const handleCategoryChange = (event) => {
        const category_id = event.target.value;
        setSelectedCategory(category_id);
        setSelectedSubcategory(''); // Reset subcategory when category changes
    };


    const handleAddNewProduct = () => {
        console.log('Add new product clicked');
    };

    const handleViewDetailsClick = (product) => {
        setSelectedProduct(product);
        setShowDetailsModal(true);
    };

    const handleEditProduct = (productId) => {
        const product = products.find(p => p.id === productId);
        setSelectedProduct(product);
        setEditedProduct({ ...product });
        setShowEditModal(true);
    };

    const handleDeleteProduct = (productId) => {
        console.log('Delete product clicked for product ID:', productId);
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
        try {
            const response = await fetch(`http://localhost:3000/vendor/products/${editedProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify(editedProduct),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const updatedProduct = await response.json();
            setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
            setShowEditModal(false);
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const renderProductCard = (product) => (
        <Col xs={12} md={6} lg={3} key={product.id} className="mb-4">
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
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1">
                            <Button
                                variant="warning"
                                id="button"
                                onClick={() => handleViewDetailsClick(product)}
                            >
                                View Details
                            </Button>
                        </div>
                        <div className="d-flex ml-2">
                            <Button
                                variant="secondary"
                                className="me-2"
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
                        <Col xs={12} md={10} className="p-2">
                            <Row className="justify-content-center d-flex align-items-center">
                                <Col xs={12} md={8} lg={6} className="mb-3 pt-3">
                                    <div className="search-container d-flex align-items-center">
                                        <FormControl
                                            placeholder="Search products..."
                                            aria-label="Search products"
                                            aria-describedby="search-icon"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            className="search-input"
                                        />
                                    </div>
                                </Col>
                                <Col xs={12} md={4} lg={3} className="mb-3 pt-3 justify-content-start">
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

                {/* Product Details Modal */}
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
                                                        {selectedProduct.price?.split('.').map((part, index) => (
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
                                                        )) || 'N/A'}
                                                    </strong>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Category</Card.Header>
                                                <Card.Body className="text-center">
                                                    {selectedProduct.category?.name || 'N/A'}
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
                                        <Col xs={12}>
                                            <Card className="mb-2 custom-card">
                                                <Card.Header as="h6" className="justify-content-center">Rating</Card.Header>
                                                <Card.Body className="text-center">
                                                    <span className="star-rating">
                                                        {renderRatingStars(selectedProduct.mean_rating || 0)}
                                                    </span>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Container>
                                <h5 className="text-center" id="reviews">Reviews</h5>
                                {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                                    <div className="reviews-container text-center">
                                        {selectedProduct.reviews.map((review, index) => (
                                            <div className="review-card" key={index}>
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
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Edit Product Modal */}
                <Modal show={showEditModal} onHide={handleModalClose} size="lg">
                    <Modal.Header className='justify-content-center'>
                        <Modal.Title>{selectedProduct ? `Edit ${selectedProduct.title}` : 'Edit Product'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formProductTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter product title" 
                                    name="title"
                                    value={editedProduct.title || ''} 
                                    onChange={handleInputChange} 
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductCategory">
                                <Form.Label>Category</Form.Label>
                                <Form.Control 
                                    as="select" 
                                    name="category" 
                                    value={editedProduct.category || ''} 
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formProductSubcategory">
                                <Form.Label>Subcategory</Form.Label>
                                <Form.Control 
                                    as="select" 
                                    name="subcategory" 
                                    value={editedProduct.subcategory || ''} 
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Subcategory</option>
                                    {subcategories.map(subcat => (
                                        <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formProductDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={3} 
                                    placeholder="Enter product description" 
                                    name="description"
                                    value={editedProduct.description || ''} 
                                    onChange={handleInputChange} 
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductPrice">
                                <Form.Label>Price</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    placeholder="Enter product price" 
                                    name="price"
                                    value={editedProduct.price || ''} 
                                    onChange={handleInputChange} 
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductQuantity">
                                <Form.Label>Quantity in Stock</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    placeholder="Enter quantity in stock" 
                                    name="quantity"
                                    value={editedProduct.quantity || ''} 
                                    onChange={handleInputChange} 
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductBrand">
                                <Form.Label>Brand</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter product brand" 
                                    name="brand"
                                    value={editedProduct.brand || ''} 
                                    onChange={handleInputChange} 
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductManufacturer">
                                <Form.Label>Manufacturer</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter product manufacturer" 
                                    name="manufacturer"
                                    value={editedProduct.manufacturer || ''} 
                                    onChange={handleInputChange} 
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductImages">
                                <Form.Label>Images (URLs separated by commas)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter product image URLs" 
                                    name="images"
                                    value={(editedProduct.images || []).join(', ')} 
                                    onChange={e => setEditedProduct({
                                        ...editedProduct,
                                        images: e.target.value.split(',').map(url => url.trim())
                                    })} 
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>                        
                        <Button variant="warning" onClick={handleSaveEdit}>
                            Save Changes
                        </Button>
                        <Button variant="danger" onClick={handleModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                                    
                                    {/* ADD Product Modal */}
                                    <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered className="custom-modal">
            <Modal.Header className="custom-modal-header">
                <Modal.Title>Add Product</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <Form>
                    <Row>
                        <Col md={8}>
                            <Form.Group className="mb-2">
                                <Form.Label className="mb-0">Title</Form.Label>
                                <Form.Control id="button" type="text" placeholder="Enter product title" className="custom-input" />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label className="mb-0">Description</Form.Label>
                                <Form.Control as="textarea" rows={5} placeholder="Enter product description" className="custom-input" />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label className="mb-0">Media</Form.Label>
                                <div className="upload-section">
                                    <div className="upload-icon">&#8689;</div> {/* Example upload icon, replace with an actual icon */}
                                    <Button variant="light" className="custom-upload-btn">Add File</Button>
                                    <div className="upload-instructions">or upload files to upload</div>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-2">
                                <Form.Label className="mb-0">Category</Form.Label>
                                <Form.Control id="button" as="select" className="custom-input" value={selectedCategory} onChange={handleCategoryChange}>
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label className="mb-0">Sub-Category</Form.Label>
                                <Form.Control id="button" as="select" className="custom-input" value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
                                    <option value="">Select Sub-Category</option>
                                    {subcategories.filter(sub => sub.categoryId === selectedCategory).map((subcategory) => (
                                        <option key={subcategory.id} value={subcategory.id}>
                                            {subcategory.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label className="mb-0">Price</Form.Label>
                                <Form.Control id="button" type="text" placeholder="Enter product price" className="custom-input" />
                            </Form.Group>

                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">Quantity</Form.Label>
                                <Form.Control id="button" type="text" placeholder="Enter quantity" className="custom-input" />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label className="mb-0">Brand</Form.Label>
                                <Form.Control id="button" type="text" placeholder="Enter brand" className="custom-input" />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label className="mb-0">Manufacturer</Form.Label>
                                <Form.Control id="button" type="text" placeholder="Enter manufacturer" className="custom-input" />
                            </Form.Group>

                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">Package Dimensions</Form.Label>
                                <Form.Control id="button" type="text" placeholder="Length" className="custom-input mb-2" />
                                <Form.Control id="button" type="text" placeholder="Width" className="custom-input mb-2" />
                                <Form.Control id="button" type="text" placeholder="Height" className="custom-input" />
                            </Form.Group>

                            <Form.Group className="mb-1">
                                <Form.Label className="mb-0">Package Weight</Form.Label>
                                <Form.Control id="button" type="text" placeholder="Enter package weight" className="custom-input" />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
                <Button variant="warning" className="add-product-btn" onClick={handleAddNewProduct}>
                    Add Product
                </Button>
                <Button variant="danger" onClick={handleModalClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

            </div>
        </>
    );
};

export default VendorProducts;
