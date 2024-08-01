import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import './ProductsManagement.css';

const ProductsManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/products', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error fetching products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <TopNavbar />
            <div className="products-management-page">
                <Container fluid className="p-0">
                    <Row>
                        <Col xs={12} md={2} className="p-0">
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={10} className="p-4">
                            <h2 className="mb-4 text-center">Products Management</h2>
                            <div className="search-container">
                                <InputGroup className="mb-3">
                                    <FormControl
                                        placeholder="Search products..."
                                        aria-label="Search products"
                                        aria-describedby="search-icon"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="search-input"
                                    />
                                    <InputGroup.Text id="search-icon" className="search-icon">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </InputGroup.Text>
                                </InputGroup>
                            </div>
                            <Row>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map(product => (
                                        <Col key={product.id} xs={12} md={6} lg={4} className="mb-4">
                                            <Card>
                                                <Card.Img variant="top" src={product.imageUrl} />
                                                <Card.Body>
                                                    <Card.Title>{product.title}</Card.Title>
                                                    <Card.Text>
                                                        Price: Ksh {product.price}
                                                    </Card.Text>
                                                    <Button variant="primary">View Details</Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <Col>
                                        <p>No products found</p>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default ProductsManagement;
