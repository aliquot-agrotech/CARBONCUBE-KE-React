import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import './HomePage.css'; // Import the CSS file

const HomePage = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchCategoriesAndProducts = async () => {
            try {
                const categoryResponse = await fetch('http://localhost:3000/purchaser/categories', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });
    
                if (!categoryResponse.ok) {
                    throw new Error('Failed to fetch categories');
                }
    
                const categoryData = await categoryResponse.json();
    
                // Fetch subcategories
                const subcategoryResponse = await fetch('http://localhost:3000/purchaser/subcategories', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });
    
                if (!subcategoryResponse.ok) {
                    throw new Error('Failed to fetch subcategories');
                }
    
                const subcategoryData = await subcategoryResponse.json();
    
                // Organize subcategories under categories
                const categoriesWithSubcategories = categoryData.map(category => ({
                    ...category,
                    subcategories: subcategoryData.filter(sub => sub.category_id === category.id)
                }));
    
                setCategories(categoriesWithSubcategories);
    
                const productResponse = await fetch('http://localhost:3000/purchaser/products', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });
    
                if (!productResponse.ok) {
                    throw new Error('Failed to fetch products');
                }
    
                const productData = await productResponse.json();
    
                // Organize products under their respective subcategories
                const productsBySubcategory = {};
                subcategoryData.forEach(subcategory => {
                    productsBySubcategory[subcategory.name] = productData
                        .filter(product => product.subcategory === subcategory.name)
                        .sort(() => 0.5 - Math.random()); // Randomize product order
                });
    
                setProducts(productsBySubcategory);
            } catch (error) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };
    
        fetchCategoriesAndProducts();
    }, []);
    

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const SubcategorySection = ({ subcategory, products }) => (
        <Card className="subcategory-section mb-4">
            <Card.Header className="text-center">
                <h4>{subcategory}</h4>
            </Card.Header>
            <Card.Body>
                <Row>
                    {products.slice(0, 4).map(product => (
                        <Col xs={12} sm={6} md={3} key={product.id}>
                            <Card className="product-card">
                                <Card.Img variant="top" src={product.media && product.media.length > 0 ? product.media[0] : 'default-image-url'} />
                                <Card.Body className="text-center">
                                    <Card.Title>{product.name}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    );
    

    const CategorySection = ({ title, subcategories }) => (
        <Card className="section mb-4">
            <Card.Header className="text-center category-header">
                <h3>{title}</h3>
            </Card.Header>
            <Card.Body>
                <Row>
                    {subcategories.slice(0, 4).map(subcategory => (
                        <Col xs={12} sm={6} md={3} key={subcategory.id}>
                            <SubcategorySection
                                subcategory={subcategory.name}
                                products={products[subcategory.name] || []}
                            />
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    );
    

    const PopularProductsSection = ({ products }) => (
        <Card className="section mb-4">
            <Card.Header className="text-center popular-products-header">
                <h3>Popular Products</h3>
            </Card.Header>
            <Card.Body>
                <Row>
                    {products.slice(0, 5).map(product => (
                        <Col xs={12} sm={6} md={2} key={product.id}>
                            <Card className="product-card">
                                <Card.Img variant="top" src={product.media && product.media.length > 0 ? product.media[0] : 'default-image-url'} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    );

    const Footer = () => (
        <footer className="footer mt-auto py-3">
            <Container>
                <Row>
                    <Col xs={12} md={3}>
                        <h5>Shopping Guide</h5>
                        <ul>
                            <li><a href="/how-to-pay">How Do I Pay?</a></li>
                            <li><a href="/how-to-shop">How Do I Shop?</a></li>
                            <li><a href="/flash-sales">Flash Sales/ Deals</a></li>
                        </ul>
                    </Col>
                    <Col xs={12} md={3}>
                        <h5>Customer Help Center</h5>
                        <ul>
                            <li><a href="/dispute-resolution">Dispute Resolution Center</a></li>
                            <li><a href="/terms-and-conditions">Terms and Conditions</a></li>
                            <li><a href="/account-settings">Account Settings</a></li>
                            <li><a href="/faqs">FAQs Center</a></li>
                        </ul>
                    </Col>
                    <Col xs={12} md={3}>
                        <h5>Business</h5>
                        <ul>
                            <li><a href="/become-a-vendor">Want to be a Vendor</a></li>
                            <li><a href="/vendor-help">Vendor Help Center</a></li>
                            <li><a href="/vendor-account-settings">Vendor Account Settings</a></li>
                            <li><a href="/faqs">FAQs Center</a></li>
                        </ul>
                    </Col>
                    <Col xs={12} md={3}>
                        <h5>Let's Connect:</h5>
                        <ul className="social-media-links">
                            <li><a href="https://twitter.com">Twitter</a></li>
                            <li><a href="https://whatsapp.com">WhatsApp</a></li>
                            <li><a href="https://instagram.com">Instagram</a></li>
                            <li><a href="https://facebook.com">Facebook</a></li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </footer>
    );

    if (loading) {
        return (
            <div className="centered-loader">
                <Spinner variant="warning" animation="border" role="status" style={{ width: 100, height: 100 }} />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <TopNavbar onSidebarToggle={handleSidebarToggle} />
            <div className="homepage d-flex flex-column min-vh-100">
                <Container fluid className="p-0 flex-grow-1">
                    <Row>
                        {sidebarOpen && (
                            <Col xs={12} md={2} className="sidebar-col p-0">
                                <Sidebar />
                            </Col>
                        )}
                        <Col xs={12} md={sidebarOpen ? 10 : 12} className="p-2">
                            <Button
                                variant="primary"
                                onClick={handleSidebarToggle}
                                className="toggle-sidebar-btn"
                            >
                                {sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
                            </Button>

                            {/* Displaying Category Sections with Subcategories */}
                            {categories.slice(0, 3).map(category => (
                                <CategorySection
                                    key={category.id}
                                    title={category.name}
                                    subcategories={category.subcategories || []}
                                />
                            ))}

                            {/* Popular Products Row */}
                            <PopularProductsSection products={Object.values(products).flat()} />
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </>
    );
};

export default HomePage;
