import React from "react";

const PurchaserStats = ({ data }) => {
  // Helper function to parse keys and group data by event type
  const parseDemographicData = (demographicData) => {
    const groupedData = {};
  
    Object.entries(demographicData).forEach(([key, value]) => {
      try {
        const parsedKey = JSON.parse(key.replace(/(\w+):/g, '"$1":')); // Parse the key as JSON
        const { event_type, ...attributes } = parsedKey;
  
        if (!groupedData[event_type]) {
          groupedData[event_type] = [];
        }
  
        groupedData[event_type].push({ ...attributes, count: value });
      } catch (error) {
        console.error("Failed to parse key:", key, error);
      }
    });
  
    return groupedData;
  };
  

  return (
    <div className="purchaser-stats">
      <h2>Purchaser Insights</h2>
      <div className="stats-grid">
        {Object.entries(data).map(([demographic, stats]) => {
          const groupedStats = parseDemographicData(stats);

          return (
            <div key={demographic} className="stat-card">
              <h3>{demographic.replace("_", " ").toUpperCase()}</h3>
              {Object.entries(groupedStats).map(([eventType, items]) => (
                <div key={eventType} className="event-group">
                  <h4>{eventType}</h4>
                  <ul>
                    {items.map((item, index) => {
                      const attributeKey = Object.keys(item).find(
                        (key) => key !== "count"
                      );
                      return (
                        <li key={index}>
                          <strong>{attributeKey}:</strong> {item[attributeKey]} (
                          {item.count} clicks)
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PurchaserStats;
