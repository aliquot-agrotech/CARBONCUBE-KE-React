import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart_items');
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const calculateTotals = () => {
    const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxAmount = subTotal * 0.16; // 16% tax
    setSubtotal(subTotal);
    setTax(taxAmount);
    setTotal(subTotal + taxAmount);
  };

  const handleRemoveItem = (itemId) => {
    // Implement remove item logic
  };

  const handleApplyDiscount = () => {
    // Implement discount code logic
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
                              <img src={item.image} alt={item.name} className="img-fluid" />
                            </Col>
                            <Col xs={6}>
                              <h6>{item.name}</h6>
                              <p className="text-muted small">{item.description}</p>
                            </Col>
                            <Col xs={2} className="text-center">
                              {item.quantity}
                            </Col>
                            <Col xs={2} className="text-end">
                              Ksh. {item.price.toLocaleString()}
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