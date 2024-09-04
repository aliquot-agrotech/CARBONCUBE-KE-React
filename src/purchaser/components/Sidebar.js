import React, { useState } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { House, Box, Truck, Person, FileText, GraphUp, XCircle, ArrowRight, List } from 'react-bootstrap-icons';
import { useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button 
        variant="warning" 
        className={`toggle-button ${isOpen ? 'open' : 'collapsed'}`} 
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar" // Accessibility
      >
        {isOpen ? <XCircle size={15} /> : <ArrowRight size={15} />}
      </Button>
      <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <Nav className="flex-column">
          <Nav.Link
            href="/purchaser/homepage"
            className={location.pathname === '/purchaser/homepage' ? 'active' : ''}>
            <GraphUp className="icon" /> {isOpen && 'HomePage'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/orders-history"
            className={location.pathname === '/purchaser/orders-history' ? 'active' : ''}>
            <Truck className="icon" /> {isOpen && 'Orders'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/bookmarks"
            className={location.pathname === '/purchaser/bookmarks' ? 'active' : ''}>
            <Box className="icon" /> {isOpen && 'Bookmarks'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/shopping-cart"
            className={location.pathname === '/purchaser/shopping-cart' ? 'active' : ''}>
            <List className="icon" /> {isOpen && 'Shopping Cart'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/messages"
            className={location.pathname === '/purchaser/messages' ? 'active' : ''}>
            <House className="icon" /> {isOpen && 'Messages'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/notifications"
            className={location.pathname === '/purchaser/notifications' ? 'active' : ''}>
            <Person className="icon" /> {isOpen && 'Notifications'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/profile"
            className={location.pathname === '/purchaser/profile' ? 'active' : ''}>
            <FileText className="icon" /> {isOpen && 'Profile'}
          </Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;