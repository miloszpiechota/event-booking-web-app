
import { Box, Button, Typography, TextField } from '@mui/material';
import { getEventDetails, getCategoryNameById, getLocationById, isSeatCategory, getStatusById, getPrice} from 'api-helpers/api-helpers';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
dayjs.locale('pl');
dayjs.extend(require("dayjs/plugin/localizedFormat"));
dayjs.extend(require("dayjs/plugin/relativeTime"));

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const Booking = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [seatCategoryInfo, setSeatCategoryInfo] = useState([]);
    const [categoryName, setCategoryName] = useState("Ładowanie kategorii...");
    const [locationName, setLocationName] = useState("Ładowanie lokalizacji...");
    const [statusName, setStatusName] = useState("Ładowanie statusu...");
    const { handleSubmit, control } = useForm({
        defaultValues: {
            seatNumber: "",
        }
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await getEventDetails(id);
                if (data && data.event) {
                    setEvent(data.event);
                    // const categoryInfo = await isSeatCategory(data.event.idevent);
                    // setSeatCategoryInfo(Array.isArray(categoryInfo) ? categoryInfo : [categoryInfo]);
                    const priceInfo = await getPrice(data.event.idevent);
                    setSeatCategoryInfo(Array.isArray(priceInfo) ? priceInfo : [priceInfo]);


                    const fetchedCategoryName = await getCategoryNameById(data.event.idevent_category);
                    setCategoryName(fetchedCategoryName || "Brak kategorii");

                    console.log("Fetched category name:", fetchedCategoryName);                
                    const fetchedLocationName = await getLocationById(data.event.idevent_location); 

                    setLocationName(fetchedLocationName || "Brak lokalizacji");
                    console.log("Fetched location name:", fetchedLocationName);

                    const fetchedStatusName = await getStatusById(data.event.idstatus_type);
                    setStatusName(fetchedStatusName || "Brak statusu"); 
                }
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };
        fetchEvent();
    }, [id]);

    const onSubmit = (data) => {
        navigate('/confirm', {
            state: {
                event: id,
                eventName: event.name,
                seatCategoryInfo,
                seatNumber: data.seatNumber,
                date: data.date,
                start_date: event.start_date,
                end_date: event.end_date,
                numberOfTickets: data.number_of_ticket,
                category: data.category,
                locationName: locationName,
                is_seat_categorized: event.is_seat_categorized,
                eventDescription: event.description
            }
        });

    };

    return (
        <div>
            {event ? (
                <>
                    <Typography padding={3} fontFamily="fantasy" variant="h4" textAlign={"center"}>
                        Book Tickets for Event: {event.name}
                    </Typography>
                    <Box display="flex" justifyContent="center">
                        <Box display="flex" flexDirection="column" paddingTop={3} width="50%" marginRight="auto">
                            <img width="80%" height="300px" src={event.photo} alt={event.name} />
                            <Box width="80%" marginTop={3} padding={2}>
                                <Typography paddingTop={2}>{event.description}</Typography>
                                <Typography fontWeight="bold" marginTop={1}>
                                    Liczba dostępnych miejsc: {event.number_of_ticket}
                                </Typography>
                                <Typography fontWeight="bold" marginTop={1}>
                                    Data: {formatDate(event.start_date)} - {formatDate(event.end_date)}
                                </Typography>
                                <Typography fontWeight="bold" marginTop={1}>
                                    Godzina: {formatTime(event.start_date)} - {formatTime(event.end_date)}
                                </Typography>
                                <Typography fontWeight="bold" marginTop={1}>
                                    Czas trwania: {dayjs(event.end_date).from(dayjs(event.start_date), true)}
                                </Typography>
                                <Typography paddingTop={2}>
                                    Informacje kontaktowe: {event.contact_info}
                                </Typography>
                                <Typography paddingTop={2}>
                                    Podział miejsc: {event.is_seat_categorized ? "Tak" : "Nie"}
                                </Typography>
                                <Typography paddingTop={2}>
                                    Kategoria: {categoryName}
                                </Typography>
                                <Typography paddingTop={2}>
                                    Lokalizacja: {locationName}
                                </Typography>
                                <Typography paddingTop={2}>
                                    Status: {statusName} {/* Wyświetl status */}
                                </Typography>

                                {/* {event.is_seat_categorized && (
                                    <Box paddingTop={2}>
                                        <Typography fontWeight="bold">Seat Category Info:</Typography>
                                        {seatCategoryInfo.map((category, index) => (
                                            <Typography key={index}>
                                                {category.name} - Cena: {category.price} zł
                                            </Typography>
                                        ))}
                                    </Box>
                                )} */}

                                    <Box paddingTop={2}>
                                    <Typography fontWeight="bold">Seat Category Info:</Typography>
                                    {seatCategoryInfo.length > 0 ? (
                                        seatCategoryInfo.map((category, index) => (
                                            <Typography key={index}>
                                                {category.name} - Cena: {category.price} zł
                                            </Typography>
                                        ))
                                    ) : (
                                        <Typography>Brak dostępnych biletów.</Typography>
                                    )}
                                </Box>
                                <form onSubmit={handleSubmit(onSubmit)}>
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
