import React from 'react';
import PurchaserClickEvents from './PurchaserClickEvents';
import PurchaserWishlistStats from './PurchaserWishlistStats'; // Ensure both components are imported
import './PurchaserDemographics.css';

const PurchaserDemographics = ({ data }) => {
  const { clickEvents, wishlistStats } = data;

  if (!clickEvents || !wishlistStats) {
    return <div>Loading...</div>; // Handle missing data
  }

  return (
    <div className="purchaser-stats">
      {/* Pass both clickEvents and wishlistStats to the relevant components */}
      <PurchaserClickEvents data={clickEvents} />
      <PurchaserWishlistStats data={wishlistStats} />
    </div>
  );
};

export default PurchaserDemographics;
