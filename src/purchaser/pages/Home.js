import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Banner from '../components/Banner';
import Spinner from "react-spinkit";
import ProductDetailsModal from '../components/ProductDetailsModal';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import '../css/Home.css';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchCategoriesAndProducts = async () => {
            try {
                const categoryResponse = await fetch('https://carboncube-ke-rails-4xo3.onrender.com/purchaser/categories', {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                });
                if (!categoryResponse.ok) throw new Error('Failed to fetch categories');

                const categoryData = await categoryResponse.json();

                const subcategoryResponse = await fetch('https://carboncube-ke-rails-4xo3.onrender.com/purchaser/subcategories', {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                });
                if (!subcategoryResponse.ok) throw new Error('Failed to fetch subcategories');

                const subcategoryData = await subcategoryResponse.json();

                const categoriesWithSubcategories = categoryData.map(category => ({
                    ...category,
                    subcategories: subcategoryData.filter(sub => sub.category_id === category.id),
                }));

                setCategories(categoriesWithSubcategories);

                const productResponse = await fetch('https://carboncube-ke-rails-4xo3.onrender.com/purchaser/products', {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
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

    const handleShowModal = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleProductClick = (productId) => {
        if (productId) {
        navigate(`/products/${productId}`);
        } else {
        // console.error('Invalid productId');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const handleSearch = async (e, category = 'All', subcategory = 'All') => {
        e.preventDefault();
        setIsSearching(true);
        try {
            const response = await fetch(`https://carboncube-ke-rails-4xo3.onrender.com/purchaser/products/search?query=${encodeURIComponent(searchQuery)}&category=${category}&subcategory=${subcategory}`, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            });
            if (!response.ok) throw new Error('Failed to fetch search results');
    
            const results = await response.json();
            setSearchResults(results);
        } catch (error) {
            // console.error('Error searching products:', error);
            setError('Error searching products');
        } finally {
            setIsSearching(false);
        }
    };
    
    const CategorySection = ({ title, subcategories }) => {
        // Function to shuffle an array
        const shuffleArray = (array) => {
            return array
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
        };
    
        // Shuffle the subcategories before slicing
        const randomizedSubcategories = shuffleArray(subcategories).slice(0, 4);
    
        return (
            <Card className="section bg-transparent mb-3 m-5 my-xs-0 mx-5">
                <Card.Header className="category-header justify-content-start">
                    <h4 className='m-0'>{title}</h4>
                </Card.Header>
                <Card.Body className='cat-body p-0'>
                    <Row className="g-3">
                        {randomizedSubcategories.map(subcategory => (
                            <Col xs={12} sm={6} md={3} key={subcategory.id}>
                                <SubcategorySection
                                    subcategory={subcategory.name}
                                    products={products[subcategory.id] || []}
                                    onProductClick={handleShowModal}
                                />
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>
        );
    };
    


    const SubcategorySection = ({ subcategory, products, onProductClick }) => {
        const displayedProducts = products.slice(0, 4);
        return (
            <Card className="subcategory-section h-100">
                <Card.Body className="p-2">
                    <Row className="g-2">
                        {displayedProducts.map(product => (
                            <Col xs={6} key={product.id}>
                                <Card className="product-card h-100">
                                    <Card.Img
                                        variant="top"
                                        loading="lazy"
                                        src={product.media_urls && product.media_urls.length > 0 ? product.media_urls[0] : 'default-image-url'}
                                        alt={product.title}
                                        className="product-image"
                                        onClick={() => handleProductClick(product.id)}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-start">
                    <h5 className='m-0'>{subcategory}</h5>
                </Card.Footer>
            </Card>
        );
    };

    const PopularProductsSection = ({ products, onProductClick }) => (
        <Card className="section bg-transparent mb-3 m-4 mx-5">
            <Card.Header className="d-flex justify-content-start popular-products-header ">
                <h3 className='mb-0'>Best Sellers</h3>
            </Card.Header>
            <Card.Body className="cat-body">
                <Row>
                    {products.slice(0, 6).map(product => (
                        <Col xs={6} sm={6} md={2} key={product.id}>
                            <Card className="product-card">
                                <Card.Img 
                                    variant="top" 
                                    src={product.media_urls && product.media_urls.length > 0 ? product.media_urls[0] : 'default-image-url'}
                                    className="product-image"
                                    onClick={() => onProductClick(product.id)} 
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    );
    
    const SearchResultSection = ({ results }) => (
        <Card className="section-search mb-4 mt-2">
            <Card.Header className="d-flex justify-content-center align-items-center">
                <h3 className="mb-0">Search Results</h3>
            </Card.Header>
            <Card.Body>
                <Row>
                    {results.map(product => (
                        <Col xs={6} sm={6} md={2} key={product.id} className="">
                            <Card className="product-card mb-3">
                                <Card.Img
                                    variant="top"
                                    src={product.media_urls && product.media_urls.length > 0 ? product.media_urls[0] : 'default-image-url'}
                                    alt={product.title}
                                    className="product-image"
                                    onClick={() => handleProductClick(product.id)} // Handle image click
                                />
                                <Card.Body className="text-start bg-gray">
                                    <Card.Title className="mb-0">{product.title}</Card.Title>
                                    <Card.Text>
                                        <span className="text-success" style={{ fontSize: '15px' }}>Kshs: </span>
                                        <strong style={{ fontSize: '20px' }} className="text-danger">
                                            {product.price ? Number(product.price).toFixed(2).split('.').map((part, index) => (
                                                <React.Fragment key={index}>
                                                    {index === 0 ? (
                                                        <span className="price-integer">{parseInt(part, 10).toLocaleString()}</span>
                                                    ) : (
                                                        <>
                                                            <span style={{ fontSize: '16px' }}>.</span>
                                                            <span className="price-decimal">{part}</span>
                                                        </>
                                                    )}
                                                </React.Fragment>
                                            )) : 'N/A'}
                                        </strong>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    );

    const Footer = () => (
        <footer className="footer">
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
                            {/* <li><a href="/account-settings">Account Settings</a></li> */}
                            <li><a href="/faqs">FAQs Center</a></li>
                        </ul>
                    </Col>
                    <Col xs={12} md={3}>
                        <h5>Business</h5>
                        <ul>
                            <li><a href="/become-a-vendor">Want to be a Vendor</a></li>
                            <li><a href="/vendor-help">Vendor Help Center</a></li>
                            {/* <li><a href="/vendor-account-settings">Vendor Account Settings</a></li> */}
                            <li><a href="/faqs">FAQs Center</a></li>
                        </ul>
                    </Col>
                    <Col xs={12} md={3}>
                        <h5>Let's Connect:</h5>
                        <ul className="social-media-links">
                            <li>
                                <a href="https://twitter.com" aria-label="Twitter">
                                    <FontAwesomeIcon icon={faTwitter} />
                                </a>
                            </li>
                            <li>
                                <a href="https://whatsapp.com" aria-label="WhatsApp">
                                    <FontAwesomeIcon icon={faWhatsapp} />
                                </a>
                            </li>
                            <li>
                                <a href="https://instagram.com" aria-label="Instagram">
                                    <FontAwesomeIcon icon={faInstagram} />
                                </a>
                            </li>
                            <li>
                                <a href="https://facebook.com" aria-label="Facebook">
                                    <FontAwesomeIcon icon={faFacebook} />
                                </a>
                            </li>
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
            <div className="home-page-wrapper">
                <Sidebar isOpen={sidebarOpen} />
                <div className={`home-page ${sidebarOpen ? 'sidebar-open' : ''}`}>
                    {!isSearching && searchResults.length === 0 && <Banner />}
                    <Container fluid className="mb-0">
                        {isSearching ? (
                            <div className="centered-loader">
                                <Spinner variant="warning" animation="border" />
                            </div>
                        ) : searchResults.length > 0 ? (
                            <SearchResultSection results={searchResults} />
                        ) : (
                            <>
                            <div className="categories-overlay">
                                {categories.map((category) => (
                                    <CategorySection
                                        key={category.id}
                                        title={category.name}
                                        subcategories={category.subcategories}
                                    />
                                ))}
                                <PopularProductsSection
                                    products={Object.values(products).flat()}
                                    onProductClick={handleProductClick}
                                />
                                </div>
                            </>
                        )}
                    </Container>
                    
                </div>
            </div>
            <div className='lorem'>
                <Footer />
            </div>
            <ProductDetailsModal
                    show={showModal}
                    onHide={handleCloseModal}
                    product={selectedProduct}
                /> 
                
        </>
    );
};

export default Home;
