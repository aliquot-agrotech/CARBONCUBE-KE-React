import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const CategoryAnalytics = ({ data }) => {
  const totalSold = data.reduce((sum, category) => sum + category.total_sold, 0);

  const chartData = data.map(category => ({
    label: category.category_name,
    percentage: ((category.total_sold / totalSold) * 100).toFixed(2)
  }));

  return (
    <div className="d-flex justify-content-around">
      {chartData.map((category, index) => (
        <div key={index} className="pie-chart">
          <Pie
            data={{
              labels: [category.label],
              datasets: [{
                data: [category.percentage, 100 - category.percentage],
                backgroundColor: ['#FF6384', '#E0E0E0'],
                hoverBackgroundColor: ['#FF6384', '#E0E0E0']
              }]
            }}
            options={{
              cutout: '80%',
              plugins: {
                tooltip: {
                  enabled: false
                },
                datalabels: {
                  display: true,
                  align: 'center',
                  formatter: () => `${category.percentage}%`,
                  color: '#FF6384',
                  font: {
                    size: '18',
                    weight: 'bold'
                  }
                }
              }
            }}
          />
          <p className="text-center">{category.label}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryAnalytics;
