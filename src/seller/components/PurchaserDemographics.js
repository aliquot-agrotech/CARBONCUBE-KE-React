import React from 'react';
import PurchaserClickEvents from './PurchaserClickEvents';
import PurchaserWishlistStats from './PurchaserWishlistStats'; // Ensure both components are imported
import { Col, Row } from 'react-bootstrap';
import './PurchaserDemographics.css';

const PurchaserDemographics = ({ data }) => {
  const { clickEvents, wishlistStats } = data;

  if (!clickEvents || !wishlistStats) {
    return <div>Loading...</div>; // Handle missing data
  }

  return (
    <div className="buyer-stats">
      {/* Pass both clickEvents and wishlistStats to the relevant components */}
      <Row>
        <Col xs={12} md={6} lg={6} className="mb-4"><PurchaserClickEvents data={clickEvents} /></Col>
        <Col xs={12} md={6} lg={6} className="mb-4"><PurchaserWishlistStats data={wishlistStats} /></Col>
      </Row>
    </div>
  );
};

export default PurchaserDemographics;
