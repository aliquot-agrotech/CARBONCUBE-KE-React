import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import './ShoppingCart.css';

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const [discountCode, setDiscountCode] = useState('');

    const fetchCartItems = useCallback(async () => {
        try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:3000/purchaser/cart_items", {
            headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.cart_items) {
            setCartItems(data.cart_items);
        } else {
            console.error("Invalid data format:", data);
        }
        } catch (error) {
        console.error("Error fetching cart items:", error);
        }
    }, []);

    const calculateTotals = useCallback(() => {
        const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const taxAmount = subTotal * 0.16; // 16% tax
        setSubtotal(subTotal);
        setTax(taxAmount);
        setTotal(subTotal + taxAmount);
    }, [cartItems]);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    useEffect(() => {
        calculateTotals();
    }, [calculateTotals]);

    const handleRemoveItem = async (itemId) => {
        try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:3000/purchaser/cart_items/${itemId}`, {
            method: 'DELETE',
            headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
            }
        });
        setCartItems(cartItems.filter((item) => item.id !== itemId));
        } catch (error) {
        console.error("Error removing item:", error);
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return; // Prevent quantity from going below 1
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/purchaser/cart_items/${itemId}`, {
                method: 'PUT',
                headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
                },
                body: JSON.stringify({ quantity: newQuantity })
            });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const updatedItem = await response.json();
        // Update the cartItems state with the new quantity
        setCartItems((prevItems) =>
            prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity: updatedItem.quantity } : item
            )
        );
        } catch (error) {
        console.error("Error updating quantity:", error);
        }
    };
      


    const handleApplyDiscount = () => {
        // Implement discount code logic here
    };

    return (
        <>
        <TopNavbar />
        <div className="shopping-cart-page">
            <Container fluid className="p-0">
            <Row>
                <Col xs={12} md={2} className="p-0">
                <Sidebar />
                </Col>
                <Col xs={12} md={10} className="p-2">
                <Container>
                    <Row>
                    <Col md={8}>
                        <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Shopping Cart</h5>
                            <span>{cartItems.length} Items</span>
                        </Card.Header>
                        <Card.Body>
                            {cartItems.map((item) => (
                                <Row key={item.id} className="mb-3 align-items-center product-item">
                                <Col xs={2}>
                                    {/* Use product's media URL */}
                                    <img src={item.product.first_media_url} alt={item.product.title} className="img-fluid" />
                                </Col>
                                <Col xs={5}>
                                    {/* Use product's title */}
                                    <h6>{item.product.title}</h6>
                                    <p className="text-muted small">{item.description}</p>
                                </Col>
                                <Col xs={3} className="text-center">
                                    <Button
                                    variant="outline-secondary"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    >
                                    -
                                    </Button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <Button
                                    variant="outline-secondary"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    >
                                    +
                                    </Button>
                                </Col>
                                <Col xs={2} className="text-end">
                                    <em className='product-price-label'>Kshs: </em>
                                    <strong>
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
                                    </strong>
                                    <Button variant="link" className="text-danger p-0 ms-2" onClick={() => handleRemoveItem(item.id)}>
                                    <Trash size={16} />
                                    </Button>
                                </Col>
                                </Row>
                            ))}
                        </Card.Body>

                        <Card.Footer className="text-end">
                            <h5>Sub-Total: Ksh. {subtotal.toLocaleString()}</h5>
                        </Card.Footer>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="summary-card">
                        <Card.Header>
                            <h5 className="mb-0">Summary</h5>
                        </Card.Header>
                        <Card.Body>
                            <p className="d-flex justify-content-between">
                            <span>Estimated Shipping and Tax</span>
                            </p>
                            <p className="d-flex justify-content-between">
                            <span>Sub Total:</span>
                            <strong className="text-yellow">Ksh. {subtotal.toLocaleString()}</strong>
                            </p>
                            <p className="d-flex justify-content-between">
                            <span>Tax (16%):</span>
                            <strong className="text-yellow">Ksh. {tax.toLocaleString()}</strong>
                            </p>
                            <hr className="bg-secondary" />
                            <p className="d-flex justify-content-between">
                            <span>Order Total:</span>
                            <strong className="text-yellow">Ksh. {total.toLocaleString()}</strong>
                            </p>
                            <Form.Group className="mb-3">
                            <Form.Label>Apply Discount Code:</Form.Label>
                            <InputGroup>
                                <Form.Control
                                type="text"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                                placeholder="Enter code"
                                />
                                <Button variant="outline-secondary" onClick={handleApplyDiscount}>
                                Apply
                                </Button>
                            </InputGroup>
                            </Form.Group>
                            <Button variant="warning" className="w-100">
                            Proceed to Checkout
                            </Button>
                            <div className="mt-3">
                            <p className="mb-1">Available Payment Platforms</p>
                            <img src="/api/placeholder/200/40" alt="Payment methods" className="img-fluid" />
                            </div>
                        </Card.Body>
                        </Card>
                    </Col>
                    </Row>
                </Container>
                </Col>
            </Row>
            </Container>
        </div>
        </>
    );
};

export default ShoppingCart;
