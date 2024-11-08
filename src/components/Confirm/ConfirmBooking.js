import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, FormControlLabel, Radio } from '@mui/material';
import { getSeatCategories } from '../../api-helpers/api-helpers';

const ConfirmBooking = () => {
    const location = useLocation();
    const { event, seatNumber, date } = location.state || {};
    const navigate = useNavigate();
    const [seatCategories, setSeatCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const fetchSeatCategories = async () => {
            if (event) {
                const categories = await getSeatCategories(event); // Wywołanie funkcji getSeatCategories z eventId
                if (Array.isArray(categories)) {
                    setSeatCategories(categories); // Ustawienie pobranych kategorii w stanie
                } else {
                    console.error("Nie udało się pobrać kategorii miejsc.");
                }
            }
        };
        fetchSeatCategories();
    }, [event]);

    const handleCategorySelect = (category) => {
        setSelectedCategories((prevState) => {
            if (prevState.includes(category)) {
                return prevState.filter((item) => item !== category);
            } else {
                return [...prevState, category];
            }
        });
    };

    const handleConfirm = () => {
        navigate('/confirmation', {
            state: {
                selectedCategories,
                event,
                seatNumber,
                date
            }
        });
    };

    return (
        <Box textAlign="center" padding={5}>
            <Typography variant="h5" gutterBottom>
                Wybierz kategorię miejsc:
            </Typography>
            {Array.isArray(seatCategories) && seatCategories.length > 0 ? (
                seatCategories.map((category, index) => (
                    <FormControlLabel
                        key={index}
                        control={
                            <Radio
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategorySelect(category)}
                                name={category.name}
                                color="primary"
                            />
                        }
                        label={`${category.name}`}
                        sx={{
                            marginTop: 2,
                            width: '80%',
                            textAlign: "left"
                        }}
                    />
                ))
            ) : (
                <Typography>Brak dostępnych kategorii miejsc.</Typography>
            )}
            <Button
                variant="contained"
                onClick={handleConfirm}
                sx={{ marginTop: 4, width: '50%' }}
            >
                Zatwierdź
            </Button>
        </Box>
    );
};

export default ConfirmBooking;

