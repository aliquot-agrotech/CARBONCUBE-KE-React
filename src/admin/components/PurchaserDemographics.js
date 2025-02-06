import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

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

const GenderDistributionChart = ({ data }) => {
    const chartData = {
        labels: Object.keys(data),
        datasets: [{
            data: Object.values(data),
            backgroundColor: ["#FF6384", "#36A2EB"],
        }],
    };
    return <Pie data={chartData} />;
};

const EmploymentChart = ({ data }) => {
    const chartData = {
        // Fix: Properly map through array of objects
        labels: data.map(item => Object.keys(item)[0]),
        datasets: [{
            label: "Purchasers",
            data: data.map(item => Object.values(item)[0]),
            backgroundColor: "#4CAF50",
        }],
    };
    return <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />;
};

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

const EducationChart = ({ data }) => {
    const chartData = {
        labels: data.map(e => Object.keys(e)[0]),
        datasets: [{
            data: data.map(e => Object.values(e)[0]),
            backgroundColor: ["#3F51B5", "#8BC34A", "#FFEB3B", "#FF5722"],
        }],
    };
    return <Pie data={chartData} />;
};

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
