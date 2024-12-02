import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import Events from "./components/Events/Events";
import Login from "./components/Login/UserLogin";
import UserPanel from "./components/UserPanel/UserPanel";
import Booking from "./components/Bookings/Booking";
import UserRegistration from "./components/Registration/UserRegistration";
import ConfirmBooking from "./components/Confirm/ConfirmBooking";
import Confirmation from "./components/Confirm/Confirmation";
import ConfirmTicket from "./components/Ticket/ConfirmTicket";
import React from "react";

function App() {
  return (
    <div>
      <Header />
      <section>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/panel" element={<UserPanel />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/register" element={<UserRegistration />} />
          <Route path="/confirm" element={<ConfirmBooking />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/confirm-ticket" element={<ConfirmTicket />} />
        </Routes>
      </section>
    </div>
  );
}

export default App;
