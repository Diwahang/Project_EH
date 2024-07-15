import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmationDialog from '../LogoutConfirmationDialog/LogoutConfirmationDialog ';

const Logout = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLogout = () => {
    // Clear user information from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user'); // Adjust this based on your stored user data

    // Navigate to landing page or another route after logout
   navigate('/') // Replace with your desired landing page route
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <button onClick={openDialog}>Logout</button>
      <LogoutConfirmationDialog
        isOpen={dialogOpen}
        onConfirm={handleLogout} // Pass handleLogout directly as the onConfirm prop
        onCancel={closeDialog}   // Pass closeDialog as the onCancel prop
      />
    </div>
  );
};

export default Logout;
