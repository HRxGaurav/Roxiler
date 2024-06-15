import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";

import TransactionsBarChart from './components/TransactionsBarChart'
import TransactionsPieChart from './components/TransactionsPieChart'
import TransactionsStatistics from './components/TransactionsStatistics'

const App = () => {
  return (
    <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/price_stats" element={<TransactionsBarChart />} />
        <Route path="/category_stats" element={<TransactionsPieChart />} />
        <Route path="/transaction_stats" element={<TransactionsStatistics />} />
       
      </Routes>
    </>
  );
};

export default App;
