import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Legend , Cell} from 'recharts';
import style from './TransactionsPieChart.module.css'
import Months from '../utils/Months';
import Loader from '../Models/Loader';

const TransactionsPieChart = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('03');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPieChartData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/pie_chart?month=${selectedMonth}`);
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
        setLoading(false);
      }
    };

    fetchPieChartData();
  }, [selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  
  const colors = [ '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658', '#ff7f0e', '#ff6e2e', '#ff5a2e', '#ff4033', '#f5222d'];

  return (
    <div className={style.container}>
      <div className={style.innerContainer}>
        <div className={style.heading}>Pie Chart Stats - {Months[Number(selectedMonth)-1]}</div>
        <select className={style.select} id="month" value={selectedMonth} onChange={handleMonthChange}>
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        <option value="04">April</option>
        <option value="05">May</option>
        <option value="06">June</option>
        <option value="07">July</option>
        <option value="08">August</option>
        <option value="09">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
        </select>
      </div>

      {loading ? (
        <Loader /> 
      ) : (
        <div>
          <PieChart width={500} height={500}>
            <Pie data={data} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={170} label fill="#8884d8" >
              {
                data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))
              }
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}
    </div>
  );
};

export default TransactionsPieChart;
