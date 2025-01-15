import React, { useEffect, useState } from 'react';
import './Banner.css';
import Carousel from 'react-bootstrap/Carousel';

const Banner = () => {
    const [images, setImages] = useState([]);
    const [premiumProducts, setPremiumProducts] = useState([]);

    useEffect(() => {
        const fetchBannerImages = async () => {
            try {
                const response = await fetch('https://carboncube-ke-rails-cu22.onrender.com/banners');

                if (!response.ok) {
                    throw new Error('Failed to fetch banner images');
                }

                const banners = await response.json();
                const bannerImages = banners.map((banner) => banner.image_url);
                setImages(bannerImages);
            } catch (error) {
                console.error('Error fetching banner images:', error);
            }
        };

        const fetchPremiumProducts = async () => {
            try {
                const response = await fetch('https://carboncube-ke-rails-cu22.onrender.com/products');

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const products = await response.json();
                // Filter for products with `vendor_tier` === 4
                const premium = products.filter((product) => product.vendor_tier === 4);

                // Shuffle and pick 3 random products
                const shuffled = premium.sort(() => 0.5 - Math.random());
                setPremiumProducts(shuffled.slice(0, 3));

                console.log('Premium Products:', premium); // Debugging line
            } catch (error) {
                console.error('Error fetching premium products:', error);
            }
        };

        fetchBannerImages();
        fetchPremiumProducts();
    }, []);

    return (
        <div className="banner">
            {images.length > 0 ? (
                <Carousel interval={5000} pause={false}>
                    {images.map((src, index) => (
                        <Carousel.Item key={index}>
                            <div
                                className="carousel-image"
                                style={{
                                    backgroundImage: `url(${src})`,
                                }}
                            >
                                {/* Add overlay for the last banner */}
                                {index === images.length - 1 && premiumProducts.length > 0 && (
                                    <div className="premium-products-overlay">
                                        {premiumProducts.map((product) => {
                                            const productImage = 
                                                product.first_media_url 
                                                    ? product.first_media_url
                                                    : (product.media_urls[0] || 'default-image-url');
                                                
                                            console.log('Product Image URL:', productImage); // Debugging line
                                            
                                            return (
                                                <div key={product.id} className="product-image-container">
                                                    <img
                                                        src={productImage}
                                                        alt={product.title}
                                                        className="premium-product-image"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                <p>Loading images...</p>
            )}
        </div>
    );
};

export default Banner;
