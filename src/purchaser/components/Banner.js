import React, { useEffect, useState } from 'react';
import './Banner.css';
import Carousel from 'react-bootstrap/Carousel';

const Banner = () => {
    const [images, setImages] = useState([]);
    const [premiumAds, setPremiumAds] = useState([]);

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

        const fetchPremiumAds = async () => {
            try {
                const response = await fetch('https://carboncube-ke-rails-cu22.onrender.com/ads');

                if (!response.ok) {
                    throw new Error('Failed to fetch ads');
                }

                const ads = await response.json();
                // Filter for ads with `vendor_tier` === 4
                const premium = ads.filter((ad) => ad.vendor_tier === 4);

                // Shuffle and pick 3 random ads
                const shuffled = premium.sort(() => 0.5 - Math.random());
                setPremiumAds(shuffled.slice(0, 3));

                console.log('Premium Ads:', premium); // Debugging line
            } catch (error) {
                console.error('Error fetching premium ads:', error);
            }
        };

        fetchBannerImages();
        fetchPremiumAds();
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
                                {index === images.length - 1 && premiumAds.length > 0 && (
                                    <div className="premium-ads-overlay">
                                        {premiumAds.map((ad) => {
                                            const adImage = 
                                                ad.first_media_url 
                                                    ? ad.first_media_url
                                                    : (ad.media_urls[0] || 'default-image-url');
                                                
                                            console.log('Ad Image URL:', adImage); // Debugging line
                                            
                                            return (
                                                <div key={ad.id} className="ad-image-container">
                                                    <img
                                                        src={adImage}
                                                        alt={ad.title}
                                                        className="premium-ad-image"
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
