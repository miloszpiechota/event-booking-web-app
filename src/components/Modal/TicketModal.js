import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import style from './modalStyle';

const TicketModal = ({ open, onClose, ticket }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-ticket-title" aria-describedby="modal-ticket-description">
      <Box sx={style}>
        <Typography id="modal-ticket-title" variant="h6" component="h2">
          Szczegóły biletu: {ticket ? ticket.idorder_ticket : 'Ładowanie...'}
        </Typography>
        <Typography id="modal-ticket-description" sx={{ mt: 2 }}>
          {ticket ? (
            <div>
              <p>Numer biletu: {ticket.idorder_ticket}</p>
              <p>Status: {ticket.ticket_status}</p>
              {/* Dodaj inne szczegóły biletu */}
            </div>
          ) : (
            "Ładowanie..."
          )}
        </Typography>
      </Box>
    </Modal>
  );
};

export default TicketModal;
