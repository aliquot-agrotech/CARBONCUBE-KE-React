import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Container, Row, Col, Tabs, Tab, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faKey } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import './VendorsManagement.css';  // Custom CSS

const VendorsManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('profile');

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/vendors', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
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
    }, []);

    const handleRowClick = async (vendorId) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/vendors/${vendorId}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const analytics = await fetchVendorAnalytics(vendorId);
            setSelectedVendor({ ...data, analytics });
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

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching vendor analytics:', error);
            return {};
        }
    };

    if (loading) {
        return <div>Loading...</div>;
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
                        <Col xs={12} md={10} className="p-4">
                            <h2 className="mb-4 text-center">Vendors Management</h2>
                            <Table hover className="vendors-table text-center">
                                <thead>
                                    <tr>
                                        <th>Vendor ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
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
                                                <td>{vendor.email}</td>
                                                <td>{vendor.phone_number}</td>
                                                <td>{vendor.enterprise_name}</td>
                                                <td>{vendor.location}</td>
                                                <td>
                                                    <Button
                                                        variant={vendor.blocked ? 'danger' : 'warning'}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleUpdateStatus(vendor.id, vendor.blocked ? 'unblock' : 'block');
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={vendor.blocked ? faKey : faUserShield} />
                                                        {vendor.blocked ? ' Unblock' : ' Block'}
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

                            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                                <Modal.Header closeButton>
                                    <Modal.Title>Vendor Details</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {selectedVendor ? (
                                        <Tabs
                                            activeKey={selectedTab}
                                            onSelect={(key) => setSelectedTab(key)}
                                            id="vendor-details-tabs"
                                            className="custom-tabs mb-3"
                                        >
                                            <Tab eventKey="profile" title="Profile">
                                                <div className="profile-cards text-center">
                                                    <div className="profile-card">
                                                        <p><strong>Name:</strong> {selectedVendor.fullname}</p>
                                                    </div>
                                                    <div className="profile-card">
                                                        <p><strong>Email:</strong> {selectedVendor.email}</p>
                                                    </div>
                                                    <div className="profile-card">
                                                        <p><strong>Phone:</strong> {selectedVendor.phone_number}</p>
                                                    </div>
                                                    <div className="profile-card">
                                                        <p><strong>Enterprise:</strong> {selectedVendor.enterprise_name}</p>
                                                    </div>
                                                    <div className="profile-card">
                                                        <p><strong>Location:</strong> {selectedVendor.location}</p>
                                                    </div>
                                                    <div className="profile-card">
                                                        <p><strong>Status:</strong> {selectedVendor.blocked ? 'Blocked' : 'Active'}</p>
                                                    </div>
                                                    <div className="profile-card">
                                                        <p><strong>Categories:</strong> {selectedVendor.category_names.join(', ')}</p>
                                                    </div>
                                                </div>
                                            </Tab>

                                            <Tab eventKey="analytics" title="Analytics">
                                                <h5>Analytics</h5>
                                                {selectedVendor.analytics ? (
                                                    <div>
                                                        <Row className="mt-4">
                                                            <Col md={6}>
                                                                <Card className="text-center mb-4">
                                                                    <Card.Body>
                                                                        <Card.Title>Total Orders</Card.Title>
                                                                        <Card.Text>
                                                                            {selectedVendor.analytics.total_orders}
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Card className="text-center mb-4">
                                                                    <Card.Body>
                                                                        <Card.Title>Total Products Sold</Card.Title>
                                                                        <Card.Text>
                                                                            {selectedVendor.analytics.total_products_sold}
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                        <Row className="mt-4">
                                                            <Col md={6}>
                                                                <Card className="text-center mb-4">
                                                                    <Card.Body>
                                                                        <Card.Title>Mean Rating</Card.Title>
                                                                        <Card.Text>
                                                                            {selectedVendor.analytics.mean_rating}
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Card className="text-center mb-4">
                                                                    <Card.Body>
                                                                        <Card.Title>Total Revenue</Card.Title>
                                                                        <Card.Text>
                                                                            {selectedVendor.analytics.total_revenue}
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                        <Row className="mt-4">
                                                            <Col md={12}>
                                                                <Card className="text-center mb-4">
                                                                    <Card.Body>
                                                                        <Card.Title>Total Reviews</Card.Title>
                                                                        <Card.Text>
                                                                            {selectedVendor.analytics.total_reviews}
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                ) : (
                                                    <p>No analytics data available</p>
                                                )}
                                            </Tab>
                                            <Tab eventKey="orders" title="Orders">
                                                <div>
                                                    <h5>Orders</h5>
                                                </div>
                                            </Tab>
                                            <Tab eventKey="reviews" title="Reviews">
                                                <div>
                                                    <h5>Reviews</h5>
                                                </div>
                                            </Tab>
                                            <Tab eventKey="products" title="Products">
                                                <div>
                                                    <h5>Products</h5>
                                                    {selectedVendor.products && selectedVendor.products.length > 0 ? (
                                                        selectedVendor.products.map(product => (
                                                            <Card key={product.id} className="product-card">
                                                                <Card.Img variant="top" src={product.image_url} />
                                                                <Card.Body>
                                                                    <Card.Title>{product.title}</Card.Title>
                                                                    <Card.Text>
                                                                        Price: Ksh {product.price}
                                                                    </Card.Text>
                                                                </Card.Body>
                                                            </Card>
                                                        ))
                                                    ) : (
                                                        <p>No products available</p>
                                                    )}
                                                </div>
                                            </Tab>
                                        </Tabs>
                                    ) : (
                                        <p>No details available</p>
                                    )}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="warning" onClick={handleCloseModal}>
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
