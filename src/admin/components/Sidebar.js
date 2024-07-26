import React, { useState } from 'react';
import { Nav, Button } from 'react-bootstrap';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <Button variant="warning" className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? 'Collapse' : 'Expand'}
      </Button>
      <Nav defaultActiveKey="/admin/analytics-reporting" className="flex-column">
        <Nav.Link href="/admin/analytics-reporting">Analytics & Reporting</Nav.Link>
        <Nav.Link href="/admin/products-management">Products Management</Nav.Link>
        <Nav.Link href="/admin/orders-management">Orders Management</Nav.Link>
        <Nav.Link href="/admin/vendors-management">Vendors Management</Nav.Link>
        <Nav.Link href="/admin/customers-management">Customers Management</Nav.Link>
        <Nav.Link href="/admin/content-management">Content Management</Nav.Link>
        <Nav.Link href="/admin/promotions-discount">Promotions & Discount</Nav.Link>
        <Nav.Link href="/admin/messages">Messages</Nav.Link>
        <Nav.Link href="/admin/notifications">Notifications</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
