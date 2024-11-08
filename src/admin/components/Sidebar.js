import React, { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { House, Box, Truck, Person, FileText, Percent, Envelope, GraphUp, XCircle, ArrowRight, List } from 'react-bootstrap-icons';
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
            href="/admin/analytics-reporting"
            className={location.pathname === '/admin/analytics-reporting' ? 'active' : ''}>
            <GraphUp className="icon" /> {isOpen && 'Analytics'}
          </Nav.Link>
          <Nav.Link
            href="/admin/orders-management"
            className={location.pathname === '/admin/orders-management' ? 'active' : ''}>
            <Truck className="icon" /> {isOpen && 'Orders'}
          </Nav.Link>
          <Nav.Link
            href="/admin/products-management"
            className={location.pathname === '/admin/products-management' ? 'active' : ''}>
            <Box className="icon" /> {isOpen && 'Products'}
          </Nav.Link>
          <Nav.Link
            href="/admin/categories-management"
            className={location.pathname === '/admin/categories-management' ? 'active' : ''}>
            <List className="icon" /> {isOpen && 'Categories'}
          </Nav.Link>
          <Nav.Link
            href="/admin/vendors-management"
            className={location.pathname === '/admin/vendors-management' ? 'active' : ''}>
            <House className="icon" /> {isOpen && 'Vendors'}
          </Nav.Link>
          <Nav.Link
            href="/admin/purchasers-management"
            className={location.pathname === '/admin/purchasers-management' ? 'active' : ''}>
            <Person className="icon" /> {isOpen && 'Purchasers'}
          </Nav.Link>
          <Nav.Link
            href="/admin/content-management"
            className={location.pathname === '/admin/content-management' ? 'active' : ''}>
            <FileText className="icon" /> {isOpen && 'CMS'}
          </Nav.Link>
          <Nav.Link
            href="/admin/promotions-discount"
            className={location.pathname === '/admin/promotions-discount' ? 'active' : ''}>
            <Percent className="icon" /> {isOpen && 'Promotions'}
          </Nav.Link>
          <Nav.Link
            href="/admin/messages"
            className={location.pathname === '/admin/messages' ? 'active' : ''}>
            <Envelope className="icon" /> {isOpen && 'Messages'}
          </Nav.Link>
          {/* <Nav.Link
            href="/admin/notifications"
            className={location.pathname === '/admin/notifications' ? 'active' : ''}>
            <Bell className="icon" /> {isOpen && 'Notifications'}
          </Nav.Link> */}
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;