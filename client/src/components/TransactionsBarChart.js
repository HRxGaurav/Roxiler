import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Months from '../utils/Months'
import style from './TransactionsBarChart.module.css'
import Loader from '../Models/Loader';

const CustomBar = (props) => {
  const { x, y, width, height } = props;

  return (
    <rect x={x} y={y} width={width} height={height} rx={5} ry={5} fill={props.fill} />
  );
};

const TransactionsBarChart = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('03');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarChartData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/bar_chart?month=${selectedMonth}`);
        const data = await response.json();
        setData(data);
        setLoading(false)
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
        setLoading(false)
      }
    };

    fetchBarChartData();
  }, [selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  

  return (
    <div className={style.container}>
      <div className={style.innerContainer}>
        <div className={style.heading}>Bar Chart Stats - {Months[Number(selectedMonth)-1]}</div>

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
          <BarChart width={900} height={500} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            {/* <Legend /> */}
            <Bar dataKey="count" fill="#6ce5e8" shape={<CustomBar />} />
          </BarChart>
        </div>
      )}
    </div>
  );
};


export default TransactionsBarChart;

