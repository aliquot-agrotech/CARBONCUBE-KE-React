import React, { useEffect, useState } from 'react';
import './Banner.css'; // Ensure your CSS reflects the updated design
import Carousel from 'react-bootstrap/Carousel'; // Install React Bootstrap Carousel

const Banner = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchBannerImages = async () => {
            try {
                const response = await fetch('https://carboncube-ke-rails-4xo3.onrender.com/banners'); // Fetch without a token

                if (!response.ok) {
                    throw new Error('Failed to fetch banner images');
                }

                const banners = await response.json();
                const bannerImages = banners.map(banner => banner.image_url);
                setImages(bannerImages);
            } catch (error) {
                console.error('Error fetching banner images:', error);
            }
        };

        fetchBannerImages();
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
                                    // backgroundSize: 'cover',
                                    // backgroundPosition: 'center',
                                    // height: '70vh', // Adjust height as needed
                                }}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                <p>Loading images...</p> // Show a message while images are being loaded
            )}
        </div>
    );
};

export default Banner;
