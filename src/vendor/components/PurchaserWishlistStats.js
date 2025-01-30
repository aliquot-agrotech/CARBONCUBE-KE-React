import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PurchaserWishlistStats = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  // Categories (age group, income range, education level, etc.)
  const categories = Object.keys(data);
  
  // Labels for chart
  const labels = categories.map((category) =>
    category.replace("top_", "").replace("_", " ").toUpperCase()
  );

  // The event types for the chart (this would be the "wishlists" data we're displaying)
  const eventTypes = ["wishlists"];
  
  // Colors for different data points
  const colors = ["#919191"];

  // Datasets for the Bar Chart
  const datasets = eventTypes.map((eventType, index) => ({
    label: eventType.toUpperCase(),
    backgroundColor: colors[index],
    data: categories.map((category) => data[category][eventType] || 0),
  }));

  // Chart data
  const chartData = {
    labels,
    datasets,
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            const category = categories[tooltipItem.dataIndex]; // Get category key (e.g., "top_age_group")
            const specificData = data[category]; // Access the data object for that category (e.g., { age_group: "35.0–39.0", wishlists: 19 })
            
            // Now correctly reference the values inside the specificData object
            return `${specificData.age_group || specificData.income_range || specificData.education_level || specificData.employment_status || specificData.sector} (${specificData.wishlists} wishlists)`;
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
  

  return (
    <div>
      <h4>Purchaser Wishlist Insights</h4>
      <Bar data={chartData} options={options} />
      {/* Alternatively, you could display the data in a table if you prefer */}
      {/* <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Wishlists</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category}>
              <td>{category.replace("top_", "").replace("_", " ").toUpperCase()}</td>
              <td>{data[category]?.wishlists || 0}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default PurchaserWishlistStats;
