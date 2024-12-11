import React, { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { BookmarkDash, PersonCheck, XCircle, ArrowRight, Cart4, ChatSquareText, BagCheck, HouseGear } from 'react-bootstrap-icons';
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
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <XCircle size={15} /> : <ArrowRight size={15} />}
      </Button>
      <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <Nav className="flex-column">
          <Nav.Link
            href="/purchaser/home"
            className={location.pathname === '/purchaser/home' ? 'active' : ''}>
            <HouseGear className="icon" /> {isOpen && 'Home'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/orders"
            className={location.pathname === '/purchaser/orders' ? 'active' : ''}>
            <BagCheck className="icon" /> {isOpen && 'Orders'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/wish_lists"
            className={location.pathname === '/purchaser/wish_lists' ? 'active' : ''}>
            <BookmarkDash className="icon" /> {isOpen && 'Wish List'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/cart"
            className={location.pathname === '/purchaser/cart' ? 'active' : ''}>
            <Cart4 className="icon" /> {isOpen && 'Cart'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/buyforme"
            className={location.pathname === '/purchaser/buyforme' ? 'active' : ''}>
            <Cart4 className="icon" /> {isOpen && 'Buy For Me'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/messages"
            className={location.pathname === '/purchaser/messages' ? 'active' : ''}>
            <ChatSquareText className="icon" /> {isOpen && 'Messages'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/profile"
            className={location.pathname === '/purchaser/profile' ? 'active' : ''}>
            <PersonCheck className="icon" /> {isOpen && 'Profile'}
          </Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
