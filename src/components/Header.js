import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Tab, Toolbar, Tabs, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import Autocomplete from "@mui/joy/Autocomplete";
import EventIcon from "@mui/icons-material/Event";
import { searchEvents } from "../api-helpers/api-helpers";

const Header = () => {
  const [value, setValue] = useState(0);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("decoded");
    sessionStorage.removeItem("decToken");
  };
  // Search function for events based on input query
  const handleSearchChange = async (event, newValue) => {
    setSearchQuery(newValue || "");
    if (newValue) {
      const filteredEvents = await searchEvents(newValue);
      setEvents(
        filteredEvents.map((event) => ({
          label: event.name,
          id: event.idevent,
        }))
      );
    } else {
      setEvents([]);
    }
  };

  // Navigate to selected event's booking page
  const handleEventSelect = (event, selectedEvent) => {
    const selected = events.find((e) => e.label === selectedEvent);
    if (selected) {
      navigate(`/booking/${selected.id}`);
    }
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "green" }}>
      <Toolbar>
        <Box width={"20%"}>
          <IconButton component={Link} to="/">
            <EventIcon />
          </IconButton>
        </Box>
        <Box width={"50%"} margin={"auto"}>
          <Autocomplete
            placeholder="Wyszukaj wydarzenie"
            options={events.map((option) => option.label)}
            inputValue={searchQuery}
            onInputChange={handleSearchChange}
            onChange={handleEventSelect}
            sx={{ width: { xs: "100%", sm: 280 } }}
            slotProps={{
              listbox: { disablePortal: true, sx: { maxHeight: 140 } },
            }}
          />
        </Box>
        <Box display={"flex"}>
          <Tabs
            textColor="inherit"
            indicatorColor="secondary"
            value={value}
            onChange={(e, val) => setValue(val)}
          >
            <Tab component={Link} to="/events" label="Events" />
            
            <Tab label="Auth" component={Link} to="/auth" />
            
            
            {sessionStorage["token"] ? (
              <React.Fragment>
                {/* <Tab label="Profile" component={Link} to="/user" />
                <Tab label="Admin" component={Link} to="/admin" /> */}
                <Tab label="Panel użytkownika" component={Link} to="/panel" />
                <Tab label="Logout" onClick={() => { logout(); navigate("/"); }}/>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Tab label="Register" component={Link} to="/register" />
                <Tab label="UserLogin" component={Link} to="/login" />
              </React.Fragment>
            )}
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
