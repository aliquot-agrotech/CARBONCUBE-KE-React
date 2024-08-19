import React, { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { House, Box, Truck, Person, FileText, Percent, Envelope, Bell, GraphUp, XCircle, ArrowRight, List } from 'react-bootstrap-icons';
import { useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [animateNotification, setAnimateNotification] = useState(false);
  const location = useLocation(); // Get the current URL path

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token found');

      const response = await fetch('http://localhost:3000/admin/notifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setNotificationCount(data.length);

      if (data.length > 0) {
        setAnimateNotification(true);
        setTimeout(() => setAnimateNotification(false), 500); // Duration of the animation
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 5000); // Fetch notifications every 5 seconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

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
            href="/admin/analytics-reporting"
            className={location.pathname === '/admin/analytics-reporting' ? 'active' : ''}>
            <GraphUp className="icon" /> {isOpen && 'Analytics & Reporting'}
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
            <Percent className="icon" /> {isOpen && 'Promotions & Discount'}
          </Nav.Link>
          <Nav.Link
            href="/admin/messages"
            className={location.pathname === '/admin/messages' ? 'active' : ''}>
            <Envelope className="icon" /> {isOpen && 'Messages'}
          </Nav.Link>
          <Nav.Link
            href="/admin/notifications"
            className={`notification-link ${location.pathname === '/admin/notifications' ? 'active' : ''} ${animateNotification ? 'animate' : ''}`}>
            <Bell className="icon" /> {isOpen && `Notifications (${notificationCount})`}
          </Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
