import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Container, Row, Col, Tabs, Tab, Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faKey, faStar, faStarHalfAlt, faStar as faStarEmpty } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import Spinner from "react-spinkit";
import './VendorsManagement.css';  // Custom CSS

const VendorsManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('profile');    
    const [searchQuery, setSearchQuery] = useState(''); 

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await fetch(`http://localhost:3000/admin/vendors?search_query=${searchQuery}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('Fetched vendors:', data); // Add this line
                data.sort((a, b) => a.id - b.id);
                setVendors(data);
            } catch (error) {
                console.error('Error fetching vendors:', error);
                setError('Error fetching vendors');
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, [searchQuery]); // Depend on searchQuery so it refetches when the query changes


    const handleRowClick = async (vendorId) => {
        try {
            const [vendorResponse, ordersResponse, productsResponse, reviewsResponse] = await Promise.all([
                fetch(`http://localhost:3000/admin/vendors/${vendorId}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                }),
                fetch(`http://localhost:3000/admin/vendors/${vendorId}/orders`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                }),
                fetch(`http://localhost:3000/admin/vendors/${vendorId}/products`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                }),
                fetch(`http://localhost:3000/admin/vendors/${vendorId}/reviews`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                })
            ]);
    
            if (!vendorResponse.ok || !ordersResponse.ok || !productsResponse.ok || !reviewsResponse.ok) {
                throw new Error('Network response was not ok');
            }
    
            const vendorData = await vendorResponse.json();
            const ordersData = await ordersResponse.json();
            const productsData = await productsResponse.json();
            const reviewsData = await reviewsResponse.json();
            const analytics = await fetchVendorAnalytics(vendorId);
    
            setSelectedVendor({ ...vendorData, orders: ordersData, products: productsData, reviews: reviewsData, analytics });
            setSelectedTab('profile');
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching vendor details:', error);
        }
    };
    


    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedVendor(null);
    };

    const handleUpdateStatus = async (vendorId, status) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/vendors/${vendorId}/${status}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error updating vendor status:', errorData);
                return;
            }

            setVendors(prevVendors =>
                prevVendors.map(vendor =>
                    vendor.id === vendorId ? { ...vendor, blocked: status === 'block' } : vendor
                )
            );

            if (selectedVendor && selectedVendor.id === vendorId) {
                setSelectedVendor(prevVendor => ({ ...prevVendor, blocked: status === 'block' }));
            }
        } catch (error) {
            console.error('Error updating vendor status:', error);
        }
    };

    const fetchVendorAnalytics = async (vendorId) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/vendors/${vendorId}/analytics`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching vendor analytics:', error);
            return {};
        }
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
            <div className="vendors-management-page">
                <Container fluid className="p-0">
                    <Row>
                        <Col xs={12} md={2} className="p-0">
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={10} className="p-0">
                            {/* <h2 className="mb-4 text-center">Vendors Management</h2> */}
                            <Card className="section">
                                <Card.Header className="text-center">
                                    <Container fluid>
                                        <Row className="justify-content-between align-items-center">
                                            <Col xs={12} md={4} className="text-center">
                                                <h3 className="mb-0">Vendors</h3>
                                            </Col>
                                            <Col xs={12} md={8}>
                                                <div className="search-container text-center">
                                                    <Form>
                                                    <Form.Group controlId="searchPhoneNumberOrID">
                                                        <Form.Control
                                                        type="text"
                                                        placeholder="Search (Phone Number or ID)"
                                                        className="form-control"
                                                        id="button"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                    </Form>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Header>
                                <Card.Body className="p-2">
                                    <Table hover className="vendors-table text-center">
                                        <thead>
                                            <tr>
                                                <th>Vendor ID</th>
                                                <th>Name</th>
                                                <th>Contact</th>
                                                <th>Email</th>
                                                <th>Enterprise</th>
                                                <th>Location</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {vendors.length > 0 ? (
                                                vendors.map((vendor) => (
                                                    <tr
                                                        key={vendor.id}
                                                        onClick={() => handleRowClick(vendor.id)}
                                                        className={`vendor-row ${vendor.blocked ? 'blocked' : ''}`}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <td>{vendor.id}</td>
                                                        <td>{vendor.fullname}</td>
                                                        <td>{vendor.phone_number}</td>
                                                        <td>{vendor.email}</td>
                                                        <td>{vendor.enterprise_name}</td>
                                                        <td>{vendor.location}</td>
                                                        <td>
                                                            <Button
                                                                variant={vendor.blocked ? 'danger' : 'warning'}
                                                                id="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleUpdateStatus(vendor.id, vendor.blocked ? 'unblock' : 'block');
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={vendor.blocked ? faKey : faUserShield} />
                                                                
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7">No data available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                                <Card.Footer>

                                </Card.Footer>
                            </Card>
                            

                            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                                <Modal.Header className="justify-content-center">
                                    <Modal.Title>Vendor Details</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {selectedVendor ? (
                                        <Tabs
                                            activeKey={selectedTab}
                                            onSelect={(key) => setSelectedTab(key)}
                                            id="vendor-details-tabs"
                                            className="custom-tabs mb-3 d-flex justify-content-between" // Add d-flex and justify-content-between here
                                        >
                                            <Tab eventKey="profile" title="Profile">
                                                {/* <h5 className="text-center">Profile</h5> */}
                                                <Container className="profile-cards text-center">
                                                    <Row>
                                                        <Col xs={12} md={6}>
                                                            <Card className="mb-2 custom-card">
                                                                <Card.Header as="h6" className="justify-content-center">Name</Card.Header>
                                                                <Card.Body className="text-center">
                                                                    {selectedVendor.fullname}
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                        <Col xs={12} md={6}>
                                                            <Card className="mb-2 custom-card">
                                                                <Card.Header as="h6" className="justify-content-center">Email</Card.Header>
                                                                <Card.Body className="text-center">
                                                                    {selectedVendor.email}
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs={12} md={6}>
                                                            <Card className="mb-2 custom-card">
                                                                <Card.Header as="h6" className="justify-content-center">Phone</Card.Header>
                                                                <Card.Body className="text-center">
                                                                    {selectedVendor.phone_number}
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                        <Col xs={12} md={6}>
                                                            <Card className="mb-2 custom-card">
                                                                <Card.Header as="h6" className="justify-content-center">Enterprise</Card.Header>
                                                                <Card.Body className="text-center">
                                                                    {selectedVendor.enterprise_name}
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs={12} md={6}>
                                                            <Card className="mb-2 custom-card">
                                                                <Card.Header as="h6" className="justify-content-center">Location</Card.Header>
                                                                <Card.Body className="text-center">
                                                                    {selectedVendor.location}
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                        <Col xs={12} md={6}>
                                                            <Card className="mb-2 custom-card">
                                                                <Card.Header as="h6" className="justify-content-center">Status</Card.Header>
                                                                <Card.Body className="text-center">
                                                                    {selectedVendor.blocked ? 'Blocked' : 'Active'}
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs={12}>
                                                            <Card className="mb-2 custom-card">
                                                                <Card.Header as="h6" className="justify-content-center">Categories</Card.Header>
                                                                <Card.Body className="text-center">
                                                                    {selectedVendor.category_names ? selectedVendor.category_names.join(', ') : 'No categories available'}
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    </Row>

                                                </Container>
                                            </Tab>

                                            <Tab eventKey="analytics" title="Analytics">
                                                {/* <h5 className="text-center">Analytics</h5> */}
                                                {selectedVendor.analytics ? (
                                                    <Container className="profile-cards text-center">
                                                        <Row>
                                                            <Col xs={12} md={6}>
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Total Orders</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        {selectedVendor.analytics.total_orders}
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                            <Col xs={12} md={6}>
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Total Products Sold</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        {selectedVendor.analytics.total_products_sold}
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col xs={12} md={6}>
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Total Revenue</Card.Header>
                                                                    <Card.Body className="text-center price-container">
                                                                        <p className="total-revenue m-0">
                                                                            <em className='product-price-label'>Kshs: </em>
                                                                            <strong className="price">
                                                                                {selectedVendor.analytics.total_revenue ? selectedVendor.analytics.total_revenue.split('.').map((part, index) => (
                                                                                    <React.Fragment key={index}>
                                                                                        {index === 0 ? (
                                                                                            <span className="price-integer">
                                                                                                {parseInt(part, 10).toLocaleString()} {/* Add commas to the integer part */}
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
                                                                        </p>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                            <Col xs={12} md={6}>
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Total Reviews</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        {selectedVendor.analytics.total_reviews}
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col xs={12}>
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Mean Rating</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        <StarRating rating={selectedVendor.analytics.mean_rating} />
                                                                        <p className='m-0'>{selectedVendor.analytics.mean_rating}/5</p>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                    </Container>
                                                ) : (
                                                    <p>Loading analytics data...</p>
                                                )}
                                            </Tab>
                                            <Tab eventKey="orders" title="Orders">
                                                {/* <h5 className="text-center">Orders</h5> */}
                                                <Table hover className="orders-table text-center">
                                                    <thead className='table-head'>
                                                        <tr>
                                                            <th>Order ID</th>
                                                            <th>Purchaser</th>
                                                            <th>Product</th>
                                                            <th>Quantity</th>
                                                            <th>Total <em className='product-price-label' style={{ fontSize: '13px' }}>(Kshs:) </em></th>
                                                            <th>Date Ordered</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedVendor && selectedVendor.orders && selectedVendor.orders.length > 0 ? (
                                                            selectedVendor.orders.map((order) => (
                                                                order.order_items.map((item) => (
                                                                    <tr key={`${order.id}-${item.product.id}`}>
                                                                        <td>{order.id}</td>
                                                                        <td>{order.purchaser.fullname}</td>
                                                                        <td>{item.product.title}</td>
                                                                        <td>{item.quantity}</td>
                                                                        <td className="price-container">
                                                                            <strong>
                                                                                {((item.quantity * item.product.price).toFixed(1)).split('.').map((part, index) => (
                                                                                    <React.Fragment key={index}>
                                                                                        {index === 0 ? (
                                                                                            <span className="price-integer">
                                                                                                {parseInt(part, 10).toLocaleString()} {/* Add commas to the integer part */}
                                                                                            </span>
                                                                                        ) : (
                                                                                            <>
                                                                                                <span style={{ fontSize: '16px' }}>.</span>
                                                                                                <span className="price-decimal">{part}</span>
                                                                                            </>
                                                                                        )}
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </strong>
                                                                        </td>
                                                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                                                    </tr>
                                                                ))
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="6">No orders available</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </Tab>                                           

                                            <Tab eventKey="products" title="Products">
                                                {/* <h5 className="text-center">Products</h5> */}
                                                <div className="card-container">
                                                    {selectedVendor.products && selectedVendor.products.length > 0 ? (
                                                        selectedVendor.products.map((product) => (
                                                            <Col key={product.id} xs={12} md={12} lg={12} className="mb-4">
                                                                <Card>
                                                                <Card.Img
                                                                    className="analytics-card-img-top product-image"
                                                                    variant="top"
                                                                    src={product.media_urls && product.media_urls.length > 0 ? product.media_urls[0] : 'default-image-url'}
                                                                />
                                                                    <Card.Body>
                                                                        <Card.Title>{product.title}</Card.Title>
                                                                        <Card.Text className="price-container">
                                                                            <em className='product-price-label'>Kshs: </em>
                                                                            <strong>
                                                                                {product.price ? product.price.split('.').map((part, index) => (
                                                                                    <React.Fragment key={index}>
                                                                                        {index === 0 ? (
                                                                                            <span className="price-integer">
                                                                                                {parseInt(part, 10).toLocaleString()} {/* Add commas to the integer part */}
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
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        ))
                                                    ) : (
                                                        <p className="text-center">No products available</p>
                                                    )}
                                                </div>
                                            </Tab>

                                            <Tab eventKey="reviews" title="Reviews">
                                            {/* <h5 className="text-center" id="reviews">Reviews</h5> */}
                                                {selectedVendor.reviews && selectedVendor.reviews.length > 0 ? (
                                                    <div className="reviews-container text-center">
                                                        {selectedVendor.reviews.map((review) => (
                                                            <div className="review-card p-1" key={review.id}>
                                                                <p className="review-comment"><em>"{review.review}"</em></p>
                                                                <StarRating rating={review.rating} /> {/* Assuming StarRating component is defined elsewhere */}
                                                                <p className="review-product"><strong>{review.product_title}</strong></p>
                                                                <p className="reviewer-name"><strong><em>{review.purchaser_name}</em></strong></p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-center">No reviews available</p>
                                                )}
                                            </Tab>
                                        </Tabs>
                                    ) : (
                                        <p>Loading...</p>
                                    )}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="danger" id="button" onClick={handleCloseModal}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default VendorsManagement;
