import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Container, Row, Col, Form, Card } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import Spinner from "react-spinkit";
import './OrdersManagement.css';  // Custom CSS

const OrdersManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:3000/admin/orders?phone_number=${phoneNumber}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                data.sort((a, b) => a.id - b.id);
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Error fetching orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [phoneNumber]);

    const handleRowClick = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/orders/${orderId}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
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

    const handleUpdateStatus = async (orderId, status) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/orders/${orderId}/on-transit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const updatedOrder = await response.json();
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    (order.id === orderId ? updatedOrder : order)
                )
            );
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        } catch (error) {
            console.error('Error deleting order:', error);
        }
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
            <div className="orders-management-page">
                <Container fluid className="p-0">
                    <Row>
                        <Col xs={12} md={2} className="p-0">
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={10} className="p-4">
                            <Card className="section">
                                <Card.Header className="text-center justify-content-center">
                                    Orders
                                </Card.Header>
                                <Card.Body>

                                <Row className="justify-content-center">
                                <Col xs={12} md={12} lg={12} className="mb-3 pt-3">
                                    <div className="search-container d-flex justify-content-center">
                                        <Form className="mb-3">
                                            <Form.Group controlId="searchPhoneNumber">
                                                {/* <Form.Label>Search by Purchaser Phone Number</Form.Label> */}
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Search Purchaser order by Phone Number"
                                                    id="button"
                                                    className='form-control'
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </div>                                    
                                </Col>
                                </Row>
                                
                                    
                                    <Table hover className="orders-table text-center">
                                        <thead className="table-header">
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Purchaser</th>
                                                <th>Products</th>
                                                <th>Quantity</th>
                                                <th>Total</th>
                                                <th>Date Ordered</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.length > 0 ? (
                                            orders.map((order) => (
                                                <tr
                                                key={order.id}
                                                onClick={(e) => {
                                                    if (e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON') return; // Prevent modal opening on status change or delete button click
                                                    handleRowClick(order.id);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                                >
                                                <td>{order.id}</td>
                                                <td>{order.purchaser?.fullname || 'Unknown'}</td>
                                                <td>{order.order_items.map(item => item.product?.title || 'Unknown').join(', ')}</td>
                                                <td>{order.order_items.map(item => item.quantity || 0).reduce((a, b) => a + b, 0)}</td>
                                                <td className="price-container">
                                                    <em className="product-price-label">Kshs: </em>
                                                    <strong>
                                                    {order.total_price ? order.total_price.split('.').map((part, index) => (
                                                        <React.Fragment key={index}>
                                                            {index === 0 ? (
                                                                <span className="price-integer">{part}</span>
                                                            ) : (
                                                                <>
                                                                    <span style={{ fontSize: '16px' }}>.</span>
                                                                    <span className="price-decimal">{part}</span>
                                                                </>
                                                            )}
                                                        </React.Fragment>
                                                    )) : 'N/A'}
                                                    </strong>
                                                </td>
                                                <td>{order.order_date || 'N/A'}</td>
                                                <td>
                                                    <Form.Control
                                                    className="form-select align-middle"                                        as="select"
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                    id="button"
                                                    style={{
                                                        verticalAlign: 'middle',
                                                        backgroundColor: order.status === 'on-transit' ? 'limegreen' : '#FFC107',
                                                    }}
                                                    >
                                                    <option className="text-center" value="processing">Processing</option>
                                                    <option className="text-center" value="on-transit">On-Transit</option>
                                                    </Form.Control>
                                                </td>
                                                <td>
                                                    <button
                                                    className="btn btn-link p-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteOrder(order.id);
                                                    }}
                                                    title="Delete Order"
                                                    >
                                                    <Trash className="text-danger" />
                                                    </button>
                                                </td>
                                                </tr>
                                            ))
                                            ) : (
                                            <tr>
                                                <td colSpan="8">No data available</td>
                                            </tr>
                                            )}
                                        </tbody>
                                        </Table>
                                </Card.Body>
                                <Card.Footer>
                                </Card.Footer>
                            </Card>
                            
                            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                                <Modal.Header>
                                    <Modal.Title>Order Details</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {selectedOrder ? (
                                        <>
                                            <Row>
                                                <Col xs={12} md={6} >
                                                    <Card className="mb-2 custom-card">
                                                        <Card.Header as="h6" className='justify-content-center'>Order ID</Card.Header>
                                                        <Card.Body className='text-center'>
                                                            {selectedOrder.id}
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Card className="mb-2 custom-card">
                                                        <Card.Header as="h6" className='justify-content-center'>Purchaser</Card.Header>
                                                        <Card.Body className='text-center'>
                                                            {selectedOrder.purchaser?.fullname || 'Unknown'}
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        
                                            <Row>
                                                <Col xs={12} md={6}>
                                                    <Card className="mb-2 custom-card">
                                                        <Card.Header as="h6" className='justify-content-center'>Date Ordered</Card.Header>
                                                        <Card.Body className='text-center'>
                                                            {selectedOrder.order_date || 'N/A'}
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Card className="mb-2 custom-card">
                                                        <Card.Header as="h6" className='justify-content-center'>Total Price (Kshs)</Card.Header>
                                                        <Card.Body className="price-container text-center">
                                                            <strong>
                                                                <span className="price">
                                                                    {selectedOrder.total_price ? selectedOrder.total_price.split('.').map((part, index) => (
                                                                        <React.Fragment key={index}>
                                                                            {index === 0 ? (
                                                                                <span className="price-integer">{part}</span>
                                                                            ) : (
                                                                                <>
                                                                                    <span style={{ fontSize: '16px' }}>.</span>
                                                                                    <span className="price-decimal">{part}</span>
                                                                                </>
                                                                            )}
                                                                        </React.Fragment>
                                                                    )) : '0'}
                                                                </span>
                                                            </strong>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        
                                            <h4 className="text-center mt-2">Products</h4>
                                            <div className="product-container text-center">
                                                <div className="table-responsive">
                                                    <Table bordered hover>
                                                        <thead className='table-head'>
                                                            <tr>
                                                                <th>Product Name</th>
                                                                <th>Vendor</th>
                                                                <th>Quantity</th>
                                                                <th>Price</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                                                                selectedOrder.order_items.map(item => (
                                                                    <tr key={item.product?.id || 'unknown'}>
                                                                        <td>{item.product?.title || 'Unknown'}</td>
                                                                        <td>{item.product?.vendor?.fullname || 'Unknown'}</td>
                                                                        <td>{item.quantity || '0'}</td>
                                                                        <td className="price-container">
                                                                            <em className="product-price-label">Kshs: </em>
                                                                            <strong>
                                                                                <span className="price">
                                                                                    {item.product?.price && item.quantity ? (
                                                                                        (item.product.price * item.quantity).toFixed(2).split('.').map((part, index) => (
                                                                                            <React.Fragment key={index}>
                                                                                                {index === 0 ? (
                                                                                                    <span className="price-integer">{part}</span>
                                                                                                ) : (
                                                                                                    <>
                                                                                                        <span style={{ fontSize: '16px' }}>.</span>
                                                                                                        <span className="price-decimal">{part}</span>
                                                                                                    </>
                                                                                                )}
                                                                                            </React.Fragment>
                                                                                        ))
                                                                                    ) : '0.00'}
                                                                                </span>
                                                                            </strong>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="4">No products available</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <p>No details available</p>
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

export default OrdersManagement;
