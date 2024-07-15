import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dashboard, AccountBalanceWallet, Campaign, MonetizationOn, Description, AccountCircle, ExitToApp } from '@mui/icons-material';
import LogoutConfirmationDialog from '../LogoutConfirmationDialog/LogoutConfirmationDialog ';
import './Sidebar.css';

const Sidebar = () => {
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');

    // Close the dialog
    setLogoutDialogOpen(false);

    // Navigate to the landing page
    navigate('/');
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <div className="sideNavBar">
      <div className="sidebar">
        <h2>Advertise Hub</h2>
        <ul>
          <li>
            <Link to="/dashboard">
              <Dashboard className="sidebar-icon" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/dashboard/wallet">
              <AccountBalanceWallet className="sidebar-icon" />
              Wallet
            </Link>
          </li>
          <li>
            <Link to="/dashboard/advertise">
              <Campaign className="sidebar-icon" />
              Advertise
            </Link>
          </li>
          <li>
            <Link to="/dashboard/earn">
              <MonetizationOn className="sidebar-icon" />
              Earn
            </Link>
          </li>
          <li>
            <Link to="/dashboard/profile">
              <AccountCircle className="sidebar-icon" />
              Profile
            </Link>
          </li>
          <li>
            <Link to="/dashboard/logout" onClick={handleLogoutClick}>
              <ExitToApp className="sidebar-icon" />
              Logout
            </Link>
          </li>
          <li>
            <Link to="/dashboard/adminads">
              <ExitToApp className="sidebar-icon" />
              Admin Advertisement
            </Link>
          </li>
        </ul>
      </div>
      <LogoutConfirmationDialog
        isOpen={isLogoutDialogOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </div>
  );
};

export default Sidebar;
