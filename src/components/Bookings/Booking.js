import { Box, Button, FormLabel, TextField, Typography } from '@mui/material';
import { getEventDetails, newBooking } from 'api-helpers/api-helpers';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Booking = () => {
    const [inputs, setInputs] = useState({ seatNumber: "", date: "" });
    const [event, setEvent] = useState(null);
    const { id } = useParams(); // Fetch id from URL

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await getEventDetails(id);
                if (data && data.event) {
                    setEvent(data.event); // Save event data to state
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
        newBooking({ ...inputs, event: id })
            .then((res) => console.log("Booking successful:", res))
            .catch((err) => console.error("Error creating booking:", err));
    };

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
                                    Start Date: {new Date(event.startDate).toDateString()}
                                </Typography>
                                <Typography fontWeight="bold" marginTop={1}>
                                    End Date: {new Date(event.endDate).toDateString()}
                                </Typography>
                            </Box>
                        </Box>
                        <Box width="50%" paddingTop={3}>
                            <form onSubmit={handleSubmit}>
                                <Box padding={5} margin="auto" display="flex" flexDirection="column">
                                    <FormLabel>Seat Number</FormLabel>
                                    <TextField
                                        name="seatNumber"
                                        value={inputs.seatNumber}
                                        onChange={handleChange}
                                        type="number"
                                        margin="normal"
                                        variant="standard"
                                    />
                                    <FormLabel>Booking Date</FormLabel>
                                    <TextField
                                        name="date"
                                        type="date"
                                        margin="normal"
                                        variant="standard"
                                        value={inputs.date}
                                        onChange={handleChange}
                                    />
                                    <Button type="submit" sx={{ mt: 3 }} variant="contained">
                                        Book Now
                                    </Button>
                                </Box>
                            </form>
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
