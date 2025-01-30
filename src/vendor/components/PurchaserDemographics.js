import React from "react";
import PurchaserBarChart from "./PurchaserBarChart";
import "./PurchaserDemographics.css";

const PurchaserDemographics = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div className="purchaser-stats">
      <PurchaserBarChart data={data} />
    </div>
  );
};

export default PurchaserDemographics;
