import React, { useState, useEffect, useRef } from 'react';
import Loader from '../Models/Loader';
import style from './TransactionsTable.module.css'; 

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [deSearchText, setDeSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState('03'); 
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const timeoutId = useRef(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/transactions?month=${selectedMonth}&page=${currentPage}&perPage=10&search=${searchText}`);
        const { transactions: data, totalCount } = await response.json();
        setCurrentPage(1);
        setTransactions(data);
        setTotalItems(totalCount);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedMonth, currentPage, searchText]);

  

  const handleSearchChange = (event) => {
    const val = event.target.value;
    setDeSearchText(val);
    
    clearTimeout(timeoutId.current);
    
    timeoutId.current = setTimeout(() => {
      setSearchText(val);
    }, 300);
  };
  
  

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(totalItems / 10)));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className={style.transactionsTable}> 
      <div className={style.transactionHeading}>Transactions Dashboard</div>

      <div className={style.filterDiv}>
        <input className={style.transactionSearch} type="text" value={deSearchText} onChange={handleSearchChange} placeholder="Search transaction" />
      
        <div>
            
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

      </div>
      <table className={style.transactionTable}> 
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <Loader />
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.productId}</td>
                <td>{transaction.productName}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{transaction.category}</td>
                <td>{transaction.isSold ? "Yes" : "No"}</td>
                <td><a href={transaction.image} target="_blank" rel="noopener noreferrer"> {transaction.image} </a></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className={style.bottomDiv}>
        <div>{`Page ${currentPage} of ${Math.ceil(totalItems / 10)}`}</div>
        <div >
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button> 
          <span style={{ margin: '0 10px' }}> - </span>
          <button onClick={handleNextPage} disabled={currentPage === Math.ceil(totalItems / 10)}>Next</button>
        </div>
        <div>Per Page : 10 </div>

      </div>
    </div>
  );
};

export default TransactionsTable;
