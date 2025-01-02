import axios from "axios";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import UserModal from "components/Modal/UserModal";
import OrderModal from "components/Modal/OrderModal";
import EventModal from "components/Modal/EventModal";
import TicketModal from "components/Modal/TicketModal";
import {
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from "@mui/material";

import {
  getUserOrders,
  getUserOrder,
  getEventDetailed,
} from "../../api-helpers/api-helpers";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventTickets, setEventTickets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState("Users");
  const [data, setData] = useState([]);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [openEventModal, setOpenEventModal] = useState(false);
  const [openTicketModal, setOpenTicketModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setOpenUserModal(true);
  };

  const openOrderDetails = async (order) => {
    console.log(order);
    const tempOrder = await getUserOrder(order.idorder);
    setSelectedOrder(tempOrder);
    console.log(selectedOrder);
    setOpenOrderModal(true);
  };

  const openEventDetails = async (event) => {
    console.log(event);
    const tempEvent = await getEventDetailed(event.idevent);
    setSelectedEvent(tempEvent);
    setOpenEventModal(true);
  };

  const openTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setOpenTicketModal(true);
  };
  const fetchData = async (table) => {
    const token = sessionStorage.getItem("token");

    try {
      let response, array;
      switch (table) {
        case "Users":
          response = await axios.post(
            "/api/users/read",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          array = response.data.query;
          break;
        case "Events":
          response = await axios.get("/api/events/read", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data.event);
          array = response.data.event;

          break;
        case "EventTickets":
          response = await axios.get("/api/event_tickets/read", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data);

          array = response.data;

          break;
        case "Orders":
          response = await axios.get("/api/orders/read", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data.orders);
          console.log(typeof response.data.orders);

          array = response.data.orders;

          break;
        default:
          response = { data: [] };
          break;
      }
      console.log("response");
      if (array) {
        console.log("admin response data");
        console.log(array);

        setData(array);
      }
    } catch (error) {
      console.error(`Błąd podczas ładowania danych dla ${table}:`, error);
    }
  };

  // Ładowanie danych po zmianie wybranej tabeli
  useEffect(() => {
    fetchData(selectedTable);
  }, [selectedTable]);
  // Funkcja renderująca nagłówki tabeli na podstawie wybranej opcji
  const renderTableHeaders = () => {
    switch (selectedTable) {
      case "Users":
        return (
          <tr>
            <th>ID użytkownika</th>
            <th>Imię</th>
            <th>Drugie Imię</th>
            <th>Nazwisko</th>
            <th>ID typu użytkownika</th>
            <th>Adres email</th>
            <th>Numer telefonu</th>
            <th>Kod pocztowy</th>
            <th>Ulica</th>
            <th>ID miasta</th>
            <th></th>
          </tr>
        );
      case "Events":
        return (
          <tr>
            <th>ID wydarzenia</th>
            <th>Nazwa wydarzenia</th>
            <th>Data rozpoczęcia</th>
            <th>Data zakończenia</th>
            <th>Opis</th>
            <th>Pula biletów</th>
            {/* <th>Link do obrazu</th> */}
            <th>Dane kontaktowe</th>
            <th></th>
          </tr>
        );
      case "EventTickets":
        return (
          <tr>
            <th>ID puli biletów</th>
            <th>Nazwa puli biletów</th>
            <th>Cena</th>
            <th>Data początkowa</th>
            <th>Data końcowa</th>
            <th>ID wydarzenia</th>
            <th></th>
          </tr>
        );
      case "Orders":
        return (
          <tr>
            <th>ID zamówienia</th>
            <th>Data zamówienia</th>
            <th>Wartość zamówienia</th>
            <th>Podatek</th>
            <th>ID użytkownika</th>
            <th></th>
          </tr>
        );
      default:
        return null;
    }
  };

  // Funkcja renderująca wiersze tabeli na podstawie danych
  const renderTableRows = () => {
    switch (selectedTable) {
      case "Users":
        return renderUsersRows();
      case "Events":
        return renderEventsRows();
      case "EventTickets":
        return renderEventTicketsRows();
      case "Orders":
        return renderOrdersRows();
      default:
        return (
          <tr>
            <td>Brak danych do wyświetlenia</td>
          </tr>
        ); // Default, jeśli brak danych
    }
  };
  const renderUsersRows = () => {
    return data.map((user, index) => (
      <tr key={index}>
        <td>{user.iduser}</td>
        <td>{user.name}</td>
        <td>{user.second_name}</td>
        <td>{user.surname}</td>
        <td>{user.iduser_type}</td>
        <td>{user.email}</td>
        <td>{user.phonenumber}</td>
        <td>{user.zipcode}</td>
        <td>{user.street}</td>
        <td>{user.idcity}</td>
        <td>
          <Button
            className="btn btn-primary"
            onClick={() => openUserDetails(user)}
          >
            Szczegóły
          </Button>
        </td>
      </tr>
    ));
  };
  const renderEventsRows = () => {
    return data.map((event, index) => (
      <tr key={index}>
        <td>{event.idevent}</td>
        <td>{event.name}</td>
        
        <td>
          {event && event.start_date
            ? format(new Date(event.start_date), "dd MMMM yyyy, HH:mm", {
                locale: pl,
              })
            : "Błędna data"}
        </td>
        <td>
          {event && event.end_date
            ? format(new Date(event.end_date), "dd MMMM yyyy, HH:mm", {
                locale: pl,
              })
            : "Błędna data"}
        </td>
        <td>
          {event.description && event.description.length > 30
            ? event.description.slice(0, 30) + "..."
            : "TBC"}
        </td>
        <td>{event.number_of_ticket}</td>
        {/* <td>{event.photo}</td> */}
        <td>{event.contact_info}</td>
        <td>
          <Button
            className="btn btn-primary"
            onClick={() => openEventDetails(event)}
          >
            Szczegóły
          </Button>
        </td>
      </tr>
    ));
  };
  const renderEventTicketsRows = () => {
    return data.map((eventTicket, index) => (
      <tr key={index}>
        <td>{eventTicket.idevent_ticket}</td>
        <td>{eventTicket.name}</td>
        <td>{eventTicket.price}</td>

        <td>
          {eventTicket && eventTicket.start_date
            ? format(new Date(eventTicket.start_date), "dd MMMM yyyy, HH:mm", {
                locale: pl,
              })
            : "Błędna data"}
        </td>
        <td>
          {eventTicket && eventTicket.end_date
            ? format(new Date(eventTicket.end_date), "dd MMMM yyyy, HH:mm", {
                locale: pl,
              })
            : "Błędna data"}
        </td>
        <td>{eventTicket.idevent}</td>
        <td>
          <Button
            className="btn btn-primary"
            onClick={() => openTicketDetails(eventTicket)}
          >
            Szczegóły
          </Button>
        </td>
      </tr>
    ));
  };
  const renderOrdersRows = () => {
    return data.map((order, index) => (
      <tr key={index}>
        <td>{order.idorder}</td>
        <td>{order.data}</td>
        <td>{order.total_amount}</td>
        <td>{order.total_tax_amount}</td>
        <td>{order.iduser}</td>
        <td>
          <Button
            className="btn btn-primary"
            onClick={() => openOrderDetails(order)}
          >
            Szczegóły
          </Button>
        </td>
      </tr>
    ));
  };

  return (
    <section>
      <div>
        <UserModal
          open={openUserModal}
          onClose={() => setOpenUserModal(false)}
          user={selectedUser}
        />
        <OrderModal
          open={openOrderModal}
          onClose={() => setOpenOrderModal(false)}
          order={selectedOrder}
        />
        <EventModal
          open={openEventModal}
          onClose={() => setOpenEventModal(false)}
          event={selectedEvent}
          comments={[]}
        />
        <TicketModal
          open={openTicketModal}
          onClose={() => setOpenTicketModal(false)}
          ticket={selectedTicket}
        />
      </div>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: 2 }}
      >
        <Select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="Users">Users</MenuItem>
          <MenuItem value="Events">Events</MenuItem>
          <MenuItem value="EventTickets">Event Tickets</MenuItem>
          <MenuItem value="Orders">Orders</MenuItem>
        </Select>

        {selectedTable == "Events" ? (
          <Button variant="contained" className="btn btn-primary">
            Dodaj wydarzenie
          </Button>
        ) : null}
        {selectedTable == "EventTickets" ? (
          <Button variant="contained" className="btn btn-primary">
            Dodaj pulę biletów
          </Button>
        ) : null}
      </Stack>
      {/* <form>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              <option value="Users">Users</option>
              <option value="Events">Events</option>
              <option value="EventTickets">Event Tickets</option>
              <option value="Orders">Orders</option>
            </select>
          </form>
        
          {selectedTable == "Events" ? (
            <button className="btn btn-primary">Dodaj wydarzenie</button>
          ) : null}
          {selectedTable == "EventTickets" ? (
            <button className="btn btn-primary">Dodaj pulę biletów</button>
          ) : null} */}

      <table className="table">
        <thead>{renderTableHeaders()}</thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
    </section>
  );
};

export default AdminPanel;
