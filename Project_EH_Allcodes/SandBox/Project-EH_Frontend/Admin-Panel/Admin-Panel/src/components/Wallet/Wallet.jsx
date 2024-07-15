import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Wallet.css';

const Wallet = () => {
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isPopUpVisible, setIsPopUpVisible] = useState(false);
    const [amount, setAmount] = useState('');


    useEffect(() => {
        fetchWallet();
        fetchTransactions();
    }, []);

    const fetchWallet = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://127.0.0.1:8000/api/wallet/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setWallet(response.data);
        } catch (error) {
            console.error('Error fetching wallet data:', error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://127.0.0.1:8000/api/transactions/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleLoadFundsClick = () => {
        setIsPopUpVisible(true);
    };

    const handleAddFunds = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post('http://127.0.0.1:8000/api/add-balance/', { amount }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                fetchWallet(); // Refresh wallet data
                setIsPopUpVisible(false);
                setAmount('');
            }
        } catch (error) {
            console.error('Error adding funds:', error);
        }
    };

    const handleWithdraw = async () => {
        // Implement withdraw functionality here
    };

    return (
        <div className="wallet-container">
            {wallet ? (
                <>
                    <div className="wallet-header">
                        <h2>Wallet</h2>
                        <p>Balance: ${wallet.balance}</p>
                    </div>
                    <div className="wallet-actions">
                        <button onClick={handleLoadFundsClick}>Load Funds</button>
                        <button onClick={handleWithdraw}>Withdraw</button>
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
                                        <button type="button" onClick={() => setIsPopUpVisible(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    <div className="wallet-transactions">
                        <h3>Recent Transactions</h3>
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
                                {transactions.map(transaction => (
                                    <tr key={transaction.id}>
                                        <td>{transaction.advertisement ? transaction.advertisement_title : 'N/A'}</td>
                                        <td>{new Date(transaction.date).toLocaleString()}</td>
                                        <td>{transaction.transaction_type}</td>
                                        <td>{transaction.status}</td>
                                        <td>${transaction.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <p>Loading wallet information...</p>
            )}
        </div>
    );
};

export default Wallet;
