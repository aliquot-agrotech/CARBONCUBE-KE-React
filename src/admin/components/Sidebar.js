import React, { useState } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { House, Box, Truck, Person, FileText, Percent, Envelope, Bell, GraphUp, ArrowLeft, ArrowRight } from 'react-bootstrap-icons';
import { useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState('');
  const [previousClicked, setPreviousClicked] = useState('');

  const location = useLocation(); // Get the current URL path

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleDropdownClick = (dropdown) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown('');
    } else {
      setActiveDropdown(dropdown);
    }
    setPreviousClicked(dropdown);
  };

  const handleNonDropdownClick = () => {
    setActiveDropdown('');
    setPreviousClicked('');
  };

  return (
    <>
      <Button
        variant="warning"
        className={`toggle-button ${isOpen ? 'd-none' : 'd-block'}`}
        onClick={toggleSidebar}>
        <ArrowRight /> {/* Arrow pointing right when sidebar is collapsed */}
      </Button>
      <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <Button
          variant="warning"
          className={`toggle-button d-md-none ${isOpen ? 'd-block' : 'd-none'}`}
          onClick={toggleSidebar}>
          <ArrowLeft /> {/* Arrow pointing left when sidebar is open */}
        </Button>
        <Nav className="flex-column">
          <Nav.Link
            href="/admin/analytics-reporting"
            className={location.pathname === '/admin/analytics-reporting' ? 'active' : ''}
            onClick={handleNonDropdownClick}>
            <GraphUp className="icon" /> {isOpen && 'Analytics & Reporting'}
          </Nav.Link>
          <Nav.Link
            href="/admin/orders-management"
            className={location.pathname === '/admin/orders-management' ? 'active' : ''}
            onClick={handleNonDropdownClick}>
            <Truck className="icon" /> {isOpen && 'Orders'}
          </Nav.Link>
          <Nav.Link
            onClick={() => handleDropdownClick('products')}
            className={`${activeDropdown === 'products' ? 'active' : ''} ${previousClicked === 'products' && activeDropdown !== 'products' ? 'previous' : ''}`}>
            <Box className="icon" /> {isOpen && 'Products'}
          </Nav.Link>
          {activeDropdown === 'products' && (
            <>
              <Nav.Link
                href="/admin/products-management/active"
                className={`dropdown-item ${location.pathname === '/admin/products-management/active' ? 'active' : ''}`}>
                {isOpen && 'Active'}
              </Nav.Link>
              <Nav.Link
                href="/admin/products-management/flagged"
                className={`dropdown-item ${location.pathname === '/admin/products-management/flagged' ? 'active' : ''}`}>
                {isOpen && 'Flagged'}
              </Nav.Link>
            </>
          )}
          <Nav.Link
            onClick={() => handleDropdownClick('vendors')}
            className={`${activeDropdown === 'vendors' ? 'active' : ''} ${previousClicked === 'vendors' && activeDropdown !== 'vendors' ? 'previous' : ''}`}>
            <House className="icon" /> {isOpen && 'Vendors'}
          </Nav.Link>
          {activeDropdown === 'vendors' && (
            <>
              <Nav.Link
                href="/admin/vendors-management/active"
                className={`dropdown-item ${location.pathname === '/admin/vendors-management/active' ? 'active' : ''}`}>
                {isOpen && 'Active'}
              </Nav.Link>
              <Nav.Link
                href="/admin/vendors-management/blocked"
                className={`dropdown-item ${location.pathname === '/admin/vendors-management/blocked' ? 'active' : ''}`}>
                {isOpen && 'Blocked'}
              </Nav.Link>
            </>
          )}
          <Nav.Link
            onClick={() => handleDropdownClick('purchasers')}
            className={`${activeDropdown === 'purchasers' ? 'active' : ''} ${previousClicked === 'purchasers' && activeDropdown !== 'purchasers' ? 'previous' : ''}`}>
            <Person className="icon" /> {isOpen && 'Purchasers'}
          </Nav.Link>
          {activeDropdown === 'purchasers' && (
            <>
              <Nav.Link
                href="/admin/purchasers-management/active"
                className={`dropdown-item ${location.pathname === '/admin/purchasers-management/active' ? 'active' : ''}`}>
                {isOpen && 'Active'}
              </Nav.Link>
              <Nav.Link
                href="/admin/purchasers-management/blocked"
                className={`dropdown-item ${location.pathname === '/admin/purchasers-management/blocked' ? 'active' : ''}`}>
                {isOpen && 'Blocked'}
              </Nav.Link>
            </>
          )}
          <Nav.Link
            href="/admin/content-management"
            className={location.pathname === '/admin/content-management' ? 'active' : ''}
            onClick={handleNonDropdownClick}>
            <FileText className="icon" /> {isOpen && 'Content'}
          </Nav.Link>
          <Nav.Link
            href="/admin/promotions-discount"
            className={location.pathname === '/admin/promotions-discount' ? 'active' : ''}
            onClick={handleNonDropdownClick}>
            <Percent className="icon" /> {isOpen && 'Promotions & Discount'}
          </Nav.Link>
          <Nav.Link
            href="/admin/messages"
            className={location.pathname === '/admin/messages' ? 'active' : ''}
            onClick={handleNonDropdownClick}>
            <Envelope className="icon" /> {isOpen && 'Messages'}
          </Nav.Link>
          <Nav.Link
            href="/admin/notifications"
            className={location.pathname === '/admin/notifications' ? 'active' : ''}
            onClick={handleNonDropdownClick}>
            <Bell className="icon" /> {isOpen && 'Notifications'}
          </Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
