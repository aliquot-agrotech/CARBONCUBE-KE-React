import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, Form, FormControl } from 'react-bootstrap';
import { List } from 'react-bootstrap-icons';
import './TopNavbar.css';

const TopNavbar = ({ onSidebarToggle, sidebarOpen, searchQuery, setSearchQuery, handleSearch }) => {
  const [isVisible, setIsVisible] = useState(!sidebarOpen);

  useEffect(() => {
    if (sidebarOpen) {
      setIsVisible(false);
    } else {
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [sidebarOpen]);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(e);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top navbar mb-0">
      <Container fluid>
        <div className={`toggle-container ${sidebarOpen ? 'hidden' : ''}`}>
          {isVisible && (
            <Button 
              variant="warning" 
              className={`toggle-button ${sidebarOpen ? 'fade-out' : 'fade-in'}`}
              onClick={onSidebarToggle}
              aria-label="Toggle Sidebar"
            >
              <List size={15} />
            </Button>
          )}
        </div>
        <Navbar.Brand href="/purchaser/homepage">CARBON - Purchaser</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Form className="d-flex" onSubmit={onSubmit}>
            <FormControl
              type="text"
              placeholder="Search products..."
              className="me-sm-2"
              id="button"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="search-button" variant="outline-success" type="submit" id="button">Search</Button>
          </Form>
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