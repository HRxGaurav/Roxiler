import React, { useState, useEffect } from 'react';
import styles from './TransactionsStatistics.module.css';
import Months from '../utils/Months';
import Loader from '../Models/Loader';

const TransactionsStatistics = () => {
  const [statistics, setStatistics] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('03');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/statistics?month=${selectedMonth}`);
        const data = await response.json();
        setStatistics(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.heading}>
          Statistics - {Months[Number(selectedMonth) - 1]}
        </div>

        <div>
          <select
            className={styles.select}
            id="month"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
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
      </div>

      <div className={styles.wrapper}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div>
              <div className={styles.text}>Total Sale Amount:</div>
              <div className={styles.text}>Total Sold Items:</div>
              <div className={styles.text}>Total Not Sold Items:</div>
            </div>
            <div>
              <div className={styles.text}>{statistics.totalSaleAmount}</div>
              <div className={styles.text}>{statistics.totalSoldItems}</div>
              <div className={styles.text}>{statistics.totalNotSoldItems}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionsStatistics;
