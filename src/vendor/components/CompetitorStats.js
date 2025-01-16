import React from 'react';
import CompetitorAds from './CompetitorAds'; 

const CompetitorStats = ({ data }) => {
    if (!data) return <div>No competitor stats available</div>;

    const { revenue_share, top_competitor_ads, competitor_average_price } = data;

    return (
        <div className="container mt-4">
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="card-title">Revenue Share in Category</h5>
                    <p className="card-text">
                        <strong>Vendor Revenue:</strong>Kshs{revenue_share.vendor_revenue} <br />
                        <strong>Total Category Revenue:</strong>Kshs{revenue_share.total_category_revenue} <br />
                        <strong>Vendor Revenue Share:</strong> {revenue_share.revenue_share}% 
                    </p>
                </div>
            </div>
            
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="card-title">Top Competitor Ads</h5>
                    <CompetitorAds data={top_competitor_ads} />
                </div>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="card-title">Competitor Average Selling Price</h5>
                    <p className="card-text">
                        <strong>Competitor Average Price:</strong> ${competitor_average_price}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CompetitorStats;
