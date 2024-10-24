import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Container, Row, Col, Card, Form } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faKey } from '@fortawesome/free-solid-svg-icons';
import Spinner from "react-spinkit";
import './PurchasersManagement.css';  // Custom CSS

const PurchasersManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPurchaser, setSelectedPurchaser] = useState(null);
  const [purchasers, setPurchasers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 

  useEffect(() => {
      const fetchPurchasers = async () => {
          try {
              const response = await fetch(`https://carboncube-ke-rails-qrvq.onrender.com/admin/purchasers?search_query=${searchQuery}`, {
                  headers: {
                      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                  },
              });

              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }

              const data = await response.json();
              setPurchasers(data);
          } catch (error) {
              console.error('Error fetching purchasers:', error);
              setError('Error fetching purchasers');
          } finally {
              setLoading(false);
          }
      };

      fetchPurchasers();
  }, [searchQuery]); 


  const handleRowClick = async (purchaserId) => {
    try {
      const response = await fetch(`https://carboncube-ke-rails-qrvq.onrender.com/admin/purchasers/${purchaserId}`, {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'), // Add token if required
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSelectedPurchaser(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching purchaser details:', error);
    }
  };

  const handleUpdateStatus = async (purchaserId, status) => {
    try {
      const response = await fetch(`https://carboncube-ke-rails-qrvq.onrender.com/admin/purchasers/${purchaserId}/${status}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating purchaser status:', errorData);
        return;
      }
  
      setPurchasers(prevPurchasers =>
        prevPurchasers.map(purchaser =>
          purchaser.id === purchaserId ? { ...purchaser, blocked: status === 'block' } : purchaser
        )
      );
  
      if (selectedPurchaser && selectedPurchaser.id === purchaserId) {
        setSelectedPurchaser(prevPurchaser => ({ ...prevPurchaser, blocked: status === 'block' }));
      }
    } catch (error) {
      console.error('Error updating purchaser status:', error);
    }
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPurchaser(null);
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
      <div className="purchasers-management-page">
        <Container fluid className="p-0">
          <Row>
            <Col xs={12} md={2} className="p-0">
              <Sidebar />
            </Col>
            <Col xs={12} md={10} lg={9} className="p-0 p-lg-2">
              <Card className="section">
                <Card.Header className="text-center orders-header">
                  <Container fluid>
                    <Row className="d-flex flex-row flex-md-row justify-content-between align-items-center">
                        <Col xs="auto" className="d-flex align-items-center mb-0 mb-md-0 text-center ms-3">
                            <h4 className="mb-0 align-self-center">Purchasers</h4>
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
                <Card.Body className='p-0 m-0 table-container'>
                  <div className="table-responsive">
                  <Table hover className="orders-table text-center">
                    <thead className="table-header">
                      <tr>
                        <th>Purchaser ID</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                    {purchasers.length > 0 ? (
                      purchasers
                          .sort((a, b) => a.id - b.id) // Sort purchasers by ID in ascending order
                          .map((purchaser) => (
                              <tr key={purchaser.id} onClick={() => handleRowClick(purchaser.id)} style={{ cursor: 'pointer' }}>
                            <td>{purchaser.id}</td>
                            <td>{purchaser.fullname}</td>
                            <td>{purchaser.phone_number}</td>
                            <td>{purchaser.email}</td>
                            <td>{purchaser.location}</td>
                            <td>
                              <Button
                                  variant={purchaser.blocked ? 'danger' : 'warning'}
                                  id="button"
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(purchaser.id, purchaser.blocked ? 'unblock' : 'block');
                                  }}
                              >
                                  <FontAwesomeIcon icon={purchaser.blocked ? faKey : faUserShield} />
                                  {/* {purchaser.blocked ? ' Unblock' : ' Block'} */}
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  </div>
                  
                </Card.Body>
                <Card.Footer className="text-center">
                </Card.Footer>
              </Card>
              

              <Modal centered show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header className="justify-content-center">
                  <Modal.Title>Purchaser Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedPurchaser ? (
                    <div>
                      <Container className="purchaser-details mb-4 text-center">
                        <Row>
                          <Col xs={12} md={6}>
                              <Card className="mb-2 custom-card">
                                  <Card.Header as="h6" className="justify-content-center">Purchaser ID</Card.Header>
                                  <Card.Body className="text-center">
                                      {selectedPurchaser.id}
                                  </Card.Body>
                              </Card>
                          </Col>
                          <Col xs={12} md={6}>
                              <Card className="mb-2 custom-card">
                                  <Card.Header as="h6" className="justify-content-center">Name</Card.Header>
                                  <Card.Body className="text-center">
                                      {selectedPurchaser.fullname}
                                  </Card.Body>
                              </Card>
                          </Col>
                        </Row>

                        <Row>
                          <Col xs={12} md={6}>
                              <Card className="mb-2 custom-card">
                                  <Card.Header as="h6" className="justify-content-center">Contact</Card.Header>
                                  <Card.Body className="text-center">
                                      {selectedPurchaser.phone_number}
                                  </Card.Body>
                              </Card>
                          </Col>
                          <Col xs={12} md={6}>
                              <Card className="mb-2 custom-card">
                                  <Card.Header as="h6" className="justify-content-center">Address</Card.Header>
                                  <Card.Body className="text-center">
                                      {selectedPurchaser.location}
                                  </Card.Body>
                              </Card>
                          </Col>
                        </Row>

                        <Row>
                          <Col xs={12}>
                              <Card className="mb-2 custom-card">
                                  <Card.Header as="h6" className="justify-content-center">Email</Card.Header>
                                  <Card.Body className="text-center">
                                      {selectedPurchaser.email}
                                  </Card.Body>
                              </Card>
                          </Col>
                        </Row>

                      </Container>
                      <h4 className='text-center'>Orders</h4>
                      {selectedPurchaser.orders && selectedPurchaser.orders.length > 0 ? (
                        <div className="order-container text-center">
                          <div className="table-responsive">
                            <Table bordered hover>
                              <thead className='table-head'>
                                <tr>
                                  <th>Order ID</th>
                                  <th>Order Date</th>
                                  <th>Total <em className='product-price-label' style={{ fontSize: '13px' }}>(Kshs:)</em></th>
                                  <th>Status</th>
                                  <th>Details</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedPurchaser.orders
                                  .sort((a, b) => a.id - b.id)  // Sort orders by order ID in ascending order
                                  .map(order => (
                                    <React.Fragment key={order.id}>
                                      <tr className='table-row'>
                                        <td>{order.id}</td>
                                        <td>{order.order_date}</td>
                                        <td className="price-container">
                                          <strong>
                                            {order.total_price ? order.total_price.split('.').map((part, index) => (
                                                <React.Fragment key={index}>
                                                    {index === 0 ? (
                                                        <span className="price-integer">
                                                            {parseInt(part, 10).toLocaleString()} {/* Add commas to the integer part */}
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <span style={{ fontSize: '16x' }}>.</span>
                                                            <span className="price-decimal">{part}</span>
                                                        </>
                                                    )}
                                                </React.Fragment>
                                            )) : 'N/A'}
                                          </strong>
                                        </td>

                                        <td>{order.status}</td>
                                        <td>
                                          <Button
                                            variant={activeOrder === order.id ? 'warning' : 'success'}
                                            id="button"
                                            onClick={() => {
                                              document.getElementById(`details-${order.id}`).classList.toggle('d-none');
                                              setActiveOrder(prevOrder => prevOrder === order.id ? null : order.id);
                                            }}
                                          >
                                            {activeOrder === order.id ? 'Hide Details' : 'View Details'}
                                          </Button>
                                        </td>
                                      </tr>
                                      <tr id={`details-${order.id}`} className="d-none sub-table">
                                        <td colSpan="5">
                                          <Table bordered hover>
                                            <thead className='table-head'>
                                              <tr>
                                                <th>Product Name</th>
                                                <th>Quantity</th>
                                                <th>Price <em className='product-price-label' style={{ fontSize: '13px' }}>(Kshs:)</em></th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {order.order_items.map(item => (
                                                <tr key={item.product.id}>
                                                  <td>{item.product.title}</td>
                                                  <td>{item.quantity}</td>
                                                  <td className="price-container">
                                                    <strong>
                                                      {((item.product.price * item.quantity).toFixed(1)).split('.').map((part, index) => (
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

                                                </tr>
                                              ))}
                                            </tbody>
                                          </Table>
                                        </td>
                                      </tr>
                                    </React.Fragment>
                                  ))}
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      ) : (
                        <p className="text-center">No orders available</p>
                      )}
                    </div>
                  ) : (
                    <p>No details available</p>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={handleCloseModal} id="button">
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

export default PurchasersManagement;
