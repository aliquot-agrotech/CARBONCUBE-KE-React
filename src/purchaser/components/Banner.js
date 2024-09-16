import React, { useEffect, useState } from 'react';
import './Banner.css'; // Ensure your CSS reflects the updated design
import Carousel from 'react-bootstrap/Carousel'; // Install React Bootstrap Carousel

const Banner = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Fetch banner images from your Rails backend
        const fetchBannerImages = async () => {
            try {
                const response = await fetch('http://localhost:3000/banners'); // Removed token requirement

                if (!response.ok) {
                    throw new Error('Failed to fetch banner images');
                }

                const banners = await response.json();
                console.log('Fetched banners:', banners); // Log fetched data

                // Assuming each banner has an image_url
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
            {/* Carousel for background images */}
            {images.length > 0 ? (
                <Carousel interval={5000} pause={false}>
                    {images.map((src, index) => (
                        <Carousel.Item key={index}>
                            <div
                                className="carousel-image"
                                style={{
                                    backgroundImage: `url(${src})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    height: '70vh', // Adjust height as needed
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
