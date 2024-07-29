import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import { Pencil } from 'react-bootstrap-icons';

const PurchasersManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch purchasers data from the API
    const fetchCustomers = async () => {
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
        console.log('Fetched customers:', data); // Log fetched data
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching purchasers:', error);
        setError('Error fetching purchasers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleRowClick = async (customerId) => {
    try {
      const response = await fetch(`http://localhost:3000/admin/purchasers/${customerId}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'), // Add token if required
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Fetched customer details:', data); // Log customer details
      setSelectedCustomer(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching purchaser details:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
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
            <h2>Customer Details & Metrics</h2>
            <Table hover>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer.id} onClick={() => handleRowClick(customer.id)} style={{ cursor: 'pointer' }}>
                      <td>{customer.id}</td>
                      <td>{customer.fullname}</td>
                      <td>{customer.phone_number}</td>
                      <td>{customer.location}</td>
                      <td>{customer.email}</td>
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
                <Modal.Title>Customer Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedCustomer ? (
                  <div>
                    <p><strong>Customer ID:</strong> {selectedCustomer.id}</p>
                    <p><strong>Name:</strong> {selectedCustomer.fullname}</p>
                    <p><strong>Contact:</strong> {selectedCustomer.phone_number}</p>
                    <p><strong>Address:</strong> {selectedCustomer.location}</p>
                    <p><strong>Email:</strong> {selectedCustomer.email}</p>
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
                        {selectedCustomer.orders && selectedCustomer.orders.map(order => (
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
