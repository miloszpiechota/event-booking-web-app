import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
dayjs.locale('pl');
dayjs.extend(require("dayjs/plugin/localizedFormat"));
dayjs.extend(require("dayjs/plugin/relativeTime"));

const Confirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { 
        selectedCategory, 
        quantity, 
        eventName, 
        seatNumber, 
        start_date, 
        end_date, 
        price, 
        locationName, 
        is_seat_categorized 
    } = location.state || {};

    const handleBuyTicket = () => {
        navigate('/confirm-ticket', {
            state: {
                selectedCategory,
                quantity,
                eventName,
                seatNumber,
                start_date,
                end_date,
                price,
                locationName,
                is_seat_categorized
            }
        });
    };

    return (
        <Box padding={5}>
            <Typography variant="h4" gutterBottom>
                Potwierdzenie Rezerwacji
            </Typography>
            <Typography variant="h6">Wybrana kategoria miejsca:</Typography>
            <Box display="flex" flexDirection="column" gap={2}>
                {selectedCategory ? (
                    <Box padding={2} border="1px solid gray" borderRadius={4}>
                        <Typography variant="body1" fontWeight="bold">
                            {selectedCategory.name}
                        </Typography>
                        {selectedCategory.price !== null ? (
                            <>
                                <Typography variant="body2">
                                    Cena za sztukę: {selectedCategory.price} zł
                                </Typography>
                                <Typography variant="body2">Ilość: {quantity}</Typography>
                                <Typography variant="body2">
                                    Łączna cena: {selectedCategory.price * quantity} zł
                                </Typography>
                            </>
                        ) : (
                            <>
                                <Typography variant="body2">Ilość: {quantity}</Typography>
                                {price !== null && (
                                    <Typography variant="body2">
                                        Łączna cena: {price * quantity} zł
                                    </Typography>
                                )}
                            </>
                        )}
                    </Box>
                ) : (
                    <Typography>Brak wybranej kategorii.</Typography>
                )}
            </Box>
            <Box marginTop={4}>
                <Typography variant="h6">Szczegóły zamówienia:</Typography>
                <Typography>Wydarzenie: {eventName}</Typography>
                <Typography>Data rozpoczęcia: {dayjs(start_date).format("L")}</Typography>
                <Typography>Data zakończenia: {dayjs(end_date).format("L")}</Typography>
                <Typography>Lokalizacja: {locationName}</Typography>
                <Typography>Podział miejsc: {is_seat_categorized ? "Tak" : "Nie"}</Typography>
                {is_seat_categorized && (
                    <Typography>Numer Miejsca: {seatNumber}</Typography>
                )}
            </Box>
            {/* Przyciski akcji */}
            <Box marginTop={5} display="flex" justifyContent="center">
                <Button variant="contained" color="primary" onClick={handleBuyTicket}>
                    Kup bilet
                </Button>
            </Box>
        </Box>
    );
};

export default Confirmation;
