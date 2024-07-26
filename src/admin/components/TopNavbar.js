import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import './TopNavbar.css';

const TopNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-0">
      <Container fluid>
        <Navbar.Brand href="/admin/analytics-reporting">CARBON - Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/profile">Profile</Nav.Link>
            <Nav.Link href="/login">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
