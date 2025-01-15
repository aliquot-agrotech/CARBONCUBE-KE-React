import React, { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Shop, Box, BagCheck, PersonCheck, FileText, Percent, Envelope, GraphUp, XCircle, ArrowRight, List, Union } from 'react-bootstrap-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMotorcycle } from '@fortawesome/free-solid-svg-icons';
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
            href="/admin/analytics"
            className={location.pathname === '/admin/analytics' ? 'active' : ''}>
            <GraphUp className="icon" /> {isOpen && 'Analytics'}
          </Nav.Link>
          <Nav.Link
            href="/admin/orders"
            className={location.pathname === '/admin/orders' ? 'active' : ''}>
            <BagCheck className="icon" /> {isOpen && 'Orders'}
          </Nav.Link>
          <Nav.Link
            href="/admin/ads"
            className={location.pathname === '/admin/ads' ? 'active' : ''}>
            <Box className="icon" /> {isOpen && 'Ads'}
          </Nav.Link>
          <Nav.Link
            href="/admin/categories"
            className={location.pathname === '/admin/categories' ? 'active' : ''}>
            <List className="icon" /> {isOpen && 'Categories'}
          </Nav.Link>
          <Nav.Link
            href="/admin/tiers"
            className={location.pathname === '/admin/tiers' ? 'active' : ''}>
            <Union className="icon" /> {isOpen && 'Tiers'}
          </Nav.Link>
          <Nav.Link
            href="/admin/vendors"
            className={location.pathname === '/admin/vendors' ? 'active' : ''}>
            <Shop className="icon" /> {isOpen && 'Vendors'}
          </Nav.Link>
          <Nav.Link
            href="/admin/riders"
            className={location.pathname === '/admin/riders' ? 'active' : ''}
            >
            <FontAwesomeIcon icon={faMotorcycle} className="icon" /> {isOpen && 'Riders'}
          </Nav.Link>

          <Nav.Link
            href="/admin/purchasers"
            className={location.pathname === '/admin/purchasers' ? 'active' : ''}>
            <PersonCheck className="icon" /> {isOpen && 'Purchasers'}
          </Nav.Link>
          <Nav.Link
            href="/admin/content"
            className={location.pathname === '/admin/content' ? 'active' : ''}>
            <FileText className="icon" /> {isOpen && 'CMS'}
          </Nav.Link>
          <Nav.Link
            href="/admin/promotions"
            className={location.pathname === '/admin/promotions' ? 'active' : ''}>
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