import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col, Card, Form } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import Spinner from "react-spinkit";
import './CategoriesManagement.css'; // Custom CSS

const CategoriesManagement = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', subcategories: [''] });

    useEffect(() => {
        const fetchCategories = async () => {
        try {
            const response = await fetch(`http://localhost:3000/admin/categories`, {
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
    }, []);

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
            <Spinner variant="warning" name="cube-grid" style={{ width: 100, height: 100 }} />
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
                    <Card.Header className="justify-content-center">
                        <h3 className="mb-0">Categories</h3>
                    </Card.Header>
                    <Card.Body className="p-0 m-0">
                        {categories.length > 0 ? (
                            <Container>
                                <Row>
                                    {categories.map((category) => (
                                    <Col xs={12} md={6} lg={6} key={category.id} className="mb-3">
                                        <Card className="category-card">
                                            <Card.Header className="justify-content-center"><h3 className="mb-0">{category.name}</h3></Card.Header>
                                            <Card.Body className="justify-content-between align-items-center custom-card2">
                                                <ul>
                                                    {category.subcategories.map((subcategory, index) => (
                                                        <li key={index} className="subcategory-item">
                                                        {subcategory.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Card.Body>
                                            <Card.Footer className="d-flex justify-content-end">
                                                <Button variant="warning" id="button" onClick={() => handleShowModal(category)}>
                                                    Edit
                                                </Button>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                    ))}
                                </Row>
                            </Container>
                        ) : (
                            <p>No categories available</p>
                        )}
                    </Card.Body>


                    <Card.Footer className="text-center">
                    <Button variant="warning" id="button" onClick={() => handleShowModal()}>
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
                            <Form.Group>
                                <div className="text-center">
                                    <Form.Label><h4><strong>Category Name</strong></h4></Form.Label>
                                </div>
                            </Form.Group>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter category name"
                                    className="me-2 mb-2"
                                    id="button"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group>
                                <div className="text-center">
                                    <Form.Label><h5><strong>Subcategories</strong></h5></Form.Label>
                                </div>
                            </Form.Group>
                                {newCategory.subcategories.map((subcategory, index) => (
                                <Form.Group key={index} className="d-flex align-items-center">
                                    <Form.Control
                                    type="text"
                                    placeholder="Enter subcategory name"
                                    className="me-2 mb-2"
                                    id="button"
                                    value={subcategory.name}
                                    onChange={(e) => handleChangeSubcategory(index, e.target.value)}
                                    />
                                    <Button variant="danger" id="button" onClick={() => handleRemoveSubcategory(index)}>
                                        Remove
                                    </Button>
                                </Form.Group>
                            ))}
                            <Button variant="success" id="button" onClick={handleAddSubcategory}>
                            Add Subcategory
                            </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="warning" onClick={handleSaveCategory}>
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
