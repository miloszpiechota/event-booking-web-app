import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
dayjs.locale('pl');
dayjs.extend(require("dayjs/plugin/localizedFormat"));
dayjs.extend(require("dayjs/plugin/relativeTime"));

const ConfirmTicket = () => {
    const location = useLocation();
    const { 
        selectedCategory, 
        quantity, 
        eventName, 
        start_date, 
        end_date, 
        price, 
        locationName, 
        is_seat_categorized, 
        seatNumber 
    } = location.state || {};

    return (
        <Box padding={5} border="1px solid #ccc" borderRadius={4} maxWidth="600px" margin="auto">
            <Typography variant="h4" gutterBottom textAlign="center">
                Bilet na Wydarzenie
            </Typography>
            <Box marginTop={3} marginBottom={3}>
                <Typography variant="h6">Szczegóły wydarzenia:</Typography>
                <Typography><strong>Wydarzenie:</strong> {eventName}</Typography>
                <Typography><strong>Data rozpoczęcia:</strong> {dayjs(start_date).format("L")}</Typography>
                <Typography><strong>Data zakończenia:</strong> {dayjs(end_date).format("L")}</Typography>
                <Typography><strong>Lokalizacja:</strong> {locationName}</Typography>
                <Typography><strong>Podział miejsc:</strong> {is_seat_categorized ? "Tak" : "Nie"}</Typography>
                {is_seat_categorized && (
                    <Typography><strong>Numer Miejsca:</strong> {seatNumber}</Typography>
                )}
            </Box>
            <Box marginTop={3} marginBottom={3}>
                <Typography variant="h6">Szczegóły biletu:</Typography>
                <Typography><strong>Kategoria:</strong> {selectedCategory?.name || "Bilet niekategoryzowany"}</Typography>
                <Typography><strong>Cena za sztukę:</strong> {selectedCategory?.price || price} zł</Typography>
                <Typography><strong>Ilość:</strong> {quantity}</Typography>
                <Typography><strong>Łączna cena:</strong> {(selectedCategory?.price || price) * quantity} zł</Typography>
            </Box>
            <Box marginTop={5} textAlign="center">
                <Typography variant="body2" color="textSecondary">
                    Dziękujemy za zakup biletu. Życzymy miłego uczestnictwa w wydarzeniu!
                </Typography>
            </Box>
        </Box>
    );
};

export default ConfirmTicket;
