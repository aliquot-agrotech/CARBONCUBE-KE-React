import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import { Pencil } from 'react-bootstrap-icons';
import axios from 'axios';

const PurchasersManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedpurchaser, setSelectedpurchaser] = useState(null);
  const [purchasers, setpurchasers] = useState([]);

  useEffect(() => {
    // Fetch purchasers data from the API
    const fetchpurchasers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/purchasers');
        setpurchasers(response.data);
      } catch (error) {
        console.error('Error fetching purchasers:', error);
      }
    };

    fetchpurchasers();
  }, []);

  const handleRowClick = async (purchaser) => {
    try {
      const response = await axios.get(`/admin/purchasers/${purchaser.id}`);
      setSelectedpurchaser(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching purchaser details:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedpurchaser(null);
  };

  return (
    <>
      <TopNavbar />
      <Container fluid>
        <Row>
          <Col xs={12} md={2} className="p-0">
            <Sidebar />
          </Col>
          <Col xs={12} md={10} className="p-4">
            <h2>Purchaser Details & Metrics</h2>
            <Table hover>
              <thead>
                <tr>
                  <th>Purchaser ID</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Purchases</th>
                  <th>Email</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {purchasers.map((purchaser) => (
                  <tr key={purchaser.id} onClick={() => handleRowClick(purchaser)} style={{ cursor: 'pointer' }}>
                    <td>{purchaser.id}</td>
                    <td>{purchaser.fullname}</td>
                    <td>{purchaser.phone_number}</td>
                    <td>{purchaser.location}</td>
                    <td>{purchaser.purchases}</td>
                    <td>{purchaser.email}</td>
                    <td><Pencil /></td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>purchaser Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedpurchaser && (
                  <div>
                    <p><strong>Purchaser ID:</strong> {selectedpurchaser.id}</p>
                    <p><strong>Name:</strong> {selectedpurchaser.fullname}</p>
                    <p><strong>Contact:</strong> {selectedpurchaser.phone_number}</p>
                    <p><strong>Address:</strong> {selectedpurchaser.location}</p>
                    <p><strong>Purchases:</strong> {selectedpurchaser.purchases}</p>
                    <p><strong>Email:</strong> {selectedpurchaser.email}</p>
                    <h4>Orders</h4>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Total Price</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedpurchaser.orders && selectedpurchaser.orders.map(order => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.product_name}</td>
                            <td>{order.quantity}</td>
                            <td>{order.total_price}</td>
                            <td>{order.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PurchasersManagement;
