import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { List } from 'react-bootstrap-icons';
import './TopNavbar.css';

const TopNavbar = ({ onSidebarToggle, sidebarOpen }) => {
  const [isVisible, setIsVisible] = useState(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) {
      setIsVisible(false);
    } else {
      const timer = setTimeout(() => setIsVisible(true), 300); // Match this with your CSS transition time
      return () => clearTimeout(timer);
    }
  }, [sidebarOpen]);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top navbar mb-0">
      <Container fluid>
        <div className={`toggle-container ${sidebarOpen ? 'hidden' : ''}`}>
          {isVisible && (
            <Button 
              variant="warning" 
              className={`toggle-button ${sidebarOpen ? 'fade-out' : 'fade-in'}`}
              onClick={onSidebarToggle}
              aria-label="Toggle Sidebar" // Accessibility
            >
              <List size={15} />
            </Button>
          )}
        </div>
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
