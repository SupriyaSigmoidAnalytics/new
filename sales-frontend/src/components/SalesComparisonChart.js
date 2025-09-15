
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesComparisonChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [cleanedData, setCleanedData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [limit] = useState(50); 
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/get-sales-comparison')
      .then(response => setSalesData(response.data))
      .catch(error => console.error("Error fetching sales comparison:", error));
  }, []);


  useEffect(() => {
    axios.get(`http://localhost:5000/get-data?limit=${limit}&offset=${offset}`)
      .then(response => {
        setCleanedData(response.data.rows);
        setTotalRows(response.data.total);
      })
      .catch(error => console.error("Error fetching cleaned data:", error));
  }, [limit, offset]);

  const chartData = {
    labels: salesData.map(item => item.Product),
    datasets: [
      {
        label: 'Before Discount',
        data: salesData.map(item => item.sales_before_discount),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'After Discount',
        data: salesData.map(item => item.sales_after_discount),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      }
    ]
  };

  const handleNext = () => {
    if (offset + limit < totalRows) setOffset(offset + limit);
  };

  const handlePrev = () => {
    if (offset - limit >= 0) setOffset(offset - limit);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Sales Comparison: Before and After Discount</h2>
      <Bar data={chartData} options={{ responsive: true }} />

      <h2 style={{ marginTop: '40px' }}>Cleaned Dataset (Paginated)</h2>

      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {cleanedData.length > 0 &&
              Object.keys(cleanedData[0]).map((col, index) => (
                <th key={index}>{col}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {cleanedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((val, colIndex) => (
                <td key={colIndex}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <button onClick={handlePrev} disabled={offset === 0}>Previous</button>
        <span style={{ margin: '0 10px' }}>
          Showing {offset + 1} – {Math.min(offset + limit, totalRows)} of {totalRows}
        </span>
        <button onClick={handleNext} disabled={offset + limit >= totalRows}>Next</button>
      </div>
    </div>
  );
};

export default SalesComparisonChart;
