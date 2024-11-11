
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from "react-router-dom";
import EventItem from './Events/EventItem';
import { getAllEvents } from '../api-helpers/api-helpers.js';

const HomePage = () => {
    const [events, setEvents] = useState([]);
 useEffect(() => {
     const fetchData = async () => {
         try {
             const data = await getAllEvents();
             setEvents(data.event); 
         } catch (err) {
             console.log(err);
         }
     };
     fetchData();
 }, []);

  return (
    <Box width={'100%'} height="100%" margin="auto" marginTop={2}>
        <Box margin={"auto"} width="80%" height={"40vh"} padding={2}>
            <img src="https://www.eventbookings.com/wp-content/uploads/2024/01/Different-Types-of-Events-in-2024-Which-is-Right-for-You-2048x1365.jpg"
             alt="Event"
             width={'100%'}
             height={'100%'} />
        </Box>
        <Box padding={5} margin="auto">
            <Typography variant="h4" textAlign={"center"}>
                Welcome to EventBookings
            </Typography>
        </Box>
        <Box
        margin={"auto"}
        display="flex"
        width="80%"
        justifyContent={"center"}
        alignContent="center"
        flexWrap="wrap"
        >
            {events && 
                events
                .slice(0, 4)
                .map((event,index) => (
                <EventItem 
                    key={index} 
                    id={event.idevent} 
                    name={event.name} 
                    startDate={event.start_date} 
                    endDate={event.end_date} 
                    description={event.description} 
                    numberOfTickets={event.number_of_ticket} 
                    posterUrl={event.photo} 
                    contactInfo={event.contact_info} 
                    idstatus_type={event.idstatus_type}
                    isSeatCategorized={event.is_seat_categorized}
                />
                ))}
        </Box>
        <Box display="flex" padding={5} margin="auto">
            <Button 
                component={Link} 
                to="/events" 
                variant="outlined"
                sx={{margin: "auto", color: "#2b2d42", borderColor: "#2b2d42"}}
            >
                View All Events
            </Button>
        </Box>
    </Box>   
  );
};

export default HomePage;
