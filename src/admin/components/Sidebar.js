import React, { useState } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { House, Box, Truck, Person, FileText, Percent, Envelope, Bell, GraphUp,  ArrowLeft, ArrowRight } from 'react-bootstrap-icons';
import { useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation(); // Get the current URL path

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button 
        variant="warning" 
        className={`toggle-button ${isOpen ? 'd-none' : 'd-block'}`} 
        onClick={toggleSidebar}
      >
        <ArrowRight /> {/* Arrow pointing right when sidebar is collapsed */}
      </Button>
      <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <Button 
          variant="warning" 
          className={`toggle-button d-md-none ${isOpen ? 'd-block' : 'd-none'}`} 
          onClick={toggleSidebar}
        >
          <ArrowLeft /> {/* Arrow pointing left when sidebar is open */}
        </Button>
        <Nav className="flex-column">
          <Nav.Link
            href="/admin/analytics-reporting"
            className={location.pathname === '/admin/analytics-reporting' ? 'active' : ''}
          >
            <GraphUp className="icon" /> {isOpen && 'Analytics & Reporting'}
          </Nav.Link>
          <Nav.Link
            href="/admin/products-management"
            className={location.pathname === '/admin/products-management' ? 'active' : ''}
          >
            <Box className="icon" /> {isOpen && 'Products Management'}
          </Nav.Link>
          <Nav.Link
            href="/admin/orders-management"
            className={location.pathname === '/admin/orders-management' ? 'active' : ''}
          >
            <Truck className="icon" /> {isOpen && 'Orders Management'}
          </Nav.Link>
          <Nav.Link
            href="/admin/vendors-management"
            className={location.pathname === '/admin/vendors-management' ? 'active' : ''}
          >
            <House className="icon" /> {isOpen && 'Vendors Management'}
          </Nav.Link>
          <Nav.Link
            href="/admin/customers-management"
            className={location.pathname === '/admin/customers-management' ? 'active' : ''}
          >
            <Person className="icon" /> {isOpen && 'Customers Management'}
          </Nav.Link>
          <Nav.Link
            href="/admin/content-management"
            className={location.pathname === '/admin/content-management' ? 'active' : ''}
          >
            <FileText className="icon" /> {isOpen && 'Content Management'}
          </Nav.Link>
          <Nav.Link
            href="/admin/promotions-discount"
            className={location.pathname === '/admin/promotions-discount' ? 'active' : ''}
          >
            <Percent className="icon" /> {isOpen && 'Promotions & Discount'}
          </Nav.Link>
          <Nav.Link
            href="/admin/messages"
            className={location.pathname === '/admin/messages' ? 'active' : ''}
          >
            <Envelope className="icon" /> {isOpen && 'Messages'}
          </Nav.Link>
          <Nav.Link
            href="/admin/notifications"
            className={location.pathname === '/admin/notifications' ? 'active' : ''}
          >
            <Bell className="icon" /> {isOpen && 'Notifications'}
          </Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
