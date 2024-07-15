import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Wallet.css";

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [activeDropdown, setActiveDropdown] = useState("");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [filter, setFilter] = useState("7days");
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const transactionsPerPage = 10;

  useEffect(() => {
    fetchWallet();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchTransactions(1, filter, true);
  }, [filter]);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://127.0.0.1:8000/api/wallet/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWallet(response.data);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };

  const fetchTransactions = async (page, currentFilter, reset = false) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/transactions/?page=${page}&page_size=${transactionsPerPage}&filter=${currentFilter}&ordering=-date`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setHasMore(data.length === transactionsPerPage);

      if (reset) {
        setTransactions(data);
      } else {
        setTransactions((prevTransactions) => [...prevTransactions, ...data]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleLoadFundsClick = () => {
    setIsPopUpVisible(true);
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/add-balance/",
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        fetchWallet();
        setIsPopUpVisible(false);
        setAmount("");
        setCurrentPage(1);
        fetchTransactions(1, filter, true);
      }
    } catch (error) {
      console.error("Error adding funds:", error);
    }
  };

  const handleWithdraw = async () => {
    // Implement withdraw functionality here
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? "" : menu);
  };

  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  const handleFilterSelection = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const loadMoreTransactions = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    fetchTransactions(currentPage + 1, filter);
  };

  return (
    <div className="wallet-container">
      <div className="wallet-card">
        <div className="wallet-balance-outer-container">
          <div className="wallet-balance" onClick={toggleBalanceVisibility}>
            <h2>Wallet Balance:</h2>
            <h1>
              Rs. {wallet ? (isBalanceVisible ? wallet.balance : "XXXX.XX") : "Loading..."}
            </h1>
          </div>
          <div className="wallet-balance">
            <h2>Total Earnings:</h2>
            <h1>Rs. {wallet ? wallet.total_earning : "Loading..."}</h1>
          </div>
        </div>
        <div className="wallet-actions">
          <button onClick={handleLoadFundsClick}>Load Amount</button>
          <button onClick={handleWithdraw}>Withdraw</button>
        </div>
      </div>

      <div className="wallet-menu">
        <div className="menu-item" onClick={() => toggleDropdown("earnings")}>
          Earnings
          {activeDropdown === "earnings" && (
            <div className="dropdown">
              <div>Earned: {wallet ? wallet.total_earning : "Loading..."}</div>
              <div>Spending: {wallet ? wallet.total_spending : "Loading..."}</div>
            </div>
          )}
        </div>
      </div>

      <div className="wallet-transactions">
        <div className="header-and-filter">
          <h3>Recent transactions</h3>
          <div className="filter-container">
            <button className="filter-button" onClick={toggleFilterOptions}>
              Filter
            </button>
            {showFilterOptions && (
              <div className="filter-options">
                <div className="filter-options-container">
                  <div className="options-filter" onClick={() => handleFilterSelection("7days")}>
                    Last 7 days
                  </div>
                  <div className="options-filter" onClick={() => handleFilterSelection("15days")}>
                    Last 15 days
                  </div>
                  <div className="options-filter" onClick={() => handleFilterSelection("3months")}>
                    Last 3 months
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Advertisement</th>
              <th>Transaction Date</th>
              <th>Type</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.advertisement_title || "N/A"}</td>
                  <td>{new Date(transaction.date).toLocaleString()}</td>
                  <td>{transaction.transaction_type}</td>
                  <td>{transaction.status}</td>
                  <td>Rs. {transaction.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
        {hasMore && (
          <button className="load-more-button" onClick={loadMoreTransactions}>
            Load More
          </button>
        )}
      </div>

      {isPopUpVisible && (
        <div className="popup">
          <div className="popup-content">
            <form onSubmit={handleAddFunds}>
              <label>
                Amount:
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </label>
              <div className="popup-buttons">
                <button type="submit">Add</button>
                <button type="button" onClick={() => setIsPopUpVisible(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;