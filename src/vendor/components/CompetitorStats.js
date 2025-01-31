import React from 'react';  
import CompetitorAds from './CompetitorAds'; 
// import { Row, Col } from 'react-bootstrap';

const CompetitorStats = ({ data }) => {
    if (!data) return <div>No competitor stats available</div>;

    const {  top_competitor_ads, competitor_average_price } = data;

    return (
        <div className="container mt-2 px-0">
            {/* <div className="card shadow-sm mb-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
                <div className="card-body py-2 px-3">
                    <h5 className="card-title">Revenue Share in Category</h5>
                    <p className="card-text">
                    <Row>
                        <Col xs={12} md={6}>
                            <strong>Vendor Revenue <span className="text-success" style={{ fontSize: '10px' }}>Kshs: </span></strong>
                            <strong style={{ fontSize: '16px' }} className="text-danger">
                                {revenue_share.vendor_revenue
                                ? Number(revenue_share.vendor_revenue).toFixed(2).split('.').map((part, index) => (
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
                                    ))
                                : 'N/A'}
                            </strong>
                        </Col>
                        <Col xs={12} md={6}>
                            <strong>Total Category Revenue <span className="text-success" style={{ fontSize: '10px' }}>Kshs: </span></strong>
                            <strong style={{ fontSize: '16px' }} className="text-danger">
                                {revenue_share.total_category_revenue
                                ? Number(revenue_share.total_category_revenue).toFixed(2).split('.').map((part, index) => (
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
                                    ))
                                : 'N/A'}
                            </strong>
                        </Col>
                    </Row>
                        <strong>Vendor Revenue Share:</strong> {revenue_share.revenue_share}%
                    </p>
                </div>
            </div> */}
            
            <div className="card shadow-sm mb-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: 'none' }}>
                <div className="card-body py-2 px-3">
                    <h5 className="card-title">Top Competitor Ads</h5>
                    <CompetitorAds data={top_competitor_ads} />
                </div>
            </div>

            <div className="card shadow-sm mb-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
                <div className="card-body py-2 px-3">
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
