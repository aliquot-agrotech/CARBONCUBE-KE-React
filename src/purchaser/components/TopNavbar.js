import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { List } from 'react-bootstrap-icons';
import './TopNavbar.css';

const TopNavbar = ({ onSidebarToggle, sidebarOpen }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top navbar">
      <Container fluid>
        <Button 
          variant="warning" 
          className={`toggle-button ${sidebarOpen ? 'd-none' : 'd-block'}`} 
          onClick={onSidebarToggle}
        >
          <List size={15} /> {/* Sidebar toggle icon */}
        </Button>
        <Navbar.Brand href="/purchaser/homepage">CARBON - Purchaser</Navbar.Brand>
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
