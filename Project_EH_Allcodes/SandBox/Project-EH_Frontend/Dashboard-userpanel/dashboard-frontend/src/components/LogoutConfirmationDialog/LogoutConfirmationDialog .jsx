import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const LogoutConfirmationDialog = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Do you really want to logout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Yes, I'm sure
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutConfirmationDialog;
