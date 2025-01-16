import React from 'react';

const CompetitorStats = ({ data }) => {
    if (!data) return <div>No competitor stats available</div>;

    const { revenue_share, top_competitor_ads, competitor_average_price } = data;

    return (
        <div>
            <h4>Revenue Share in Category</h4>
            <div>
                Vendor Revenue: ${revenue_share.vendor_revenue} <br />
                Total Category Revenue: ${revenue_share.total_category_revenue} <br />
                Vendor Revenue Share: {revenue_share.revenue_share}%
            </div>

            <h4>Top Competitor Ads</h4>
            <ul>
                {top_competitor_ads.map((ad, index) => (
                <li key={index}>
                    {ad.ad_title} - {ad.total_sold} units sold at ${ad.ad_price} each
                </li>
                ))}
            </ul>

            <h4>Competitor Average Selling Price</h4>
            <div>Competitor Average Price: ${competitor_average_price}</div>
        </div>
    );
};

export default CompetitorStats;
