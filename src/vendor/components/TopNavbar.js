import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import './TopNavbar.css';

const TopNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top navbar mb-0 p-1">
      <Container fluid>
        <Navbar.Brand href="/vendor/analytics-reporting" className="d-flex align-items-center">
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="Carboncube Logo"
            width="40"  // Adjust size as needed
            height="40"  // Adjust size as needed
            className="d-inline-block align-top"
          />
          <span className="ml-2">ARBONCUBE</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* <Nav.Link href="/profile">Profile</Nav.Link> */}
            <Button variant="warning" href="/login" className="ms-2" id="button">
                Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
