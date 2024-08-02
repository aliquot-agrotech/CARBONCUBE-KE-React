import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import './OrdersManagement.css';  // Custom CSS

const OrdersManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/orders', {
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
    }, []);

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
            console.log('Updated Order:', updatedOrder); // Debug log
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    (order.id === orderId ? updatedOrder : order)
                )
            );
        } catch (error) {
            console.error('Error updating order status:', error);
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
            <div className="orders-management-page">
                <Container fluid className="p-0">
                    <Row>
                        <Col xs={12} md={2} className="p-0">
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={10} className="p-4">
                            {/* <h2 className="mb-4 text-center">Orders Management</h2> */}
                            <Table hover className="orders-table text-center">
                                <thead className="table-header">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Products</th>
                                        <th>Quantity</th>
                                        <th>Total (Kshs)</th>
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
                                                    if (e.target.tagName === 'SELECT') return; // Prevent modal opening on status change
                                                    handleRowClick(order.id);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td>{order.id}</td>
                                                <td>{order.purchaser?.fullname || 'Unknown'}</td>
                                                <td>{order.order_items.map(item => item.product?.title || 'Unknown').join(',  ')}</td>
                                                <td>{order.order_items.map(item => item.quantity || 0).reduce((a, b) => a + b, 0)}</td>
                                                <td>{order.total_price || 'N/A'}</td>
                                                <td>{order.order_date || 'N/A'}</td>
                                                <td>
                                                    <Form.Control
                                                        className="form-select"
                                                        as="select"
                                                        value={order.status}
                                                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                        id="button"
                                                        style={{ verticalAlign: 'middle',
                                                            backgroundColor: order.status === 'on-transit' ? 'limegreen' : '#FFC107',
                                                        }}      >
                                                        <option className="text-center" value="processing">Processing</option>
                                                        <option className="text-center" value="on-transit">On-Transit</option>
                                                    </Form.Control>
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
                                    <Modal.Title>Order Details</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {selectedOrder ? (
                                        <div>
                                            <div className="order-details mb-4 text-center">
                                                <div className="order-detail-item">
                                                    <strong>Order ID:</strong> {selectedOrder.id}
                                                </div>
                                                <div className="order-detail-item">
                                                    <strong>Purchaser:</strong> {selectedOrder.purchaser?.fullname || 'Unknown'}
                                                </div>
                                                <div className="order-detail-item">
                                                    <strong>Date Ordered:</strong> {selectedOrder.order_date || 'N/A'}
                                                </div>
                                                <div className="order-detail-item">
                                                    <strong>Total:</strong> Ksh {selectedOrder.total_price || '0'}
                                                </div>
                                            </div>
                                            <h4 className='text-center'>Products</h4>
                                            <div className="product-container text-center">
                                                <div className="table-responsive">
                                                    <Table bordered hover>
                                                        <thead>
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
                                                                        <td>Ksh {item.product?.price * item.quantity || '0'}</td>
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
                                        </div>
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

export default OrdersManagement;
