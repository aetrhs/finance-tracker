import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getCategorySummary } from '../api/expenses';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS = {
  'Food': '#FF6384',
  'Grocery': '#36A2EB',
  'Trinkets': '#FFCE56',
  'Drinks': '#4BC0C0',
  'Other': '#9966FF',
};

const DoughnutChart = ({ transactions }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const summary = await getCategorySummary();

        const labels = summary.map(item => item._id);
        const data = summary.map(item => item.totalExpense.toFixed(2));
        const backgroundColors = labels.map(label => CATEGORY_COLORS[label] || '#C9CBCE');

        setChartData({
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColors,
            hoverBackgroundColor: backgroundColors.map(c => c + 'AA'),
            borderWidth: 1
          }]
        });
        setError(null);
      } catch (err) {
        console.error("Chart data fetch failed:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    // if (transactions.length >= 0) {
      fetchSummary();
    // }
  }, [transactions]); 

  if (loading) return <div className="text-center py-4">Loading chart...</div>;
  if (error) return <div className="text-center py-4 text-red-600">{error}</div>;
  if (chartData.labels.length === 0) return <div className="text-center py-4 text-gray-500">No expenses recorded this month.</div>;

  return (
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mx-4">
      <h4 className="text-lg font-bold mb-4 text-center">Monthly Expenses by Category</h4>
      <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
    </div>
  );
};

export default DoughnutChart;