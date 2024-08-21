import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col, Card, Form, ListGroup } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import './CategoriesManagement.css'; // Custom CSS

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', subcategories: [''] });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/admin/categories?search_query=${searchQuery}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [searchQuery]);

  const handleShowModal = (category = null) => {
    setSelectedCategory(category);
    setIsEditing(!!category);
    setShowModal(true);
    setNewCategory(category ? { ...category, subcategories: [...category.subcategories] } : { name: '', subcategories: [''] });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setNewCategory({ name: '', subcategories: [''] });
  };

  const handleSaveCategory = async () => {
    if (isEditing) {
      // Update category
      await fetch(`http://localhost:3000/admin/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });
    } else {
      // Create new category
      await fetch('http://localhost:3000/admin/categories', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });
    }
    handleCloseModal();
    setLoading(true); // Trigger re-fetching
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/categories', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  };

  const handleAddSubcategory = () => {
    setNewCategory({ ...newCategory, subcategories: [...newCategory.subcategories, ''] });
  };

  const handleRemoveSubcategory = (index) => {
    const updatedSubcategories = [...newCategory.subcategories];
    updatedSubcategories.splice(index, 1);
    setNewCategory({ ...newCategory, subcategories: updatedSubcategories });
  };

  const handleChangeSubcategory = (index, value) => {
    const updatedSubcategories = [...newCategory.subcategories];
    updatedSubcategories[index] = value;
    setNewCategory({ ...newCategory, subcategories: updatedSubcategories });
  };

  if (loading) {
    return (
      <div className="centered-loader">
        {/* Add your loading spinner here */}
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <TopNavbar />
      <div className="categories-management-page">
        <Container fluid className="p-0">
          <Row>
            <Col xs={12} md={2} className="p-0 d-flex flex-column">
              <Sidebar />
            </Col>
            <Col xs={12} md={10} className="p-2 d-flex flex-column">
              <Card className="section">
                <Card.Header className="text-center">
                  <Container fluid>
                    <Row className="justify-content-between align-items-center">
                      <Col xs={12} md={4} className="text-center">
                        <h3 className="mb-0">Categories</h3>
                      </Col>
                      <Col xs={12} md={8}>
                        <div className="search-container text-center">
                          <Form>
                            <Form.Group controlId="searchCategory">
                              <Form.Control
                                type="text"
                                placeholder="Search Categories"
                                className="form-control"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </Form.Group>
                          </Form>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </Card.Header>
                <Card.Body className="p-0 m-0">
                  {categories.length > 0 ? (
                    <ListGroup>
                      {categories.map((category) => (
                        <ListGroup.Item key={category.id} className="category-card">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h5>{category.name}</h5>
                              <ul>
                              {category.subcategories.map((subcategory, index) => (
                                <li key={index} className="subcategory-item">
                                    {subcategory.name} {/* Accessing the 'name' property */}
                                </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <Button variant="warning" onClick={() => handleShowModal(category)}>Edit</Button>{' '}
                              <Button variant="danger" onClick={() => console.log('Delete category', category.id)}>Delete</Button>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p>No categories available</p>
                  )}
                </Card.Body>
                <Card.Footer className="text-center">
                  <Button variant="primary" onClick={() => handleShowModal()}>
                    Add New Category
                  </Button>
                </Card.Footer>
              </Card>

              <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header className="justify-content-center">
                  <Modal.Title>{isEditing ? 'Edit Category' : 'Add New Category'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="categoryName">
                      <Form.Label>Category Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter category name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Label>Subcategories</Form.Label>
                    {newCategory.subcategories.map((subcategory, index) => (
                      <Form.Group key={index} className="d-flex align-items-center">
                        <Form.Control
                          type="text"
                          placeholder="Enter subcategory name"
                          value={subcategory.name}
                          onChange={(e) => handleChangeSubcategory(index, e.target.value)}
                        />
                        <Button variant="danger" onClick={() => handleRemoveSubcategory(index)} className="ml-2">
                          Remove
                        </Button>
                      </Form.Group>
                    ))}
                    <Button variant="success" onClick={handleAddSubcategory}>
                      Add Subcategory
                    </Button>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleSaveCategory}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default CategoriesManagement;
