import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Tiers.css';

const TierPage = () => {
  const [tiers, setTiers] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const vendorId = sessionStorage.getItem('vendor_id');

  useEffect(() => {
    axios.get('https://carboncube-ke-rails-4xo3.onrender.com/vendors/tiers')
      .then(response => {
        setTiers(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the tier data!", error);
      });
  }, []);

  const handleSelectTier = (tierId) => {
    setSelectedTier(tierId);
    axios.put(`https://carboncube-ke-rails-4xo3.onrender.com/vendors/${vendorId}/tier`, { tier_id: tierId })
      .then(response => {
        console.log('Tier updated successfully!');
      })
      .catch(error => {
        console.error('There was an error updating the tier!', error);
      });
  };
  

  return (
    <div className="tier-container">
      {tiers.map(tier => (
        <div className="tier-card" key={tier.id}>
          <h3>{tier.name}</h3>
          <p>Ads: {tier.ads_limit}</p>
          <ul>
            {tier.tier_features.map(feature => (
              <li key={feature.id}>{feature.feature_name}</li>
            ))}
          </ul>
          <div className="pricing">
            {tier.tier_pricings.map(pricing => (
              <div key={pricing.id} className="pricing-option">
                <span>{pricing.duration_months} months: {pricing.price} KES</span>
              </div>
            ))}
          </div>
          <button onClick={() => handleSelectTier(tier.id)}>
            {selectedTier === tier.id ? "Selected" : "Select Tier"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TierPage;
