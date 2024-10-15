import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Container, Row, Col, Form, Card, Spinner } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import consumer from "../cable"; // Import ActionCable consumer

const VendorOrders = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const vendorId = sessionStorage.getItem('vendorId');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`https://carboncube-ke-rails-7ty3.onrender.com/vendor/orders?vendor_id=${vendorId}&search_query=${searchQuery}`, {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setOrders(data);
            } catch (error) {
                setError('Error fetching orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        // Subscribe to the orders channel for real-time updates
        const subscription = consumer.subscriptions.create("OrdersChannel", {
            received: (data) => {
                const updatedOrder = data.order;
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === updatedOrder.id ? updatedOrder : order
                    )
                );
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [searchQuery, vendorId]);

    const handleRowClick = async (orderId) => {
        try {
            const response = await fetch(`https://carboncube-ke-rails-7ty3.onrender.com/vendor/orders/${orderId}`, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Fetched order details:', data);
            setSelectedOrder(data);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    // const handleUpdateStatus = async (orderId, status) => {
    //     try {
    //         const response = await fetch(`https://carboncube-ke-rails-7ty3.onrender.com/vendor/orders/${orderId}/update_status`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    //             },
    //             body: JSON.stringify({ status }),
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const updatedOrder = await response.json();
    //         console.log('Updated order:', updatedOrder);

    //         setOrders(prevOrders =>
    //             prevOrders.map(order =>
    //                 order.id === orderId ? updatedOrder : order
    //             )
    //         );
    //     } catch (error) {
    //         console.error('Error updating order status:', error);
    //     }
    // };

    // const handleStatusChange = (orderId, event) => {
    //     event.stopPropagation();
    //     handleUpdateStatus(orderId, event.target.value);
    // };

    // const getStatusColor = (status) => {
    //     switch (status) {
    //         case 'On-Transit':
    //             return 'limegreen';
    //         case 'Delivered':
    //             return '#28A745';
    //         default:
    //             return '#E9ECEF';
    //     }
    // };

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
            <div className="orders-management-page">
                <Container fluid className="p-0">
                    <Row>
                        <Col xs={12} md={2} className="p-0">
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={10} className="p-2">
                            <Card className="section">
                                <Card.Header className="text-center">
                                    <Container fluid>
                                        <Row className="justify-content-between align-items-center">
                                            <Col xs={12} md={4} className="text-center">
                                                <h3 className="mb-0">Orders</h3>
                                            </Col>
                                            <Col xs={12} md={8}>
                                                <div className="search-container text-center">
                                                    <Form>
                                                        <Form.Group controlId="searchPhoneNumberOrID">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Search (Order ID)"
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

                                <Card.Body className="p-0">
                                    <Table hover className="orders-table text-center">
                                        <thead className="table-header">
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Products</th>
                                                <th>Quantity</th>
                                                <th>Total<em className="product-price-label" style={{ fontSize: '14px' }}> (Kshs:) </em></th>
                                                <th>Date Ordered</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.length > 0 ? (
                                                orders.map((order) => (
                                                    <tr
                                                        key={order.id}
                                                        onClick={(e) => {
                                                            if (e.target.tagName !== 'SELECT' && e.target.tagName !== 'OPTION') {
                                                                handleRowClick(order.id);
                                                            }
                                                        }}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <td>{order.id}</td>
                                                        <td>
                                                            {order.order_items
                                                                .slice(0, 3) // Limit to the first 3 products
                                                                .map((item, index, array) => {
                                                                const productTitle = item.product_title || 'Unknown';
                                                                // Limit the product title to 3 words
                                                                const truncatedTitle = productTitle.split(' ').slice(0, 3).join(' ');
                                                                // Add a comma after each item except the last one
                                                                return `${truncatedTitle}${index < array.length - 1 ? ',' : ''}`;
                                                                })
                                                                .join(' ')}
                                                            {order.order_items.length > 3 && '...'} {/* Add ellipsis if more than 3 products */}
                                                        </td>

                                                        <td>{order.order_items.map(item => item.quantity || 0).reduce((a, b) => a + b, 0)}</td>
                                                        <td className="price-container">
                                                            <strong>
                                                                {order.total_price ? (
                                                                    parseFloat(order.total_price).toFixed(2).split('.').map((part, index) => (
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
                                                                ) : 'N/A'}
                                                            </strong>
                                                        </td>
                                                        <td>{order.order_date || 'N/A'}</td>
                                                        <td onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
                                                            <Form.Control
                                                                className="form-select text-center no-arrow" // Custom class for removing arrow
                                                                as="select"
                                                                value={order.status}
                                                                id="button"
                                                                disabled // Disables the dropdown for the vendor
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
                                                                    cursor: 'not-allowed',
                                                                    pointerEvents: 'none',
                                                                    textAlign: 'center', // Center text horizontally
                                                                    lineHeight: '40px', // Match line height to height for vertical centering
                                                                    padding: '0', // Remove padding for perfect centering
                                                                }}
                                                            >
                                                                <option value={order.status}>{order.status}</option>
                                                            </Form.Control>
                                                        </td>
                                                        <style jsx>{`
                                                            .no-arrow {
                                                                appearance: none; /* Hide the default dropdown arrow */
                                                                -webkit-appearance: none; /* For WebKit browsers */
                                                                background-image: none; /* Remove any default background image */
                                                            }
                                                        `}</style>
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
                                    <Modal.Title>Order Details</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {selectedOrder ? (
                                        <>
                                            <Row>
                                                <Col xs={12} md={6}>
                                                    <Card className="mb-2 custom-card">
                                                        <Card.Header as="h6" className='text-center'>Order ID</Card.Header>
                                                        <Card.Body className='text-center'>
                                                            {selectedOrder.id}
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Card className="mb-2 custom-card">
                                                        <Card.Header as="h6" className='text-center'>Date Ordered</Card.Header>
                                                        <Card.Body className='text-center'>
                                                            {selectedOrder.order_date || 'N/A'}
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <Card className="mb-2 custom-card-vendor">
                                                        <Card.Header as="h6" className='text-center'>Products</Card.Header>
                                                        <Card.Body>
                                                            {selectedOrder?.order_items?.length > 0 ? (
                                                                <Table className="transparent-table transparent-table-striped justify-content-start" style={{ backgroundColor: 'transparent' }}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Product</th>
                                                                            <th>Quantity</th>
                                                                            <th>Price <span style={{ fontSize: '14px' }}>(@ item)</span></th>
                                                                            <th>Product Total</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {selectedOrder.order_items.map(item => (
                                                                            <tr key={item.id}>
                                                                                <td>{item.product_title || 'Unknown Product'}</td>
                                                                                <td>{item.quantity}</td>
                                                                                <td>
                                                                                {item.price ? (
                                                                                    parseFloat(item.price).toFixed(2).split('.').map((part, index) => (
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
                                                                                ) : 'N/A'}
                                                                                </td>
                                                                                <td >
                                                                                    {(item.price && item.quantity) ? 
                                                                                        (item.price * item.quantity).toFixed(2).split('.').map((part, index) => (
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
                                                                                        )) : 'N/A'
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr>
                                                                            <td colSpan="3"><strong>Order Total:</strong></td>
                                                                            <td>
                                                                            <strong>
                                                                                {selectedOrder?.order_items?.length > 0 ? (
                                                                                    selectedOrder.order_items.reduce((acc, item) => {
                                                                                        const itemTotalPrice = (item.price || 0) * (item.quantity || 0);
                                                                                        return acc + itemTotalPrice;
                                                                                    }, 0).toFixed(2).split('.').map((part, index) => (
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
                                                                                ) : 'N/A'}
                                                                            </strong>
                                                                                
                                                                            </td>
                                                                        </tr>
                                                                    </tfoot>
                                                                </Table>
                                                            ) : (
                                                                <p>No products available</p>
                                                            )}
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </>
                                    ) : (
                                        <p>No order details available.</p>
                                    )}
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button variant="danger" onClick={handleCloseModal}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default VendorOrders;
