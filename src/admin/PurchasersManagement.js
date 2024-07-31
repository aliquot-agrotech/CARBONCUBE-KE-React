import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import { Pencil } from 'react-bootstrap-icons';
import './PurchasersManagement.css';  // Custom CSS

const PurchasersManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPurchaser, setSelectedPurchaser] = useState(null);
  const [purchasers, setPurchasers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    const fetchPurchasers = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/purchasers', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'), // Add token if required
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
  }, []);

  const handleRowClick = async (purchaserId) => {
    try {
      const response = await fetch(`http://localhost:3000/admin/purchasers/${purchaserId}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'), // Add token if required
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

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPurchaser(null);
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
      <div className="purchasers-management-page">
        <Container fluid className="p-0">
          <Row>
            <Col xs={12} md={2} className="p-0">
              <Sidebar />
            </Col>
            <Col xs={12} md={10} className="p-4">
              <h2 className="mb-4 text-center">Purchaser Details & Metrics</h2>
              <Table hover className="purchasers-table text-center">
                <thead className="table-header">
                  <tr>
                    <th>Purchaser ID</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {purchasers.length > 0 ? (
                    purchasers.map((purchaser) => (
                      <tr key={purchaser.id} onClick={() => handleRowClick(purchaser.id)} style={{ cursor: 'pointer' }}>
                        <td>{purchaser.id}</td>
                        <td>{purchaser.fullname}</td>
                        <td>{purchaser.phone_number}</td>
                        <td>{purchaser.email}</td>
                        <td>{purchaser.location}</td>
                        <td><Pencil /></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No data available</td>
                    </tr>
                  )}
                </tbody>
              </Table>

              <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title>Purchaser Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedPurchaser ? (
                    <div>
                      <div className="purchaser-details mb-4 text-center">
                        <div className="purchaser-detail-item">
                          <strong>Purchaser ID:</strong> {selectedPurchaser.id}
                        </div>
                        <div className="purchaser-detail-item">
                          <strong>Name:</strong> {selectedPurchaser.fullname}
                        </div>
                        <div className="purchaser-detail-item">
                          <strong>Contact:</strong> {selectedPurchaser.phone_number}
                        </div>
                        <div className="purchaser-detail-item">
                          <strong>Address:</strong> {selectedPurchaser.location}
                        </div>
                        <div className="purchaser-detail-item">
                          <strong>Email:</strong> {selectedPurchaser.email}
                        </div>
                      </div>
                      <h4 className='text-center'>Orders</h4>
                      {selectedPurchaser.orders && selectedPurchaser.orders.length > 0 ? (
                        <div className="order-container text-center">
                          <div className="table-responsive">
                            <Table bordered hover>
                              <thead>
                                <tr>
                                  <th>Order ID</th>
                                  <th>Order Date</th>
                                  <th>Total Price</th>
                                  <th>Status</th>
                                  <th>Details</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedPurchaser.orders
                                  .sort((a, b) => a.id - b.id)  // Sort orders by order ID in ascending order
                                  .map(order => (
                                    <React.Fragment key={order.id}>
                                      <tr>
                                        <td>{order.id}</td>
                                        <td>{order.order_date}</td>
                                        <td>Ksh {order.total_price}</td>
                                        <td>{order.status}</td>
                                        <td>
                                          <Button
                                            variant={activeOrder === order.id ? 'success' : 'primary'}
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
                                            <thead>
                                              <tr>
                                                <th>Product Name</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {order.order_items.map(item => (
                                                <tr key={item.product.id}>
                                                  <td>{item.product.title}</td>
                                                  <td>{item.quantity}</td>
                                                  <td>Ksh {item.product.price * item.quantity}</td>
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
                        <p>No orders available</p>
                      )}
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

export default PurchasersManagement;
