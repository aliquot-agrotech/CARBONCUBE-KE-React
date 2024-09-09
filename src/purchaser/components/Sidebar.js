import React, { useState } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { BookmarkDash, Person, XCircle, ArrowRight, Cart4, Bell, ChatSquareText, BagCheck, HouseGear } from 'react-bootstrap-icons';
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
        id="button"
        aria-label="Toggle Sidebar" // Accessibility
      >
        {isOpen ? <XCircle size={15} /> : <ArrowRight size={15} />}
      </Button>
      <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <Nav className="flex-column">
          <Nav.Link
            href="/purchaser/homepage"
            className={location.pathname === '/purchaser/homepage' ? 'active' : ''}>
            <HouseGear className="icon" /> {isOpen && 'HomePage'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/orders"
            className={location.pathname === '/purchaser/orders' ? 'active' : ''}>
            <BagCheck className="icon" /> {isOpen && 'Orders'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/bookmarks"
            className={location.pathname === '/purchaser/bookmarks' ? 'active' : ''}>
            <BookmarkDash className="icon" /> {isOpen && 'Bookmarks'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/shopping-cart"
            className={location.pathname === '/purchaser/shopping-cart' ? 'active' : ''}>
            <Cart4 className="icon" /> {isOpen && 'Shopping Cart'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/messages"
            className={location.pathname === '/purchaser/messages' ? 'active' : ''}>
            <ChatSquareText className="icon" /> {isOpen && 'Messages'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/notifications"
            className={location.pathname === '/purchaser/notifications' ? 'active' : ''}>
            <Bell className="icon" /> {isOpen && 'Notifications'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/profile"
            className={location.pathname === '/purchaser/profile' ? 'active' : ''}>
            <Person className="icon" /> {isOpen && 'Profile'}
          </Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;