import React, { useEffect, useState } from 'react';
import './Banner.css'; // We'll convert your CSS into a file named Banner.css

const Banner = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Fetch products and randomize the images
        const fetchRandomImages = async () => {
            try {
                const response = await fetch('http://localhost:3000/purchaser/products', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const products = await response.json();
                const shuffledProducts = products.sort(() => 0.5 - Math.random());
                const randomImages = shuffledProducts.slice(0, 10).map(product => product.media_urls[0]);
                setImages(randomImages);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchRandomImages();
    }, []);

    return (
        <div className="banner">
            <div className="slider" style={{ '--quantity': images.length }}>
                {images.map((src, index) => (
                    <div key={index} className="item" style={{ '--position': index + 1 }}>
                        <img src={src} alt={`Slide ${index + 1}`} />
                    </div>
                ))}
            </div>
            
        </div>
    );
};

export default Banner;
