import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

// Vendor Age Group Chart
const VendorAgeGroupChart = ({ data }) => {
    const chartData = {
        labels: Object.keys(data),
        datasets: [{
            label: "No. of Vendors",
            data: Object.values(data),
            backgroundColor: "#FFC107",
        }],
    };

    const chartOptions = {
        responsive: true,
        scales: { 
            y: { beginAtZero: true } 
        },
        plugins: {
            legend: {
                labels: {
                    boxWidth: 15,  // Width of the legend color box
                    boxHeight: 15, // Height of the legend color box
                    borderRadius: 50,  // Make it circular
                    padding: 10,  // Adjust padding between the label and the chart
                    generateLabels: function(chart) {
                        const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
                        const labels = original.call(this, chart);

                        // Make the color boxes circular
                        labels.forEach(label => {
                            label.pointStyle = 'circle';
                            label.radius = 10; // Adjust the size of the circle
                        });

                        return labels;
                    },
                },
            },
        },
    };

    return <Bar data={chartData} options={chartOptions} />;
};


// vendor Gender Distribution Chart
const VendorGenderDistributionChart = ({ data }) => {
    const chartData = {
        labels: Object.keys(data),
        datasets: [{
            data: Object.values(data),
            backgroundColor: ["#FF6384", "#36A2EB"],
        }],
    };

    const chartOptions = {
        cutout: '70%',  // Adjust the size of the hole in the middle
        plugins: {
            legend: {
                display: false,  // Hide default legend
            },
        },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut data={chartData} options={chartOptions} style={{ width: '200px', height: '200px' }} />
            </div>

            {/* Custom Legend */}
            <div className="mt-4" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                {Object.keys(data).map((gender, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '0 10px' }}>
                        <div 
                            style={{
                                width: '15px',
                                height: '15px',
                                backgroundColor: chartData.datasets[0].backgroundColor[index],
                                marginRight: '5px',
                                borderRadius: '50%',  // Makes it a circle
                            }}
                        />
                        <span style={{ fontSize: '12px' }}>{gender}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


//Vendor Category Chart
const VendorCategoryChart = ({ data }) => {
    const chartData = {
        labels: data.map(s => Object.entries(s)[0][0]),
        datasets: [{
            label: "No. of Vendors",
            data: data.map(s => Object.entries(s)[0][1]),
            backgroundColor: "#9C27B0",
        }],
    };

    const chartOptions = {
        responsive: true,
        scales: { 
            y: { beginAtZero: true } 
        },
        plugins: {
            legend: {
                labels: {
                    boxWidth: 15,  // Width of the legend color box
                    boxHeight: 15, // Height of the legend color box
                    borderRadius: 50,  // Make it circular
                    padding: 10,  // Adjust padding between the label and the chart
                    generateLabels: function(chart) {
                        const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
                        const labels = original.call(this, chart);

                        // Make the color boxes circular
                        labels.forEach(label => {
                            label.pointStyle = 'circle';
                            label.radius = 10; // Adjust the size of the circle
                        });

                        return labels;
                    },
                },
            },
        },
    };
    
    return <Bar data={chartData} options={chartOptions} />;
};


// Vendor Tier Chart
const VendorTierChart = ({ data }) => {
    const chartData = {
        labels: data.map(i => Object.keys(i)[0]),
        datasets: [{
            label: "No. of Vendors",
            data: data.map(i => Object.values(i)[0]),
            backgroundColor: "#FF9800",
        }],
    };

    const chartOptions = {
        responsive: true,
        scales: { 
            y: { beginAtZero: true } 
        },
        plugins: {
            legend: {
                labels: {
                    boxWidth: 15,  // Width of the legend color box
                    boxHeight: 15, // Height of the legend color box
                    borderRadius: 50,  // Make it circular
                    padding: 10,  // Adjust padding between the label and the chart
                    generateLabels: function(chart) {
                        const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
                        const labels = original.call(this, chart);

                        // Make the color boxes circular
                        labels.forEach(label => {
                            label.pointStyle = 'circle';
                            label.radius = 10; // Adjust the size of the circle
                        });

                        return labels;
                    },
                },
            },
        },
    };

    return <Bar data={chartData} options={chartOptions} />;
};

export { VendorAgeGroupChart, VendorGenderDistributionChart, VendorCategoryChart, VendorTierChart };