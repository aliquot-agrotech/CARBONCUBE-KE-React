import React, { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BookmarkDash,
  PersonCheck,
  XCircle,
  ArrowRight,
  ChatSquareText,
  HouseGear
} from 'react-bootstrap-icons';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleProtectedClick = (e, path) => {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
      e.preventDefault();
      Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'You need to be logged in to access this page.',
        confirmButtonText: 'Go to Login',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        confirmButtonColor: '#f0ad4e',
        cancelButtonColor: '#6c757d',
        customClass: {
          popup: 'rounded-4 shadow-sm',
          title: 'fw-bold',
          actions: 'swal2-button-group-custom', // custom layout
          confirmButton: 'btn btn-warning rounded-pill px-4 mb-2 mb-md-0 me-md-3',
          cancelButton: 'btn btn-secondary rounded-pill px-4'
        },
        backdrop: 'rgba(0, 0, 0, 0.4)',
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
    }
  };  

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
            onClick={(e) => handleProtectedClick(e, '/purchaser/home')}
            className={location.pathname === '/purchaser/home' ? 'active' : ''}
          >
            <HouseGear className="icon" /> {isOpen && 'Home'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/wish_lists"
            onClick={(e) => handleProtectedClick(e, '/purchaser/wish_lists')}
            className={location.pathname === '/purchaser/wish_lists' ? 'active' : ''}
          >
            <BookmarkDash className="icon" /> {isOpen && 'Wish List'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/messages"
            onClick={(e) => handleProtectedClick(e, '/purchaser/messages')}
            className={location.pathname === '/purchaser/messages' ? 'active' : ''}
          >
            <ChatSquareText className="icon" /> {isOpen && 'Messages'}
          </Nav.Link>
          <Nav.Link
            href="/purchaser/profile"
            onClick={(e) => handleProtectedClick(e, '/purchaser/profile')}
            className={location.pathname === '/purchaser/profile' ? 'active' : ''}
          >
            <PersonCheck className="icon" /> {isOpen && 'Profile'}
          </Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
