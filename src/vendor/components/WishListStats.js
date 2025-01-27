import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const WishListStats = ({ data }) => {
    if (!data) return <div className="alert alert-warning">No wishlist stats available</div>;

    const { top_wishlisted_products = [], wishlist_conversion_rate = [], wishlist_trends = [] } = data;

    return (
        <div className="container mt-2 px-0">
            {/* Top 3 Wishlisted Ads */}
            <div className="card shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
                <div className="card-body px-2">
                    <h4 className="card-title">Top 3 Wishlisted Ads</h4>
                    <ul className="list-group list-group-flush">
                        {top_wishlisted_products.map((product, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                {product.ad_title}
                                <span className="badge bg-primary">{product.wishlist_count} wishes</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Wishlist Conversion Rate */}
            <div className="card shadow-sm mt-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
                <div className="card-body px-2">
                    <h5 className="card-title">Wishlist Engagement Stats</h5>
                    <ul className="list-group list-group-flush" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                        {Array.isArray(wishlist_conversion_rate) && wishlist_conversion_rate.length > 0 ? (
                            wishlist_conversion_rate.map((product, index) => (
                                <li
                                    key={index}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}
                                >
                                    {product.ad_title}
                                    <span
                                        className={`badge ${
                                            product.wishlist_count === 0 ? 'bg-secondary' : 'bg-success'
                                        }`}
                                    >
                                        {product.wishlist_count === 0
                                            ? '0% conversion rate'
                                            : ((product.purchase_count / product.wishlist_count) * 100).toFixed(2) +
                                        '%'}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
                                No conversion data available
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Wishlist Trends */}
            <div className="card shadow-sm mt-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
                <div className="card-body px-2">
                    <h5 className="card-title">Wishlist Trends (Last 6 Months)</h5>
                    <ul className="list-group list-group-flush">
                        {Array.isArray(wishlist_trends) && wishlist_trends.length > 0 ? (
                            wishlist_trends.map((trend, index) => (
                                <li key={index} className="list-group-item">
                                    {trend.month} - {trend.ad_title}: <span className="fw-bold">{trend.count} wishlists</span>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item">No trends available</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default WishListStats;
