import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, Form, FormControl, Dropdown } from 'react-bootstrap';
import { List } from 'react-bootstrap-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import './TopNavbar.css';

const TopNavbar = ({ onSidebarToggle, sidebarOpen, searchQuery, setSearchQuery, handleSearch }) => {
  const [isVisible, setIsVisible] = useState(!sidebarOpen);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');

  useEffect(() => {
    if (sidebarOpen) {
      setIsVisible(false);
    } else {
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    // Fetch categories and subcategories
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/purchaser/categories', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        });
        if (!response.ok) throw new Error('Failed to fetch categories');

        const categoryData = await response.json();

        const subcategoryResponse = await fetch('http://localhost:3000/purchaser/subcategories', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        });
        if (!subcategoryResponse.ok) throw new Error('Failed to fetch subcategories');

        const subcategoryData = await subcategoryResponse.json();

        const categoriesWithSubcategories = categoryData.map(category => ({
          ...category,
          subcategories: subcategoryData.filter(sub => sub.category_id === category.id),
        }));

        setCategories(categoriesWithSubcategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
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

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top navbar mb-0">
      <Container fluid>
        <div className={`toggle-container ${sidebarOpen ? 'hidden' : ''}`}>
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
        </div>
        <Navbar.Brand href="/purchaser/homepage">CARBON - Purchaser</Navbar.Brand>
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
                    {categories.find(c => c.id === selectedCategory)?.name || 'Select Category'}
                    {selectedSubcategory !== 'All' && (
                      ` > ${categories
                        .find(c => c.id === selectedCategory)
                        ?.subcategories.find(sc => sc.id === selectedSubcategory)?.name}`
                    )}
                  </>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu">
                <Dropdown.Item onClick={() => handleCategorySelect('All')} id="button">
                  All Categories
                </Dropdown.Item>
                {categories.map(category => (
                  <Dropdown.Item key={category.id} onClick={() => handleCategorySelect(category.id)} id="button">
                    {category.name}
                    {category.subcategories.length > 0 && (
                      <div className="dropdown-submenu">
                        {category.subcategories.map(subcategory => (
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
              className="me-sm-2"
              value={searchQuery}
              id="button"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="warning" type="submit" id="button">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </Form>
          <Nav className="ms-auto">
            <Nav.Link href="/profile">Profile</Nav.Link>
            <Nav.Link href="/login">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
