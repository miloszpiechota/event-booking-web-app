import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { getAllEvents } from '../../api-helpers/api-helpers';
import EventItem from './EventItem';


const Events = () => {
    const [events, setEvents] = useState([]);
    useEffect(() => {
        getAllEvents()
        .then((data)=>{
            console.log("data:",data);
            setEvents(data.event);
            console.log("Fetched events:", data.events);
        })
        
        .catch((err)=>console.log(err));
   }, []);
  return (
  <Box margin={"auto"} marginTop={4}>
    <Typography 
        variant="h4"
        padding={2} 
        width="100%" 
        bgcolor={"Highlight"}
        color="white" 
        textAlign={"center"}
        > 
        Events 
    </Typography>
    <Box 
        width={'100%'}
        margin="auto"
        marginTop={5}
        display={"flex"}
        justifyContent="flex"
        flexWrap="wrap"

        // zmieniłeś zgodnie z tym co jest w backendzie
        >   
        {events && 
            events.map((event,index)=>(
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
                    isSeatCategorized={event.is_seat_categorized}
                    idstatus_type={event.idstatus_type}
                />
            ))}
        </Box>
    </Box>
    );
};

export default Events;

