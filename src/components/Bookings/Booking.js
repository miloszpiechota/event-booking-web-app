import { Box, Button, FormLabel, TextField, Typography } from '@mui/material';
import { getEventDetails, isSeatCategory } from 'api-helpers/api-helpers';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
dayjs.locale('pl');
var localizedFormat = require("dayjs/plugin/localizedFormat");
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);


const Booking = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({ seatNumber: "", date: "" });
    const [event, setEvent] = useState(null);
    const [seatCategoryInfo, setSeatCategoryInfo] = useState("");  
    const { id } = useParams(); 

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await getEventDetails(id);
                if (data && data.event) {
                    setEvent(data.event);
                    const categoryInfo = await isSeatCategory(data.event.idevent);
                    setSeatCategoryInfo(categoryInfo); 
                }
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };
        fetchEvent();
    }, [id]);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
         // Sprawdzamy, czy seatCategoryInfo jest tablicą. Jeśli nie, przekształcamy ją w tablicę.
        const categoryInfo = Array.isArray(seatCategoryInfo) ? seatCategoryInfo : [seatCategoryInfo];
        navigate('/confirm', {
            state: {
                event: id,
                seatCategoryInfo: categoryInfo,
                seatNumber: inputs.seatNumber,
                date: inputs.date,
            }
        });}
        // newBooking({ ...inputs, event: id })
        //     .then((res) => console.log("Booking successful:", res))
        //     .catch((err) => console.error("Error creating booking:", err));
    return (
        <div>
            {event ? (
                <>
                    <Typography 
                        padding={3} 
                        fontFamily="fantasy" 
                        variant="h4"
                        textAlign={"center"}
                    >
                        Book Tickets for Event: {event.name}
                    </Typography>
                    <Box display="flex" justifyContent="center">
                        <Box display="flex" flexDirection="column" paddingTop={3} width="50%" marginRight="auto">
                            <img 
                                width="80%"
                                height="300px"
                                src={event.photo} 
                                alt={event.name}
                            />
                            <Box width="80%" marginTop={3} padding={2}>
                                <Typography paddingTop={2}>{event.description}</Typography>
                                <Typography fontWeight="bold" marginTop={1}>
                                Liczba dostępnych miejsc: {event.number_of_ticket}
                                </Typography>
                                <Typography fontWeight="bold" marginTop={1}>
                                Data: {dayjs(event.startDate).format("L")} - {dayjs(event.end_date).format("L")}
                                </Typography>
                                <Typography fontWeight="bold" marginTop={1}>
                                Godzina: {dayjs(event.startDate).format("LT")} - {dayjs(event.end_date).format("LT")}
                                </Typography>
                                <Typography fontWeight="bold" marginTop={1}>
                                 Czas trwania: {dayjs(event.end_date).from(dayjs(event.startDate), true)}
                                </Typography>
                                <Typography paddingTop={2}>
                                Informacje kontaktowe: {event.contact_info}
                                </Typography>
                                <Typography paddingTop={2}>
                                Podział miejsc: {event.is_seat_categorized  ? "Tak" : "Nie"}
                                </Typography>
                                    {event.is_seat_categorized && (
                                        <Typography paddingTop={2}>
                                            {/* Seat Category Info: {seatCategoryInfo.map(category => `${category.name} - ${category.price} zł`).join(', ')} */}
                                            Seat Category Info: {seatCategoryInfo}
                                        </Typography>
                                    )}
                                <form onSubmit={handleSubmit}>
                                <Box padding={5} margin="auto" display="flex" flexDirection="column">
                                    <Button type="submit" sx={{ mt: 3 }} variant="contained">
                                        Next (Confirm)
                                    </Button>
                                </Box>
                                </form>
                            </Box>
                        </Box>
                    </Box>
                </>
            ) : (
                <Typography textAlign="center" padding={5}>
                    Loading event details...
                </Typography>
            )}
        </div>
    );
    };



export default Booking;
