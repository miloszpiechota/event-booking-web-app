import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import { Box, Typography } from '@mui/material';
import { getAllEvents } from '../../api-helpers/api-helpers';
import EventItem from './EventItem';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Events = () => {
    const [events, setEvents] = useState([]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                console.log("asking");
                const data = await getAllEvents();
                setEvents(data.event);
                console.log("Fetched events:", data.event);
            } catch (err) {
                console.log(err);
            }
        };
        fetchEvents();
    }, []);

    return (
        <Box margin="auto" marginTop={4}>
            <Typography 
                variant="h4"
                padding={2} 
                width="100%" 
                bgcolor="Highlight"
                color="white" 
                textAlign="center"
            >
                Events
            </Typography>

            {/* Slider z kafelkami wydarzeń */}
            <Box margin="auto" width="80%" marginTop={5}>
                <div className="slider-container">
                <Slider {...settings}>
                    {events && events.map((event, index) => (
                        <Box key={index} padding={2}>
                            <EventItem 
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
                                locationName={event.idevent_location}
                            />
                        </Box>
                    ))}
                </Slider>
                </div>
            </Box>
        </Box>
    );
};

export default Events;
