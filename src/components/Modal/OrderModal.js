import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import style from "./modalStyle";

const OrderModal = ({ open, onClose, order }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-order-title"
      aria-describedby="modal-order-description"
    >
      <Box sx={style}>
        <Typography id="modal-order-title" variant="h6" component="h2">
          Szczegóły zamówienia nr {order ? order.idorder : "Ładowanie..."}
        </Typography>
        <Typography id="modal-order-description" sx={{ mt: 2 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Numer biletu</th>
                <th>Nazwa Wydarzenia</th>
                <th>Lokalizacja</th>
                <th>Pula biletu</th>
                <th>Cena</th>
                <th>Status biletu</th>
              </tr>
            </thead>
            <tbody>
              {order && order.order_tickets ? order.order_tickets.map((ticket) => (
                    <tr key={ticket.idorder_ticket}>
                      <td>{ticket.idorder_ticket}</td>
                      <td>{ticket.event_ticket.event.name}</td>
                      <td>{ticket.event_ticket.event.event_location.name}</td>
                      <td>{ticket.event_ticket.name}</td>
                      <td>{ticket.event_ticket.price} zł</td>
                      <td>{ticket.ticket_status}</td>
                      <td>
                        <Button>Pobierz bilet</Button>
                      </td>
                    </tr>
                  ))
                : "Ładowanie..."}
            </tbody>
          </table>
        </Typography>
      </Box>
    </Modal>
  );
};

export default OrderModal;
