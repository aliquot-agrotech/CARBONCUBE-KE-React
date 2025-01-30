import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WishListStats = ({ data }) => {
    if (!data) return <div className="alert alert-warning">No wishlist stats available</div>;

    const { top_wishlisted_products = [], wishlist_trends = [] } = data;

    // Ensure we are only showing the last 5 months
    const latestTrends = wishlist_trends.slice(0, 5);

    // Get the maximum wishlist count for setting the y-axis max value
    const maxWishlistCount = Math.max(...latestTrends.map(trend => trend.wishlist_count));

    // Prepare data for the Bar chart
    const chartData = {
        labels: latestTrends.map(trend => trend.month), // X-axis labels (months)
        datasets: [
            {
                label: 'Wish List Count',
                data: latestTrends.map(trend => trend.wishlist_count), // Y-axis values (wishlist count)
                backgroundColor: '#919191', // Bar color
                borderColor: '#919191', // Border color
                borderWidth: 1,
            }
        ]
    };

    return (
        <div className="container mt-2 px-0">
            {/* Top 3 Wishlisted Ads */}
            <div className="card shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
                <div className="card-body px-2">
                    <h4 className="card-title">Top 3 Wish List Ads</h4>
                    <ul className="list-group list-group-flush">
                        {top_wishlisted_products.map((ad, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                {ad.ad_title}
                                <span className="badge bg-primary">{ad.wishlist_count} wishes</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Wishlist Trends Chart (Bar chart) */}
            <div className="card shadow-sm mt-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
                <div className="card-body px-2">
                    <h5 className="card-title">Wish List Trends (Last 5 Months)</h5>
                    <div>
                        {Array.isArray(latestTrends) && latestTrends.length > 0 ? (
                            <Bar data={chartData} options={{
                                responsive: true,
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: (tooltipItem) => `Wish List Count: ${tooltipItem.raw}`,
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        min: 0, // Ensure the y-axis starts at 0
                                        max: Math.ceil(maxWishlistCount / 10) * 10, // Round up the max value to the next multiple of 10
                                        ticks: {
                                            stepSize: 10, // Set step size to 10
                                        }
                                    }
                                }
                            }} />
                        ) : (
                            <div>No trends available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishListStats;
