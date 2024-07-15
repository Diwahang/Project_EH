import React, { useState } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onSubmit }) => {
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(amount);
        setAmount('');
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Load Funds</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Amount:
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Add</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default Modal;
