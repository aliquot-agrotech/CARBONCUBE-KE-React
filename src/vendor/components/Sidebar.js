import React, { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Box, Truck, Envelope, GraphUp, XCircle, ArrowRight, Person } from 'react-bootstrap-icons';
import { useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Default to closed on initial load
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 1024); // Open by default on larger screens
    };

    // Set initial state based on screen width when component mounts
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Button 
        variant="warning" 
        className={`toggle-button ${isOpen ? 'open' : 'collapsed'}`} 
        onClick={toggleSidebar}
        id="button"
        aria-label="Toggle Sidebar" // Accessibility
      >
        {isOpen ? <XCircle size={15} /> : <ArrowRight size={15} />}
      </Button>
      <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <Nav className="flex-column">
          <Nav.Link
            href="/vendor/vendor-analytics"
            className={location.pathname === '/vendor/vendor-analytics' ? 'active' : ''}>
            <GraphUp className="icon" /> {isOpen && 'Analytics'}
          </Nav.Link>
          <Nav.Link
            href="/vendor/vendor-orders"
            className={location.pathname === '/vendor/vendor-orders' ? 'active' : ''}>
            <Truck className="icon" /> {isOpen && 'Orders'}
          </Nav.Link>
          <Nav.Link
            href="/vendor/vendor-products"
            className={location.pathname === '/vendor/vendor-products' ? 'active' : ''}>
            <Box className="icon" /> {isOpen && 'Products'}
          </Nav.Link>
          <Nav.Link
            href="/vendor/messages"
            className={location.pathname === '/vendor/messages' ? 'active' : ''}>
            <Envelope className="icon" /> {isOpen && 'Messages'}
          </Nav.Link>
          {/* <Nav.Link
            href="/vendor/vendor-notifications"
            className={location.pathname === '/vendor/vendor-notifications' ? 'active' : ''}>
            <Bell className="icon" /> {isOpen && 'Notifications'}
          </Nav.Link> */}
          <Nav.Link
            href="/vendor/profile"
            className={location.pathname === '/vendor/profile' ? 'active' : ''}>
            <Person className="icon" /> {isOpen && 'Profile'}
          </Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;