import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Container, Row, Col, Form, Card, Spinner } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';

const VendorOrders = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    const vendorId = localStorage.getItem('vendorId'); // Fetch vendor ID from local storage or context

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:3000/vendor/orders?vendor_id=${vendorId}&search_query=${searchQuery}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });
        
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
        
                const data = await response.json();
                console.log('Fetched orders:', data); // Check structure and status
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
    }, [searchQuery, vendorId]);
    
    const handleRowClick = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:3000/vendor/orders/${orderId}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Fetched order details:', data); // Check structure
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
            const response = await fetch(`http://localhost:3000/vendor/orders/${orderId}`, {
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
            console.log('Updated order:', updatedOrder); // Check updated order status
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
        return (
            <div className="centered-loader">
                <Spinner animation="border" variant="warning" style={{ width: 100, height: 100 }} />
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
                                            <th>Total<em className="product-price-label">Kshs: </em></th>
                                            <th>Date Ordered</th>
                                            <th>Status</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {orders.length > 0 ? (
                                            orders.map((order) => (
                                            <tr
                                                key={order.id}
                                                onClick={() => handleRowClick(order.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td>{order.id}</td>
                                                <td>{order.order_items.map(item => item.product_title || 'Unknown').join(', ')}</td>
                                                <td>{order.order_items.map(item => item.quantity || 0).reduce((a, b) => a + b, 0)}</td>
                                                <td className="price-container">
                                                        <strong>
                                                            {order.total_price ? order.total_price.split('.').map((part, index) => (
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
                                                    </td>

                                                <td>{order.order_date || 'N/A'}</td>
                                                <td>
                                                <Form.Control
                                                    className="form-select align-middle"
                                                    as="select"
                                                    value={order.status}
                                                    id="button"
                                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                    style={{
                                                    verticalAlign: 'middle',
                                                    backgroundColor: order.status === 'on-transit' ? 'limegreen' : '#FFC107',
                                                    }}
                                                >
                                                    <option className="text-center" value="dispatch">Dispatch</option>
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
                                                    <Card className="mb-2 custom-card">
                                                        <Card.Header as="h6" className='text-center'>Products</Card.Header>
                                                        <Card.Body>
                                                            {selectedOrder?.order_items?.length > 0 ? (
                                                                selectedOrder.order_items.map(item => (
                                                                    <div key={item.id} className="mb-2">
                                                                        <strong>{item.product_title || 'Unknown Product'}:</strong> {item.quantity}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p>No products available</p>
                                                            )}
                                                        </Card.Body>
                                                    </Card>

                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={12}>
                                                        <Card className="mb-2 custom-card">
                                                            <Card.Header as="h6" className='text-center'>Total Price</Card.Header>
                                                            <Card.Body className='text-center'>
                                                                {selectedOrder?.order_items?.length > 0 ? (
                                                                    selectedOrder.order_items.map(item => (
                                                                        <div key={item.id} className="mb-2">
                                                                            <strong>{item.product_title || 'Unknown Product'}:</strong> 
                                                                            {item.quantity} x 
                                                                            {item.price ? item.price.split('.').map((part, index) => (
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
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p>No products available</p>
                                                                )}
                                                            </Card.Body>

                                                            <Card.Footer className='text-center'>
                                                                <h5>Total Price:</h5>
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
                                                                ) : (
                                                                    'N/A'
                                                                )}
                                                            </Card.Footer>
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
