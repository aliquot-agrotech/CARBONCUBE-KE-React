import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import { Pencil } from 'react-bootstrap-icons';

const PurchasersManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedpurchaser, setSelectedpurchaser] = useState(null);
  const [purchasers, setpurchasers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchpurchasers = async () => {
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
        console.log('Fetched purchasers:', data); // Log fetched data
        setpurchasers(data);
      } catch (error) {
        console.error('Error fetching purchasers:', error);
        setError('Error fetching purchasers');
      } finally {
        setLoading(false);
      }
    };

    fetchpurchasers();
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
      console.log('Fetched purchaser details:', data); // Log purchaser details
      setSelectedpurchaser(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching purchaser details:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedpurchaser(null);
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
                  <th>Email</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {purchasers.length > 0 ? (
                  purchasers.map((purchaser) => (
                    <tr key={purchaser.id} onClick={() => handleRowClick(purchaser.id)} style={{ cursor: 'pointer' }}>
                      <td>{purchaser.id}</td>
                      <td>{purchaser.fullname}</td>
                      <td>{purchaser.phone_number}</td>
                      <td>{purchaser.location}</td>
                      <td>{purchaser.email}</td>
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
                {selectedpurchaser ? (
                  <div>
                    <p><strong>Purchaser ID:</strong> {selectedpurchaser.id}</p>
                    <p><strong>Name:</strong> {selectedpurchaser.fullname}</p>
                    <p><strong>Contact:</strong> {selectedpurchaser.phone_number}</p>
                    <p><strong>Address:</strong> {selectedpurchaser.location}</p>
                    <p><strong>Email:</strong> {selectedpurchaser.email}</p>
                    <h4>Orders</h4>
                    {selectedpurchaser.orders && selectedpurchaser.orders.length > 0 ? (
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
                          {selectedpurchaser.orders.map(order => (
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
                    ) : (
                      <p>No orders available</p>
                    )}
                  </div>
                ) : (
                  <p>No details available</p>
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
