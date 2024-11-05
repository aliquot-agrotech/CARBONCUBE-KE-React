import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, } from 'react-bootstrap';
// import { Form, InputGroup } from 'react-bootstrap';
import { Plus, Dash, Trash } from 'react-bootstrap-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcVisa, faCcMastercard, faCcPaypal, faCcAmex, faCcDiscover } from '@fortawesome/free-brands-svg-icons';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import LipaNaMpesa from './components/Mpesa.png';
import './ShoppingCart.css';

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const deliveryFee = 150;
    const [total, setTotal] = useState(0);
    const [processingFee, setProcessingFee] = useState(0);
    // const [discountCode, setDiscountCode] = useState('');
    // const [discountPercentage, setDiscountPercentage] = useState(0);
    // const [discountAmount, setDiscountAmount] = useState(0);
    // const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);


    const fetchCartItems = useCallback(async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch("https://carboncube-ke-rails-4xo3.onrender.com/purchaser/cart_items", {
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

    const calculateMpesaFee = (amount) => {
        switch (true) {
            case amount >= 1 && amount <= 49:
                return 0;
            case amount >= 50 && amount <= 100:
                return 0;
            case amount >= 101 && amount <= 500:
                return 7;
            case amount >= 501 && amount <= 1000:
                return 13;
            case amount >= 1001 && amount <= 1500:
                return 23;
            case amount >= 1501 && amount <= 2500:
                return 33;
            case amount >= 2501 && amount <= 3500:
                return 53;
            case amount >= 3501 && amount <= 5000:
                return 57;
            case amount >= 5001 && amount <= 7500:
                return 78;
            case amount >= 7501 && amount <= 10000:
                return 90;
            case amount >= 10001 && amount <= 15000:
                return 100;
            case amount >= 15001 && amount <= 20000:
                return 105;
            case amount >= 20001 && amount <= 35000:
                return 108;
            case amount >= 35001 && amount <= 50000:
                return 108;
            case amount >= 50001 && amount <= 250000:
                return 108;
            default:
                return 0;
        }
    };
    
    const calculateTotals = useCallback(() => {
        let processingFeeTotal = 0;
    
        const subTotal = cartItems.reduce((acc, item) => {
            const itemTotal = item.price * item.quantity; // Total product price (price * quantity)
            const mpesaFee = calculateMpesaFee(itemTotal); // Mpesa fee based on total price
            const productCharge = 0.02 * itemTotal; // 2% charge on total product price
    
            // Add item total
            const newAcc = acc + itemTotal;
    
            // Calculate total processing fee for this item
            const processingFee = mpesaFee + productCharge;
            processingFeeTotal += processingFee; // Accumulate processing fees
    
            return newAcc;
        }, 0);
    
        setSubtotal(subTotal);  // Subtotal reflects just the item costs
        setProcessingFee(processingFeeTotal);  // Set processing fee total separately
        setTotal(subTotal + processingFeeTotal + deliveryFee);  // Total includes processing fees
    }, [cartItems]);
    

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    useEffect(() => {
        calculateTotals();
    }, [calculateTotals]);

    const handleRemoveItem = async (itemId) => {
        try {
            const token = sessionStorage.getItem('token');
            await fetch(`https://carboncube-ke-rails-4xo3.onrender.com/purchaser/cart_items/${itemId}`, {
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
            const token = sessionStorage.getItem('token');
            const response = await fetch(`https://carboncube-ke-rails-4xo3.onrender.com/purchaser/cart_items/${itemId}`, {
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

    const handleCheckout = async () => {
        const token = sessionStorage.getItem('token');
        const mpesaTransactionCode = prompt("Enter Mpesa Transaction Code:");
    
        if (!mpesaTransactionCode) {
            alert("Mpesa transaction code is required");
            return;
        }
    
        try {
            const response = await fetch('https://carboncube-ke-rails-4xo3.onrender.com/purchaser/orders', {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    mpesa_transaction_code: mpesaTransactionCode,
                    total_amount: total,            // Total amount (includes all fees)
                    processing_fee: processingFee,   // Include processing fee
                    delivery_fee: deliveryFee        // Include delivery fee
                })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert("Order created successfully!");
                // Optionally redirect the user to a success or order summary page
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            alert("An error occurred during checkout.");
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
                                    <Col md={8} className="p-2 cart-column">
                                        <Card className='cart'>
                                            <Card.Header className="d-flex justify-content-between align-items-center">
                                                <h3 className="mb-0">Shopping Cart</h3>
                                                <span>{cartItems.length} Items</span>
                                            </Card.Header>
                                            <Card.Body className='cart2'>
                                                {cartItems.map((item) => (
                                                    <Row key={item.id} className="mb-3 align-items-center product-item">
                                                        <Col xl={2} xs={2}>
                                                            {item.product.media && item.product.media.length > 0 ? (
                                                                <img src={item.product.media[0]} alt={item.product.title} className="img-fluid" />
                                                            ) : (
                                                                <span>No Image Available</span>
                                                            )}
                                                        </Col>
                                                        <Col xl={5} xs={4}>
                                                            <h6>{item.product.title}</h6>
                                                            <p className="text-muted small">{item.product.description}</p>
                                                        </Col>
                                                        <Col xl={3} xs={2} className="text-center quantity-container">
                                                            <Button
                                                                id="decrement-button"
                                                                className="quantity-button"
                                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Dash size={20} />
                                                            </Button>
                                                            <span className="mx-1"><strong>{item.quantity}</strong></span>
                                                            <Button
                                                                id="increment-button"
                                                                className="quantity-button"
                                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                            >
                                                                <Plus size={20} />
                                                            </Button>
                                                        </Col>
                                                        <Col xl={2} xs={4} className="text-end">
                                                            {/* <em className='product-price-label' style={{ fontSize: '13px' }}>Kshs: </em> */}
                                                            <strong className="text-success">
                                                                {item.price ? parseFloat(item.price).toFixed(2).split('.').map((part, index) => (
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
                                                <h5 className='mb-0'>
                                                    Sub-Total <em style={{ fontSize: '15px' }}>(Kshs)</em>:
                                                    <strong className="text-warning">
                                                        {subtotal.toFixed(2).split('.').map((part, index) => (
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
                                                        ))}
                                                    </strong>
                                                </h5>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="p-2">
                                        <Card className="summary-card">
                                            <Card.Header className="d-flex justify-content-center">
                                                <h5 className="mb-0">CHECK-OUT POINT</h5>
                                            </Card.Header>
                                            <Card.Body>
                                                <p className="d-flex justify-content-center">
                                                    <span>Estimated Shipping and VAT</span>
                                                </p>

                                                <p className="d-flex justify-content-between">
                                                    <span><strong>Processing Fee</strong></span>
                                                    <strong className="text-yellow">
                                                        Ksh. {processingFee.toFixed(2).split('.').map((part, index) => (
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
                                                        ))}
                                                    </strong>
                                                </p>

                                                <p className="d-flex justify-content-between">
                                                    <span><strong>Delivery Fee</strong></span>
                                                    <strong className="text-yellow">
                                                        Ksh. {deliveryFee.toFixed(2).split('.').map((part, index) => (
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
                                                        ))}
                                                    </strong>
                                                </p>

                                                <p className="d-flex justify-content-between">
                                                    <span style={{ fontSize: '20px' }}><strong>Order Total:</strong></span>
                                                    <strong className="text-yellow" style={{ fontSize: '20px' }}>
                                                        Ksh. {total.toFixed(2).split('.').map((part, index) => (
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
                                                        ))}
                                                    </strong>
                                                </p>

                                                <Button variant="warning" id="button" className="w-100" onClick={handleCheckout}>
                                                    Checkout
                                                </Button>
                                                <div className="mt-3">
                                                    <p className="mb-1 text-center"><strong>Payment Platforms</strong></p>
                                                    <div className="payment-logos">
                                                        <img src={LipaNaMpesa} alt="Payment methods" className="payment-logo" />
                                                        {/* Add more images here */}
                                                        <FontAwesomeIcon icon={faCcVisa} className="payment-logo" title="Visa" />
                                                        <FontAwesomeIcon icon={faCcMastercard} className="payment-logo" title="MasterCard" />
                                                        <FontAwesomeIcon icon={faCcPaypal} className="payment-logo" title="PayPal" />
                                                        <FontAwesomeIcon icon={faCcAmex} className="payment-logo" title="American Express" />
                                                        <FontAwesomeIcon icon={faCcDiscover} className="payment-logo" title="Discover" />
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