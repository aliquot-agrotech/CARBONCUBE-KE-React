import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, Form, FormControl, Dropdown, Row, Col } from 'react-bootstrap';
// import { List } from 'react-bootstrap-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import './TopNavbar.css';

const TopNavbar = ({ onSidebarToggle, sidebarOpen, searchQuery, setSearchQuery, handleSearch }) => {
  // const [isVisible, setIsVisible] = useState(!sidebarOpen);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // useEffect(() => {
  //   if (sidebarOpen) {
  //     setIsVisible(false);
  //   } else {
  //     const timer = setTimeout(() => setIsVisible(true), 300);
  //     return () => clearTimeout(timer);
  //   }
  // }, [sidebarOpen]);

  useEffect(() => {
    // Fetch categories and subcategories
    const fetchCategories = async () => {
      try {
        console.log('Token:', sessionStorage.getItem('token'));

        const response = await fetch('https://carboncube-ke-rails-4xo3.onrender.com/purchaser/categories', {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          }, 
        });
        if (!response.ok) throw new Error('Failed to fetch categories');

        const categoryData = await response.json();

        const subcategoryResponse = await fetch('https://carboncube-ke-rails-4xo3.onrender.com/purchaser/subcategories', {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
        });
        if (!subcategoryResponse.ok) throw new Error('Failed to fetch subcategories');

        const subcategoryData = await subcategoryResponse.json();

        const categoriesWithSubcategories = categoryData.map((category) => ({
          ...category,
          subcategories: subcategoryData.filter((sub) => sub.category_id === category.id),
        }));

        setCategories(categoriesWithSubcategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();

    // Check if the purchaser is logged in by verifying the presence of the token
    const token = sessionStorage.getItem('token');
    setIsLoggedIn(!!token); // If token exists, set isLoggedIn to true
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('All');
  };

  const handleSubcategorySelect = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(e, selectedCategory, selectedSubcategory);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Remove the token from sessionStorage on logout
    setIsLoggedIn(false); // Set the login state to false
    window.location.href = '/login'; // Redirect to the login page
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top navbar mb-0 p-1">
      <Container fluid>
        {/* <div className={`toggle-container ${sidebarOpen ? 'hidden' : ''}`}>
          {isVisible && (
            <Button
              variant="warning"
              className={`toggle-button ${sidebarOpen ? 'fade-out' : 'fade-in'}`}
              onClick={onSidebarToggle}
              aria-label="Toggle Sidebar"
            >
              <List size={15} />
            </Button>
          )}
        </div> */}
        <Navbar.Brand href="/home" className="d-flex align-items-center">
            <img
              src={`${process.env.PUBLIC_URL}/logo.png`}
              alt="Carboncube Logo"
              width="40"  // Adjust size as needed
              height="40"  // Adjust size as needed
              className="d-inline-block align-top"
            />
            <span className="ml-2">ARBONCUBE</span>
          </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Form className="d-flex search-control" onSubmit={onSubmit}>
            <Dropdown className="me-2 dropdown-filter">
              <Dropdown.Toggle variant="warning" id="button">
                {selectedCategory === 'All' && selectedSubcategory === 'All' ? (
                  <FontAwesomeIcon icon={faFilter} />
                ) : (
                  <>
                    {categories.find((c) => c.id === selectedCategory)?.name || 'Select Category'}
                    {selectedSubcategory !== 'All' && (
                      <>
                        {' '}
                        {categories
                          .find((c) => c.id === selectedCategory)
                          ?.subcategories.find((sc) => sc.id === selectedSubcategory)?.name}
                      </>
                    )}
                  </>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu">
                <Dropdown.Item onClick={() => handleCategorySelect('All')} id="button">
                  All Categories
                </Dropdown.Item>
                {categories.map((category) => (
                  <Dropdown.Item key={category.id} onClick={() => handleCategorySelect(category.id)} id="button">
                    {category.name}
                    {category.subcategories.length > 0 && (
                      <div className="dropdown-submenu">
                        {category.subcategories.map((subcategory) => (
                          <Dropdown.Item
                            key={subcategory.id}
                            id="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubcategorySelect(subcategory.id);
                            }}
                          >
                            * {subcategory.name}
                          </Dropdown.Item>
                        ))}
                      </div>
                    )}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <FormControl
              type="text"
              placeholder="Search products..."
              className="me-sm-2 me-2"
              value={searchQuery}
              id="button"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="warning" type="submit" id="button">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </Form>
          {/* Navigation buttons for Vendors and Login/Logout */}
          <Nav className="ms-auto">
            <Row className="d-flex justify-content-center">
              <Col className="text-center">
                <Button variant="secondary" href="/login" className="ms-2 w-100" id="button">
                  Rider
                </Button>
              </Col>
              <Col className="text-center">
                <Button variant="warning" href="/login" className="ms-2 w-100" id="button">
                  Vendor
                </Button>
              </Col>
              <Col className="text-center">
                {isLoggedIn ? (
                  <Button variant="warning" onClick={handleLogout} className="ms-2 w-100" id="button" style={{ whiteSpace: 'nowrap' }}>
                    Sign out
                  </Button>
                ) : (
                  <Button variant="outline-warning" href="/login" className="ms-2 w-100" id="button">
                    Sign in
                  </Button>
                )}
              </Col>
            </Row>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
