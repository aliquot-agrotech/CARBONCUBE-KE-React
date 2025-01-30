import React from "react";
import PurchaserClickEvents from "./PurchaserClickEvents";
import PurchaserWishlistStats from "./PurchaserWishlistStats"; // Import the new component
import "./PurchaserDemographics.css";

const PurchaserDemographics = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div className="purchaser-stats">
      <PurchaserClickEvents data={data} />
      {/* Display PurchaserWishlistStats below PurchaserBarChart */}
      <PurchaserWishlistStats data={data} />
    </div>
  );
};

export default PurchaserDemographics;
