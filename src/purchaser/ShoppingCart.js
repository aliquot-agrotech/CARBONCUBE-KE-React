import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Plus, Dash, Trash } from 'react-bootstrap-icons';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import LipaNaMpesa from './components/Mpesa.png';
import './ShoppingCart.css';

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const [discountCode, setDiscountCode] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [totalBeforeDiscount, setTotalBeforeDiscount] = useState(0);


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
        const discountAmount = subTotal * (discountPercentage / 100);
        const totalAmount = subTotal - discountAmount + taxAmount;
    
        setSubtotal(subTotal);
        setTax(taxAmount);
        setDiscountAmount(discountAmount);
        setTotalBeforeDiscount(subTotal + taxAmount); // Total before discount
        setTotal(totalAmount);
    }, [cartItems, discountPercentage]);

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
        if (newQuantity < 1) return;
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
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === itemId ? { ...item, quantity: updatedItem.quantity } : item
                )
            );
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const handleApplyDiscount = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:3000/purchaser/validate_coupon", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ coupon_code: discountCode })
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || 'Invalid discount code');
            }
    
            // Directly use the discount percentage from the response
            const newDiscountPercentage = data.discount_percentage;
            setDiscountPercentage(newDiscountPercentage);
    
            // Recalculate totals with the new discount
            calculateTotals();
    
            alert(`Discount applied: ${newDiscountPercentage}%`);
        } catch (error) {
            console.error('Error applying discount:', error);
            alert('Failed to apply discount');
        }
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
                                        <Card className='cart'>
                                            <Card.Header className="d-flex justify-content-between align-items-center">
                                                <h3 className="mb-0">Shopping Cart</h3>
                                                <span>{cartItems.length} Items</span>
                                            </Card.Header>
                                            <Card.Body className='cart2'>
                                                {cartItems.map((item) => (
                                                    <Row key={item.id} className="mb-3 align-items-center product-item">
                                                        <Col xs={2}>
                                                            {item.product.media && item.product.media.length > 0 ? (
                                                                <img src={item.product.media[0]} alt={item.product.title} className="img-fluid" />
                                                            ) : (
                                                                <span>No Image Available</span>
                                                            )}
                                                        </Col>
                                                        <Col xs={5}>
                                                            <h6>{item.product.title}</h6>
                                                            <p className="text-muted small">{item.product.description}</p>
                                                        </Col>
                                                        <Col xs={3} className="text-center quantity-container">
                                                            <Button
                                                                id="decrement-button"
                                                                className="quantity-button"
                                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Dash size={20} />
                                                            </Button>
                                                            <span className="mx-2"><strong>{item.quantity}</strong></span>
                                                            <Button
                                                                id="increment-button"
                                                                className="quantity-button"
                                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                            >
                                                                <Plus size={20} />
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
                                                <h4>Sub-Total <em style={{ fontSize: '15px' }}>(Kshs)</em>: {subtotal.toLocaleString()}</h4>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                    <Col md={4}>
                                        <Card className="summary-card">
                                            <Card.Header className="d-flex justify-content-center">
                                                <h5 className="mb-0">CHECK-OUT POINT</h5>
                                            </Card.Header>
                                            <Card.Body>
                                                <p className="d-flex justify-content-center">
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
                                                    <span>Total Before Discount:</span>
                                                    <strong className="text-yellow">Ksh. {totalBeforeDiscount.toLocaleString()}</strong>
                                                </p>
                                                <hr className="bg-secondary" />
                                                <Form.Group className="mb-3 text-center">
                                                    <Form.Label>Apply Discount Code:</Form.Label>
                                                    <InputGroup className="input-group-horizontal">
                                                        <Form.Control
                                                            type="text"
                                                            value={discountCode}
                                                            id="button"
                                                            className='me-3'
                                                            onChange={(e) => setDiscountCode(e.target.value)}
                                                            placeholder="Enter code"
                                                        />
                                                        <Button variant="warning" id="button" onClick={handleApplyDiscount}>
                                                            Apply
                                                        </Button>
                                                    </InputGroup>
                                                </Form.Group>
                                                <p className="d-flex justify-content-between">
                                                    <span>Discount ({discountPercentage}%):</span>
                                                    <strong className="text-yellow">- Ksh. {discountAmount.toLocaleString()}</strong>
                                                </p>
                                                <hr className="bg-secondary" />
                                                <p className="d-flex justify-content-between">
                                                    <span style={{ fontSize: '20px' }}>Order Total:</span>
                                                    <strong className="text-yellow" style={{ fontSize: '20px' }}>Ksh. {total.toLocaleString()}</strong>
                                                </p>
                                                <Button variant="warning" id="button" className="w-100">
                                                    Proceed to Checkout
                                                </Button>
                                                <div className="mt-3">
                                                    <p className="mb-1 text-center">Payment Platforms</p>
                                                    <div className="payment-logos">
                                                        <img src={LipaNaMpesa} alt="Payment methods" className="payment-logo" />
                                                        {/* Add more images here */}
                                                    </div>
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