import React, { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Box, Truck, Envelope, Bell, GraphUp, XCircle, ArrowRight } from 'react-bootstrap-icons';
import { useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation(); // Get the current URL path

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Effect to auto-expand sidebar on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769 && !isOpen) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial check when the component mounts
    if (window.innerWidth >= 769) {
      setIsOpen(true);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <>
      <Button 
        variant="warning" 
        className={`toggle-button ${isOpen ? 'd-none' : 'd-block'}`} 
        onClick={toggleSidebar}>
        <ArrowRight size={15}/> {/* Arrow pointing right when sidebar is collapsed */}
      </Button>
      <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <Button 
          variant="warning" 
          className={`toggle-button1 d-md-none ${isOpen ? 'd-block' : 'd-none'}`}
          onClick={toggleSidebar}>
          <XCircle size={15}/> {/* Close button when sidebar is open */}
        </Button>
        <Nav className="flex-column">
          <Nav.Link
            href="/vendor/analytics-reporting"
            className={location.pathname === '/admin/analytics-reporting' ? 'active' : ''}>
            <GraphUp className="icon" /> {isOpen && 'Analytics & Reporting'}
          </Nav.Link>
          <Nav.Link
            href="/vendor/orders-management"
            className={location.pathname === '/admin/orders-management' ? 'active' : ''}>
            <Truck className="icon" /> {isOpen && 'Orders'}
          </Nav.Link>
          <Nav.Link
            href="/vendor/products-management"
            className={location.pathname === '/admin/products-management' ? 'active' : ''}>
            <Box className="icon" /> {isOpen && 'Products'}
          </Nav.Link>
          <Nav.Link
            href="/vendor/messages"
            className={location.pathname === '/admin/messages' ? 'active' : ''}>
            <Envelope className="icon" /> {isOpen && 'Messages'}
          </Nav.Link>
          <Nav.Link
            href="/vendor/notifications"
            className={location.pathname === '/admin/notifications' ? 'active' : ''}>
            <Bell className="icon" /> {isOpen && 'Notifications'}
          </Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
