import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import style from './modalStyle';
const UserModal = ({ open, onClose, user }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-user-title" aria-describedby="modal-user-description">
      <Box sx={style}>
        <Typography id="modal-user-title" variant="h6" component="h2">
          Szczegóły użytkownika: {user ? user.name : 'Ładowanie...'}
        </Typography>
        <Typography id="modal-user-description" sx={{ mt: 2 }}>
          {user ? (
            <div>
              <p>Imię: {user.name}</p>
              <p>Email: {user.email}</p>
              {/* Dodaj inne dane użytkownika */}
            </div>
          ) : (
            "Ładowanie..."
          )}
        </Typography>
      </Box>
    </Modal>
  );
};

export default UserModal;
