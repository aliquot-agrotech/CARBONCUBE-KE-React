import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Banner from '../components/Banner';
import Spinner from "react-spinkit";
import AdDetailsModal from '../components/AdDetailsModal';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import '../css/Home.css';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [ads, setAds] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [selectedAd, setSelectedAd] = useState(null); // State for selected ad
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchCategoriesAndAds = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };
    
                // Fetch categories and subcategories
                const [categoryResponse, subcategoryResponse] = await Promise.all([
                    fetch(`${process.env.REACT_APP_BACKEND_URL}/purchaser/categories`, { headers }),
                    fetch(`${process.env.REACT_APP_BACKEND_URL}/purchaser/subcategories`, { headers })
                ]);
    
                if (!categoryResponse.ok || !subcategoryResponse.ok) throw new Error('Failed to fetch categories/subcategories');
    
                const [categoryData, subcategoryData] = await Promise.all([
                    categoryResponse.json(),
                    subcategoryResponse.json()
                ]);
    
                // Structure categories with subcategories
                const categoriesWithSubcategories = categoryData.map(category => ({
                    ...category,
                    subcategories: subcategoryData.filter(sub => sub.category_id === category.id),
                }));
    
                setCategories(categoriesWithSubcategories);
    
                // ✅ Fetch all ads with pagination
                const adResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/purchaser/ads?per_page=500`, { headers });
    
                if (!adResponse.ok) throw new Error('Failed to fetch ads');
    
                const adData = await adResponse.json();
                console.log("Ads Response:", adData);  // ✅ Debugging
    
                // ✅ Ensure ads are grouped correctly
                setAds(adData);
            } catch (error) {
                console.error("Fetch Error:", error);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };
    
        fetchCategoriesAndAds();
    }, []);
    

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // const handleShowModal = (ad) => {
    //     setSelectedAd(ad);
    //     setShowModal(true);
    // };
    const handleAdClick = async (adId) => {
        if (!adId) {
            console.error('Invalid adId');
            return;
        }
    
        try {
            // Log the 'Ad-Click' event before navigating
            await logClickEvent(adId, 'Ad-Click');
    
            // Navigate to the ad details page
            navigate(`/ads/${adId}`);
        } catch (error) {
            console.error('Error logging ad click:', error);
    
            // Proceed with navigation even if logging fails
            navigate(`/ads/${adId}`);
        }
    };
    
    // Function to log a click event
    const logClickEvent = async (adId, eventType) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/click_events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify({
                    ad_id: adId,
                    event_type: eventType, // e.g., 'Ad-Click'
                }),
            });
    
            if (!response.ok) {
                console.warn('Failed to log click event');
            }
        } catch (error) {
            console.error('Error logging click event:', error);
        }
    };
    

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAd(null);
    };

    const handleSearch = async (e, category = 'All', subcategory = 'All') => {
        e.preventDefault();
        setIsSearching(true);
    
        try {
            // Fetch search results
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/purchaser/ads/search?query=${encodeURIComponent(searchQuery)}&category=${category}&subcategory=${subcategory}`, 
                {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    },
                }
            );
    
            if (!response.ok) throw new Error('Failed to fetch search results');
    
            const results = await response.json();
            setSearchResults(results);
    
            // Log the ad search to the backend
            await logAdSearch(searchQuery, category, subcategory);
    
        } catch (error) {
            setError('Error searching ads');
        } finally {
            setIsSearching(false);
        }
    };
    
    // Function to log the ad search
    const logAdSearch = async (query, category, subcategory) => {
        try {
            const logResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/ad_searches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
                body: JSON.stringify({
                    search_term: query,
                    category: category,
                    subcategory: subcategory,
                }),
            });
    
            if (!logResponse.ok) {
                console.warn('Failed to log ad search');
            }
        } catch (logError) {
            console.error('Error logging ad search:', logError);
        }
    };

    const getBorderColor = (tierId) => {
        const tierColors = {
            2: '#FF5733',  // Basic (Red-Orange)
            3: '#28A745',  // Standard (Bright Green)
            4: '#FFC107',  // Premium (Gold-like yellow)
        };
        return tierColors[tierId] || 'transparent'; // No border color for Free tier
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
                                    ads={ads[subcategory.id] || []}
                                    onAdClick={handleAdClick}
                                />
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>
        );
    };

    const SubcategorySection = ({ subcategory, ads, onAdClick }) => {
        const displayedAds = ads.slice(0, 4);
        return (
            <Card className="subcategory-section h-100">
                <Card.Body className="p-2">
                    <Row className="g-2">
                        {displayedAds.map(ad => {
                            const borderColor = getBorderColor(ad.vendor_tier); // Get the border color
                            return (
                                <Col xs={6} key={ad.id}>
                                    <Card 
                                        className="ad-card h-100"
                                        style={{
                                            border: `2px solid ${borderColor}`,
                                        }}
                                    >
                                        <div style={{ position: 'relative' }}>
                                            {/* Tier label */}
                                            <div
                                                className="tier-label text-dark"
                                                style={{
                                                    position: 'absolute',
                                                    top: '0px',
                                                    left: '0px',
                                                    padding: '0px 5px',
                                                    fontSize: '12px',
                                                    backgroundColor: borderColor, // Match background to border color
                                                    borderRadius: '4px',
                                                    zIndex: 20,
                                                }}
                                            >
                                                {ad.tier_name}
                                            </div>
        
                                            <Card.Img
                                                variant="top"
                                                loading="lazy"
                                                src={ad.media && ad.media.length > 0 ? ad.media[0] : 'default-image-url'}
                                                alt={ad.title}
                                                className="ad-image"
                                                onClick={() => onAdClick(ad.id)}
                                            />
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-start">
                    <h5 className='m-0'>{subcategory}</h5>
                </Card.Footer>
            </Card>
        );
    };

    const PopularAdsSection = ({ ads, onAdClick }) => (
        <Card className="section bg-transparent mb-3 m-4 mx-5">
            <Card.Header className="d-flex justify-content-start popular-ads-header">
                <h3 className='mb-0'>Best Sellers</h3>
            </Card.Header>
            <Card.Body className="cat-body">
                <Row>
                    {ads.slice(0, 6).map(ad => {
                        const borderColor = getBorderColor(ad.vendor_tier); // Get the border color
                        return (
                            <Col xs={6} sm={6} md={2} key={ad.id}>
                                <Card
                                    className="ad-card"
                                    style={{
                                        border: `2px solid ${borderColor}`,
                                    }}
                                >
                                    <div style={{ position: 'relative' }}>
                                        {/* Tier label */}
                                        <div
                                            className="tier-label text-dark"
                                            style={{
                                                position: 'absolute',
                                                top: '0px',
                                                left: '0px',
                                                padding: '0px 5px',
                                                fontSize: '12px',
                                                backgroundColor: borderColor, // Match background to border color
                                                borderRadius: '4px',
                                                zIndex: 20,
                                            }}
                                        >
                                            {ad.tier_name}
                                        </div>
                                        
                                        <Card.Img 
                                            variant="top" 
                                            src={ad.media && ad.media.length > 0 ? ad.media[0] : 'default-image-url'}
                                            alt={ad.title}
                                            className="ad-image"
                                            onClick={() => onAdClick(ad.id)} 
                                        />
                                    </div>
                                </Card>
                            </Col>
                        );
                    })}
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
                    {results.map(ad => {
                        const borderColor = getBorderColor(ad.vendor_tier); // Get the border color
                        return (
                            <Col xs={6} sm={6} md={2} key={ad.id} className="">
                                <Card 
                                    className="ad-card mb-3" 
                                    style={{
                                        border: `2px solid ${borderColor}`,
                                    }}>
                                    <div style={{ position: 'relative' }}>
                                        {/* Tier label */}
                                        <div
                                            className="tier-label text-dark"
                                            style={{
                                                position: 'absolute',
                                                top: '0px',
                                                left: '0px',
                                                padding: '0px 5px',
                                                fontSize: '12px',
                                                backgroundColor: borderColor, // Match background to border color
                                                borderRadius: '4px',
                                                zIndex: 20,
                                            }}
                                        >
                                            {ad.tier_name}
                                        </div>
                                        
                                        <Card.Img
                                            variant="top"
                                            src={ad.media_urls && ad.media_urls.length > 0 ? ad.media_urls[0] : 'default-image-url'}
                                            alt={ad.title}
                                            className="ad-image"
                                            onClick={() => handleAdClick(ad.id)} // Handle image click
                                        />
                                    </div>
                                    <Card.Body className="text-start bg-gray">
                                        <Card.Title className="mb-0 ad-title">{ad.title}</Card.Title>
                                        <Card.Text className="mt-0">
                                            <span className="text-success" style={{ fontSize: '15px' }}>Kshs: </span>
                                            <strong style={{ fontSize: '20px' }} className="text-danger">
                                                {ad.price ? Number(ad.price).toFixed(2).split('.').map((part, index) => (
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
                        );
                    })}
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
                                <PopularAdsSection
                                    ads={Object.values(ads).flat()}
                                    onAdClick={handleAdClick}
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
            <AdDetailsModal
                    show={showModal}
                    onHide={handleCloseModal}
                    ad={selectedAd}
                /> 
                
        </>
    );
};

export default Home;