import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Container, Row, Col, Tabs, Tab, Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faKey, faStar, faStarHalfAlt, faStar as faStarEmpty } from '@fortawesome/free-solid-svg-icons';
import { Bar, Doughnut } from "react-chartjs-2";
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Spinner from "react-spinkit";
import '../css/VendorsManagement.css';  // Custom CSS

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
                const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/admin/vendors?search_query=${searchQuery}`, {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                // console.log('Fetched vendors:', data); // Add this line
                data.sort((a, b) => a.id - b.id);
                setVendors(data);
            } catch (error) {
                // console.error('Error fetching vendors:', error);
                setError('Error fetching vendors');
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, [searchQuery]); // Depend on searchQuery so it refetches when the query changes


    const handleRowClick = async (vendorId) => {
        try {
            const [vendorResponse, ordersResponse, adsResponse, reviewsResponse] = await Promise.all([
                fetch(`https://carboncube-ke-rails-cu22.onrender.com/admin/vendors/${vendorId}`, {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                }),
                fetch(`https://carboncube-ke-rails-cu22.onrender.com/admin/vendors/${vendorId}/orders`, {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                }),
                fetch(`https://carboncube-ke-rails-cu22.onrender.com/admin/vendors/${vendorId}/ads`, {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                }),
                fetch(`https://carboncube-ke-rails-cu22.onrender.com/admin/vendors/${vendorId}/reviews`, {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                })
            ]);
    
            if (!vendorResponse.ok || !ordersResponse.ok || !adsResponse.ok || !reviewsResponse.ok) {
                throw new Error('Network response was not ok');
            }
    
            const vendorData = await vendorResponse.json();
            const ordersData = await ordersResponse.json();
            const adsData = await adsResponse.json();
            const reviewsData = await reviewsResponse.json();
            const analytics = await fetchVendorAnalytics(vendorId);
    
            setSelectedVendor({ ...vendorData, orders: ordersData, ads: adsData, reviews: reviewsData, analytics });
            setSelectedTab('profile');
            setShowModal(true);
        } catch (error) {
            // console.error('Error fetching vendor details:', error);
        }
    };
    


    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedVendor(null);
    };

    const handleUpdateStatus = async (vendorId, status) => {
        try {
            const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/admin/vendors/${vendorId}/${status}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
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
            // console.error('Error updating vendor status:', error);
        }
    };

    const fetchVendorAnalytics = async (vendorId) => {
        try {
            const response = await fetch(`https://carboncube-ke-rails-cu22.onrender.com/admin/vendors/${vendorId}/analytics`, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            // console.error('Error fetching vendor analytics:', error);
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
                        <Col xs={12} md={10} lg={9} className="p-0">
                            {/* <h2 className="mb-4 text-center">Vendors Management</h2> */}
                            <Card className="section"> 
                                <Card.Header className="text-center orders-header p-1 p-lg-2">
                                    <Container fluid>
                                        <Row className="d-flex flex-row flex-md-row justify-content-between align-items-center">
                                            <Col xs="auto" className="d-flex align-items-center mb-0 mb-md-0 text-center ms-3 ps-4">
                                                <h4 className="mb-0 align-self-center">Vendors</h4>
                                            </Col>
                                            <Col xs="auto" className="d-flex align-items-center">
                                                <div className="search-container d-flex align-items-center">
                                                    <Form>
                                                        <Form.Group controlId="searchPhoneNumberOrID">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Search (Vendor ID)"
                                                                className="form-control"
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
                                <Card.Body className="p-2 table-container">
                                    <div className="table-responsive orders-table-container">
                                    <Table hover className="orders-table text-center">
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
                                    </div>
                                    
                                </Card.Body>
                                <Card.Footer>

                                </Card.Footer>
                            </Card>

                            <Modal centered show={showModal} onHide={handleCloseModal} size="xl">
                                <Modal.Header className="justify-content-center p-1 p-lg-1">
                                    <Modal.Title>Vendor Info</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="m-0 p-1">
                                    {selectedVendor ? (
                                        <Tabs
                                            activeKey={selectedTab}
                                            onSelect={(key) => setSelectedTab(key)}
                                            id="vendor-details-tabs"
                                            className="custom-tabs mb-0 mb-lg-2 mx-1 mx-lg-4 d-flex justify-content-between flex-row nav-justified mt-2"
                                            style={{ gap: '10px' }}
                                            >
                                            <Tab eventKey="profile" title="Profile">
                                                {/* <h5 className="text-center">Profile</h5> */}
                                                <Container className="profile-cards text-center">
                                                    <Row>
                                                        <Col xs={12} md={6} className="px-1 px-lg-2">
                                                            <Card className="mb-2 custom-card">
                                                                <Card.Header as="h6" className="justify-content-center">Name</Card.Header>
                                                                <Card.Body className="text-center">
                                                                    {selectedVendor.fullname}
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                        <Col xs={12} md={6} className="px-1 px-lg-2">
                                                            <Card className="mb-2 custom-card">
                                                                <Card.Header as="h6" className="justify-content-center">Email</Card.Header>
                                                                <Card.Body className="text-center">
                                                                    {selectedVendor.email}
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs={12} md={6} className="px-1 px-lg-2">
                                                            <Card className="mb-2 custom-card">
                                                                <Card.Header as="h6" className="justify-content-center">Phone</Card.Header>
                                                                <Card.Body className="text-center">
                                                                    {selectedVendor.phone_number}
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                        <Col xs={12} md={6} className="px-1 px-lg-2">
                                                            <Card className="mb-2 custom-card">
                                                                <Card.Header as="h6" className="justify-content-center">Enterprise</Card.Header>
                                                                <Card.Body className="text-center">
                                                                    {selectedVendor.enterprise_name}
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs={12} md={6} className="px-1 px-lg-2">
                                                            <Card className="mb-2 custom-card">
                                                                <Card.Header as="h6" className="justify-content-center">Location</Card.Header>
                                                                <Card.Body className="text-center">
                                                                    {selectedVendor.location}
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                        <Col xs={12} md={6} className="px-1 px-lg-2">
                                                            <Card className="mb-2 custom-card">
                                                                <Card.Header as="h6" className="justify-content-center">Status</Card.Header>
                                                                <Card.Body className="text-center">
                                                                <span className={selectedVendor.blocked ? 'text-danger' : 'text-success'}>
                                                                    {selectedVendor.blocked ? 'Blocked' : 'Active'}
                                                                </span>
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs={12} className="px-1 px-lg-2">
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
                                                            <Col xs={6} md={6} className="px-1 px-lg-2">
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Total Ads</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        {selectedVendor.analytics.total_ads}
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                            <Col xs={6} md={6} className="px-1 px-lg-2">
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Total Ads Wishlisted</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        {selectedVendor.analytics.total_ads_wishlisted}
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col xs={6} md={6}  className="px-1 px-lg-2">
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Mean Rating</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        <StarRating rating={selectedVendor.analytics.mean_rating} />
                                                                        <p className='m-0'>{selectedVendor.analytics.mean_rating}/5</p>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                            <Col xs={6} md={6} className="px-1 px-lg-2">
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Total Reviews</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        {selectedVendor.analytics.total_reviews}
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col xs={12} md={6} className="px-1 px-lg-2">
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Click Events Breakdown</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        <div style={{ width: "200px", height: "200px", margin: "0 auto" }}>
                                                                            <Doughnut
                                                                                data={{
                                                                                    labels: ["Ad Clicks", "Add to Wish List", "Reveal Vendor Details"],
                                                                                    datasets: [
                                                                                        {
                                                                                            label: "Click Events",
                                                                                            data: [
                                                                                                selectedVendor.analytics.ad_clicks,
                                                                                                selectedVendor.analytics.add_to_wish_list,
                                                                                                selectedVendor.analytics.reveal_vendor_details
                                                                                            ],
                                                                                            backgroundColor: ['#919191', '#FF9800', '#363636']
                                                                                        }
                                                                                    ]
                                                                                }}
                                                                                options={{
                                                                                    cutout: '70%',
                                                                                    responsive: true,
                                                                                    maintainAspectRatio: false,
                                                                                    plugins: {
                                                                                        legend: { display: false } // Hide default legend
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        {/* Custom Legend */}
                                                                        <div style={{
                                                                            display: "flex",
                                                                            justifyContent: "center",
                                                                            gap: "15px",
                                                                            marginTop: "10px",
                                                                            whiteSpace: "nowrap"
                                                                        }}>
                                                                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                                                <span style={{ width: "12px", height: "12px", backgroundColor: "#919191", borderRadius: "50%" }}></span>
                                                                                <span>Ad Clicks</span>
                                                                            </div>
                                                                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                                                <span style={{ width: "12px", height: "12px", backgroundColor: "#FF9800", borderRadius: "50%" }}></span>
                                                                                <span>Add to Wish List</span>
                                                                            </div>
                                                                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                                                <span style={{ width: "12px", height: "12px", backgroundColor: "#363636", borderRadius: "50%" }}></span>
                                                                                <span>Reveal Vendor Details</span>
                                                                            </div>
                                                                        </div>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>

                                                            <Col xs={12} md={6} className="px-1 px-lg-2">
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Rating Distribution</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        <Bar
                                                                            data={{
                                                                                labels: ["1★", "2★", "3★", "4★", "5★"],
                                                                                datasets: [
                                                                                    {
                                                                                        label: "No. of Ratings",
                                                                                        data: selectedVendor.analytics.rating_pie_chart.map(r => r.count),
                                                                                        backgroundColor: "#FF9800"
                                                                                    }
                                                                                ]
                                                                            }}
                                                                            options={{
                                                                                responsive: true,
                                                                                scales: {
                                                                                    y: { beginAtZero: true }
                                                                                }
                                                                            }}
                                                                        />
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col xs={12} md={6} className="px-1 px-lg-2">
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Most Clicked Ad</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        {selectedVendor.analytics.most_clicked_ad ? (
                                                                            <>
                                                                                <p className="m-0"><strong>{selectedVendor.analytics.most_clicked_ad.title}</strong></p>
                                                                                <p className="text-muted">Total Clicks: {selectedVendor.analytics.most_clicked_ad.total_clicks}</p>
                                                                                {/* <p className="text-muted">Category: {selectedVendor.analytics.most_clicked_ad.category}</p> */}
                                                                            </>
                                                                        ) : (
                                                                            <p>No Click Data Available</p>
                                                                        )}
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>

                                                            <Col xs={12} md={6} className="px-1 px-lg-2">
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Vendor Insights</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        <p className="m-0">Category: {selectedVendor.analytics.vendor_category}</p>
                                                                        <p className="m-0">Last Ad Posted: {selectedVendor.analytics.last_ad_posted_at ? new Date(selectedVendor.analytics.last_ad_posted_at).toLocaleDateString() : "N/A"}</p>
                                                                        <p className="m-0">Account Age: {selectedVendor.analytics.account_age_days} days</p>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col xs={12} md={6} className="px-1 px-lg-2">
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Total Profile Views</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        {selectedVendor.analytics.total_profile_views}
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                            <Col xs={12} md={6} className="px-1 px-lg-2">
                                                                <Card className="mb-2 custom-card">
                                                                    <Card.Header as="h6" className="justify-content-center">Vendor Engagement Rank</Card.Header>
                                                                    <Card.Body className="text-center">
                                                                        {selectedVendor.analytics.ad_performance_rank || "N/A"}
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
                                                <div className='section mt-1 mx-2 custom-card-vendor'>
                                                    <div className='table-container'>
                                                        <div className="table-responsive orders-table-container">
                                                            <Table hover className="orders-table text-center transparent-table transparent-table-striped">
                                                                <thead className='table-head'>
                                                                    <tr>
                                                                        <th>Order ID</th>
                                                                        <th>Purchaser</th>
                                                                        <th>Ad</th>
                                                                        <th>Quantity</th>                                                                        
                                                                        <th>Total <em className='ad-price-label' style={{ fontSize: '13px' }}>(Kshs:) </em></th>
                                                                        <th>Date Ordered</th>
                                                                        <th>Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {selectedVendor && selectedVendor.orders && selectedVendor.orders.length > 0 ? (
                                                                        selectedVendor.orders.map((order) => (
                                                                            order.order_items.map((item) => (
                                                                                <tr key={`${order.id}-${item.ad.id}`}>
                                                                                    <td>{order.id}</td>
                                                                                    <td>{order.purchaser.fullname}</td>
                                                                                    <td>{item.ad.title}</td>
                                                                                    <td>{item.quantity}</td>
                                                                                    
                                                                                    <td className="price-container">
                                                                                        <strong className="text-success">
                                                                                            {((item.quantity * item.ad.price).toFixed(2)).split('.').map((part, index) => (
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
                                                                                    <td onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
                                                                                        <Form.Control
                                                                                            className="form-select-admin text-center" // Custom class for removing arrow
                                                                                            as="select"
                                                                                            value={order.status}
                                                                                            id="button"
                                                                                            disabled
                                                                                            style={{
                                                                                                verticalAlign: 'middle',
                                                                                                display: 'inline-block',
                                                                                                width: '60%',
                                                                                                height: '40px', // Adjust the height to your preference
                                                                                                backgroundColor: 
                                                                                                    order.status === 'Cancelled' ? '#FF0000' :  // Red
                                                                                                    order.status === 'Dispatched' ? '#007BFF' : // Blue
                                                                                                    order.status === 'In-Transit' ? '#80CED7' : // Light Blue
                                                                                                    order.status === 'Returned' ? '#6C757D' :  // Grey
                                                                                                    order.status === 'Processing' ? '#FFC107' : // Yellow
                                                                                                    order.status === 'Delivered' ? '#008000' : '', // Green
                                                                                                color: ['Delivered', 'Returned', 'Dispatched', 'Cancelled'].includes(order.status) 
                                                                                                    ? 'white' : 'black', // White text for specific statuses
                                                                                                
                                                                                            }}
                                                                                        >
                                                                                            <option value={order.status}>{order.status}</option>
                                                                                        </Form.Control>
                                                                                    </td>
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
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab>                                           

                                            <Tab eventKey="ads" title="Ads">
                                                <div className="card-container">
                                                    {selectedVendor.ads && selectedVendor.ads.length > 0 ? (
                                                        <Row>
                                                            {selectedVendor.ads.map((ad) => (
                                                                <Col key={ad.id} xs={6} md={12} lg={3} className="mb-2 px-1">
                                                                    <Card className="ad-card-vendor">
                                                                        <Card.Img
                                                                            className="analytics-card-img-top ad-image"
                                                                            variant="top"
                                                                            src={ad.media_urls && ad.media_urls.length > 0 ? ad.media_urls[0] : 'default-image-url'}
                                                                        />
                                                                        <Card.Body className='p-2'>
                                                                            <Card.Title className="mb-0 ad-title" style={{ fontSize: '18px' }}>{ad.title}</Card.Title>
                                                                            <Card.Text className="price-container">
                                                                                <span><em className='ad-price-label text-success'>Kshs: </em></span>
                                                                                <strong className='text-danger'>
                                                                                    {ad.price ? parseFloat(ad.price).toFixed(2).split('.').map((part, index) => (
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
                                                                        </Card.Body>
                                                                    </Card>
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                    ) : (
                                                        <p className="text-center">No ads available</p>
                                                    )}
                                                </div>
                                            </Tab>


                                            <Tab eventKey="reviews" title="Reviews">
                                                {/* <h5 className="text-center" id="reviews">Reviews</h5> */}
                                                {selectedVendor.reviews && selectedVendor.reviews.length > 0 ? (
                                                    <Row>
                                                    {selectedVendor.reviews.map((review) => (
                                                        <Col lg={6} key={review.id} className=" justify-content-center">
                                                        <div className="reviews-container text-center p-0 p-lg-2 ">
                                                            <div className="review-card p-1">
                                                            <p className="review-comment"><em>"{review.review}"</em></p>
                                                            <StarRating rating={review.rating} /> {/* Assuming StarRating component is defined elsewhere */}
                                                            <p className="review-ad"><strong>{review.ad_title}</strong></p>
                                                            <p className="reviewer-name"><strong><em>{review.purchaser_name}</em></strong></p>
                                                            </div>
                                                        </div>
                                                        </Col>
                                                    ))}
                                                    </Row>
                                                ) : (
                                                    <p className="text-center">No reviews available</p>
                                                )}
                                            </Tab>

                                        </Tabs>
                                    ) : (
                                        <p>Loading...</p>
                                    )}
                                </Modal.Body>
                                <Modal.Footer className="p-1 p-lg-1">
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
