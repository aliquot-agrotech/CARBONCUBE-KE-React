import React from "react";
import "./PurchaserDemographics.css";

const PurchaserDemographics = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div className="purchaser-stats">
      <h2>Purchaser Insights</h2>
      <div className="stats-grid">
        {Object.entries(data).map(([category, stats]) => (
          <div key={category} className="stat-card card-body">
            <h3>{category.replace("_", " ").toUpperCase()}</h3>
            {["top_ad_click", "top_wishlist", "top_reveal"].map((eventType) => {
              const eventData = stats[eventType];

              return (
                <div key={eventType} className="event-group">
                  <h4>
                    {eventType.replace("top_", "").replace("_", " ").toUpperCase()}
                  </h4>
                  {eventData ? (
                    <p>
                      <strong>{Object.keys(eventData)[0]}:</strong> {Object.values(eventData)[0]} (
                      {eventData.clicks} clicks)
                    </p>
                  ) : (
                    <p>No data available</p>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaserDemographics;
