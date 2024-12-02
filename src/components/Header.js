// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { AppBar, Tab, Toolbar, Tabs, IconButton } from "@mui/material";
// import EventIcon from "@mui/icons-material/Event";
// import { Box } from "@mui/system";
// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
// import { getAllEvents } from "../api-helpers/api-helpers";

// const Header = () => {
//   const dispatch = useDispatch();
//   const [value, setValue] = useState(0);
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     getAllEvents()
//       .then((data) => setEvents(data.events))
//       .catch((err) => console.log(err));
//   }, []);

//   const handleChange = (e, val) => {
//     const event = events.find((m) => m.name === val);
//     console.log(event);
//   };

//   const logout = (isAdmin) => {
//     // Add your logout logic here
//   };

//   return (
//     <AppBar position="sticky" sx={{ bgcolor: "green" }}>
//       <Toolbar>
//         <Box width={"20%"}>
//           <IconButton component={Link} to="/">
//             <EventIcon />
//           </IconButton>
//         </Box>
//         <Box width={"50%"} margin={"auto"}>
//           <Autocomplete
//             onChange={handleChange}
//             freeSolo
//             options={(events || []).map((option) => option.title)}
//             sx={{ width: 300 }}
//             renderInput={(params) => (
//               <TextField
//                 sx={{ input: { color: "white" } }}
//                 variant="standard"
//                 {...params}
//                 placeholder="Search Events"
//               />
//             )}
//           />
//         </Box>
//         <Box display={"flex"}>
//           <Tabs
//             textColor="inherit"
//             indicatorColor="secondary"
//             value={value}
//             onChange={(e, val) => setValue(val)}
//           >
//             <Tab component={Link} to="/events" label="Events" />
            
           
//             <Tab label="Admin" component={Link} to="/admin" />
//             <Tab label="Auth" component={Link} to="/auth" />
//             <Tab label="Register" component={Link} to="/register" /> 
//             <Tab label="UserLogin" component={Link} to="/login" />
            
//             <Tab label="Profile" component={Link} to="/user" />
//             <Tab
//               onClick={() => logout(false)}
//               label="Logout"
//               component={Link}
//               to="/"
//             />
//           </Tabs>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Tab, Toolbar, Tabs, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import Autocomplete from '@mui/joy/Autocomplete';
import HomeIcon from '@mui/icons-material/Home';
import { searchEvents }  from "../api-helpers/api-helpers";


const Header = () => {
  const [value, setValue] = useState(0);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Search function for events based on input query
  const handleSearchChange = async (event, newValue) => {
    setSearchQuery(newValue || "");
    if (newValue) {
      const filteredEvents = await searchEvents(newValue);
      setEvents(filteredEvents.map(event => ({ label: event.name, id: event.idevent })));
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
    <AppBar position="sticky" sx={{ bgcolor: "#011C40" }}>
      <Toolbar>
        <Box width={"20%"}>
          <IconButton component={Link} to="/">
            <HomeIcon color="primary" /> 
          </IconButton>
          
        </Box>
        <Box width={"50%"} margin={"auto"} >
            <Autocomplete
              placeholder="Wyszukaj wydarzenie"
              options={events.map((option) => option.label)}
              inputValue={searchQuery}
              onInputChange={handleSearchChange}
              onChange={handleEventSelect}
              sx={{ width: { xs: '100%', sm: 280 } }}
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
            <Tab label="Admin" component={Link} to="/admin" />
            <Tab label="Auth" component={Link} to="/auth" />
            <Tab label="Register" component={Link} to="/register" />
            <Tab label="UserLogin" component={Link} to="/login" />
            <Tab label="Profile" component={Link} to="/user" />
            <Tab label="Logout" component={Link} to="/" />
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;



