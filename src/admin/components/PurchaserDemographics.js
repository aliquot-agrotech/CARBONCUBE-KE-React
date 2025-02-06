import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

// Age Group Chart
const AgeGroupChart = ({ data }) => {
    const chartData = {
        labels: Object.keys(data),
        datasets: [{
            label: "Purchasers",
            data: Object.values(data),
            backgroundColor: "#FFC107",
        }],
    };
    return <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />;
};

// Gender Distribution Chart
const GenderDistributionChart = ({ data }) => {
    const chartData = {
        labels: Object.keys(data),
        datasets: [{
            data: Object.values(data),
            backgroundColor: ["#FF6384", "#36A2EB"],
        }],
    };

    const chartOptions = {
        cutout: '75%',  // Adjust the size of the hole in the middle
        plugins: {
            legend: {
                display: false,  // Hide default legend
            },
        },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut data={chartData} options={chartOptions} style={{ width: '250px', height: '250px' }} />
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

// Employment Chart
const EmploymentChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => Object.keys(item)[0]),
        datasets: [{
            label: "Purchasers",
            data: data.map(item => Object.values(item)[0]),
            backgroundColor: "#4CAF50",
        }],
    };
    return <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />;
};

// Income Chart
const IncomeChart = ({ data }) => {
    const chartData = {
        labels: data.map(i => Object.keys(i)[0]),
        datasets: [{
            label: "Purchasers",
            data: data.map(i => Object.values(i)[0]),
            backgroundColor: "#FF9800",
        }],
    };
    return <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />;
};

// Education Chart
const EducationChart = ({ data }) => {
    const chartData = {
        labels: data.map(e => Object.keys(e)[0]),
        datasets: [{
            data: data.map(e => Object.values(e)[0]),
            backgroundColor: ["#3F51B5", "#8BC34A", "#FFEB3B", "#FF5722"],
        }],
    };

    const chartOptions = {
        cutout: '70%',  // Adjust the size of the hole in the middle (e.g., 70% of the radius)
        plugins: {
            legend: {
                display: false,
                labels: {usePointStyle: true},
                 // Hide the default legend
            },
        },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut data={chartData} options={chartOptions} style={{ width: '250px', height: '250px' }} />
            </div>

            {/* Custom Legend */}
            <div className="mt-4" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                {data.map((item, index) => (
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
                        <span style={{ fontSize: '12px' }}>{Object.keys(item)[0]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


// Sector Chart
const SectorChart = ({ data }) => {
    const chartData = {
        labels: data.map(s => Object.entries(s)[0][0]),
        datasets: [{
            label: "Purchasers",
            data: data.map(s => Object.entries(s)[0][1]),
            backgroundColor: "#9C27B0",
        }],
    };
    
    return <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />;
};

export { AgeGroupChart, GenderDistributionChart, EmploymentChart, IncomeChart, EducationChart, SectorChart };
