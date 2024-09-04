import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import Banner from './components/Banner';
import './HomePage.css';

const HomePage = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const fetchCategoriesAndProducts = async () => {
            try {
                const categoryResponse = await fetch('http://localhost:3000/purchaser/categories', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                if (!categoryResponse.ok) throw new Error('Failed to fetch categories');

                const categoryData = await categoryResponse.json();

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

                const productResponse = await fetch('http://localhost:3000/purchaser/products', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                if (!productResponse.ok) throw new Error('Failed to fetch products');

                const productData = await productResponse.json();

                const productsBySubcategory = {};
                subcategoryData.forEach(subcategory => {
                    productsBySubcategory[subcategory.id] = productData
                        .filter(product => product.subcategory_id === subcategory.id)
                        .sort(() => 0.5 - Math.random());
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

    const handleSearch = async (e, category = 'All', subcategory = 'All') => {
        e.preventDefault();
        setIsSearching(true);
        try {
            const response = await fetch(`http://localhost:3000/purchaser/products/search?query=${searchQuery}&category=${category}&subcategory=${subcategory}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });
            if (!response.ok) throw new Error('Failed to fetch search results');

            const results = await response.json();
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching products:', error);
            setError('Error searching products');
        } finally {
            setIsSearching(false);
        }
    };

    const CategorySection = ({ title, subcategories }) => (
        <Card className="section mb-4">
            <Card.Header className="category-header d-flex justify-content-start">
                <h4 className='m-0'>{title}</h4>
            </Card.Header>
            <Card.Body>
                <Row>
                    {subcategories.slice(0, 4).map(subcategory => (
                        <Col xs={12} sm={6} md={3} key={subcategory.id}>
                            <SubcategorySection
                                subcategory={subcategory.name}
                                products={products[subcategory.id] || []}
                            />
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    );

    const SubcategorySection = ({ subcategory, products }) => {
        const displayedProducts = products.slice(0, 4);

        const productRows = [];
        for (let i = 0; i < displayedProducts.length; i += 2) {
            productRows.push(displayedProducts.slice(i, i + 2));
        }

        return (
            <Card className="subcategory-section mb-2">
                <Card.Body className="p-2">
                    {productRows.map((row, index) => (
                        <Row key={index} className="mb-2">
                            {row.map(product => (
                                <Col xs={12} sm={6} key={product.id}>
                                    <Card className="product-card">
                                        <Card.Img
                                            variant="top"
                                            src={product.media_urls && product.media_urls.length > 0 ? product.media_urls[0] : 'default-image-url'}
                                            alt={product.title}
                                            className="product-image"
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ))}
                </Card.Body>
                <Card.Footer className="d-flex justify-content-start">
                    <h5 className='m-0'>{subcategory}</h5>
                </Card.Footer>
            </Card>
        );
    };

    const PopularProductsSection = ({ products }) => (
        <Card className="section mb-4">
            <Card.Header className="d-flex justify-content-start popular-products-header">
                <h3>Popular Products</h3>
            </Card.Header>
            <Card.Body>
                <Row>
                    {products.slice(0, 6).map(product => (
                        <Col xs={12} sm={6} md={2} key={product.id}>
                            <Card className="product-card">
                                <Card.Img variant="top" src={product.media_urls && product.media_urls.length > 0 ? product.media_urls[0] : 'default-image-url'} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    );

    const SearchResultSection = ({ results }) => (
        <Card className="section mb-4">
            <Card.Header className="d-flex justify-content-start">
                <h3>Search Results</h3>
            </Card.Header>
            <Card.Body>
                <Row>
                    {results.map(product => (
                        <Col xs={12} sm={6} md={2} key={product.id}>
                            <Card className="product-card mb-4">
                                <Card.Img
                                    variant="top"
                                    src={product.media_urls && product.media_urls.length > 0 ? product.media_urls[0] : 'default-image-url'}
                                    alt={product.title}
                                    className="product-image"
                                />
                                <Card.Body className="text-center">
                                    <Card.Title className="mb-0">{product.title}</Card.Title>
                                    <Card.Text>{product.price}</Card.Text>
                                </Card.Body>
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
                <Spinner variant="warning" name="cube-grid" style={{ width: 100, height: 100 }} />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <TopNavbar
                onSidebarToggle={handleSidebarToggle}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
            />
            <Sidebar isOpen={sidebarOpen} />
            {!isSearching && searchResults.length === 0 && <Banner />}
            <div className={`home-page ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <Container fluid>
                    {isSearching ? (
                        <div className="centered-loader">
                            <Spinner variant="warning" name="cube-grid" style={{ width: 100, height: 100 }} />
                        </div>
                    ) : searchResults.length > 0 ? (
                        <SearchResultSection results={searchResults} />
                    ) : (
                        <>
                            {categories.map(category => (
                                <CategorySection
                                    key={category.id}
                                    title={category.name}
                                    subcategories={category.subcategories}
                                />
                            ))}
                            <PopularProductsSection products={Object.values(products).flat()} />
                        </>
                    )}
                </Container>
            </div>
            <Footer />
        </>
    );
};

export default HomePage;
