import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PurchaserClickEvents = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  const categories = Object.keys(data);
  
  const labels = categories.map((category) => category.replace("top_", "").replace("_clicks", "").replace("_", " ").toUpperCase());
  const eventTypes = [ "top_wishlist", "top_ad_click", "top_reveal"];
  const colors = ["#FFC107", "#919191",  "#363636"];

  const datasets = eventTypes.map((eventType, index) => ({
    label: eventType.replace("top_", "").replace("_", " ").toUpperCase(),
    backgroundColor: colors[index],
    data: categories.map((category) => data[category][eventType]?.clicks || 0),
  }));

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { 
        position: "top",
        labels: {
          font: {
            size: 10, // Reduce legend font size
          },
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            const category = categories[tooltipItem.dataIndex]; 
            const specificData = data[category]; 
            
            return `${specificData.age_group || specificData.income_range || specificData.education_level || specificData.employment_status || specificData.sector} (${specificData.wishlists} wishlists)`;
          },
        },
      },
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: {
          font: {
            size: 10, // Reduce font size for Y-axis labels
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 10, // Reduce font size for X-axis labels
          },
        },
      },
    },
  };
  

  return (
    <div>
      <h4>Click Events Insights</h4>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PurchaserClickEvents;
