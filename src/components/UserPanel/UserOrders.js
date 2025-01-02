import React, { useState, useEffect } from "react";
import { getUserOrders, getUserOrder } from "../../api-helpers/api-helpers";
// import UserOrderDetails from "./UserOrderDetails";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import OrderModal from "components/Modal/OrderModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState([]);

  const [openOrderModal, setOpenOrderModal] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const openOrderDetails = async (order) => {
    console.log(order);
    const tempOrder = await getUserOrder(order.idorder);
    setSelectedOrder(tempOrder);
    console.log(selectedOrder);
    setOpenOrderModal(true);
  };
  const handleOpen = (idorder) => {
    handleShowDetails(idorder);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedOrder(null);
    setOpen(false);
  };

  const handleShowDetails = async (idorder) => {
    try {
      const userOrder = await getUserOrder(idorder);
      setSelectedOrder(userOrder);
      console.log(selectedOrder);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const iduser = sessionStorage.getItem("iduser");

        const [userOrders] = await Promise.all([getUserOrders(iduser)]);
        console.log(userOrders);
        setOrders(userOrders);
        sessionStorage.setItem("orders", userOrders);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchUserOrders();
  }, []);

  return (
    <section>
      <OrderModal
        open={openOrderModal}
        onClose={() => setOpenOrderModal(false)}
        order={selectedOrder}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Szczegóły zamówienia nr{" "}
            {selectedOrder ? selectedOrder.idorder : "Ładowanie..."}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Numer biletu</th>
                  <th>Nazwa Wydarzenia</th>
                  <th>Lokalizacja</th>
                  <th>Pula bieltu</th>
                  <th>Cena</th>
                  <th>Status biletu</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder
                  ? selectedOrder.order_tickets.map((ticket) => (
                      <tr>
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
                  : "Ładowanie"}
              </tbody>
            </table>
          </Typography>
        </Box>
      </Modal>
      <table className="table">
        <thead>
          <tr>
            <th>Numer zamówienia</th>
            <th>Data złożenia zamówienia</th>
            {/* <th>iduser</th> */}
            <th>Wartość zamówienia</th>
            <th>Kwota podatku</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.idorder}>
              <td>{order.idorder}</td>
              <td>
                {format(new Date(order.data), "dd MMMM yyyy, HH:mm:ss", {
                  locale: pl,
                })}
              </td>
              {/* <td>{order.iduser}</td> */}
              <td>{order.total_amount} zł</td>
              <td>{order.total_tax_amount} zł</td>

              <td>
                <Button
                  className="btn btn-primary"
                  onClick={() => openOrderDetails(order)}
                >
                  Szczegóły
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
export default UserOrders;
