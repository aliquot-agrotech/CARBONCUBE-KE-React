import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import './ContentManagement.css';

const ContentManagement = () => {
  return (
    <>
      <TopNavbar />
      <Container fluid>
        <Row>
          <Col xs={12} md={3} className="p-0">
            <Sidebar />
          </Col>
          <Col xs={12} md={9} className="p-3">
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>About Us</Card.Title>
                <p>
                  Welcome to the ultimate destination for automotive parts and accessories! At [Your Company Name], we are passionate about helping you keep your vehicles running smoothly and looking their best. Our platform connects you with a wide range of high-quality products from trusted vendors, ensuring that you have access to everything you need for your automotive projects.
                </p>
                <p><strong>Our Mission</strong></p>
                <p>
                  Our mission is to provide a seamless and enjoyable shopping experience for automotive enthusiasts and professionals alike. We strive to offer the best selection of parts and accessories, competitive prices, and exceptional customer service.
                </p>
                <p><strong>Why Choose Us?</strong></p>
                <ul>
                  <li>Wide Selection: We partner with multiple vendors to bring you a vast array of products for all makes and models.</li>
                  <li>Quality Assurance: Every product on our platform is thoroughly vetted to ensure it meets our high standards.</li>
                  <li>User-Friendly Experience: Our intuitive search and filtering system makes it easy to find exactly what you need.</li>
                  <li>Secure Shopping: Your security is our priority. We offer safe and secure payment options for a worry-free shopping experience.</li>
                </ul>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Card.Title>Media Gallery</Card.Title>
                <Form>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Add File</Form.Label>
                    <Form.Control type="file" />
                  </Form.Group>
                  <Button variant="warning" type="submit">Save</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ContentManagement;
