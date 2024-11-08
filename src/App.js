import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import Events from "./components/Events/Events";
import Login from "./components/Login/UserLogin";
import Booking from "./components/Bookings/Booking";
import UserRegistration from "./components/Registration/UserRegistration";
import ConfirmBooking from "./components/Confirm/ConfirmBooking";
import Confirmation from "./components/Confirm/Confirmation";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
function App() {
  return (
    <div>
      <Header/>
      <section>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/events" element={<Events/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/booking/:id" element={<Booking/>} />
          <Route path="/register" element={<UserRegistration />} />
          <Route path="/confirm" element={<ConfirmBooking />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </section>
    </div>
  );
}

export default App;
