import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, FormControlLabel, Radio, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSeatCategories } from '../../api-helpers/api-helpers';

const ConfirmBooking = () => {
    const location = useLocation();
    const { event, eventName, seatNumber, date, start_date, end_date, locationName } = location.state || {};
    const navigate = useNavigate();
    const [seatCategories, setSeatCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { handleSubmit, control, setValue } = useForm();

    useEffect(() => {
        const fetchSeatCategories = async () => {
            if (event) {
                const categories = await getSeatCategories(event);
                if (Array.isArray(categories)) {
                    setSeatCategories(categories);
                } else {
                    console.error("Failed to fetch seat categories.");
                }
            }
        };
        fetchSeatCategories();
    }, [event]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setValue("selectedCategory", category);
    };

    const onSubmit = (data) => {
        navigate('/confirmation', {
            state: {
                selectedCategory,
                quantity: data.quantity || 1,  
                event,
                eventName,
                seatNumber,
                date,
                start_date,
                end_date,
                locationName: locationName 
            }
        });
    };

    const handleNonCategorizedBooking = (data) => {
        navigate('/confirmation', {
            state: {
                selectedCategory: { name: "Bilet niekategoryzowany", price: null }, // Cena ustawiona na null
                quantity: data.quantity,
                price: null, // Cena ustawiona na null lub dowolną domyślną wartość, jeśli jest wymagana
                event,
                eventName,
                seatNumber,
                date,
                start_date,
                end_date
            }
        });
    };

    return (
        <Box textAlign="center" padding={5}>
            <Typography variant="h5" gutterBottom>
                Wybierz kategorię miejsc:
            </Typography>
            {seatCategories.length > 0 ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    {seatCategories.map((category, index) => (
                        <Box key={index} display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
                            <Controller
                                name="selectedCategory"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={
                                            <Radio
                                                {...field}
                                                checked={selectedCategory === category}
                                                onChange={() => handleCategorySelect(category)}
                                                color="primary"
                                            />
                                        }
                                        label={`${category.name} - Cena: ${category.price} zł`}
                                    />
                                )}
                            />
                            {selectedCategory === category && (
                                <Controller
                                    name="quantity"
                                    control={control}
                                    defaultValue={1}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Ilość"
                                            type="number"
                                            inputProps={{ min: 1, max: 10 }}
                                            sx={{ width: '100px', marginTop: 2 }}
                                        />
                                    )}
                                />
                            )}
                        </Box>
                    ))}
                    <Button type="submit" variant="contained" sx={{ marginTop: 4, width: '50%' }}>
                        Zatwierdź
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleSubmit(handleNonCategorizedBooking)}>
                    <Typography>Brak dostępnych kategorii miejsc.</Typography>
                    <Controller
                        name="quantity"
                        control={control}
                        defaultValue={1}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Ilość"
                                type="number"
                                inputProps={{ min: 1, max: 10 }}
                                sx={{ width: '100px', marginTop: 2 }}
                            />
                        )}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        sx={{ marginTop: 4 }}
                    >
                        Zarezerwuj bilet niekategoryzowany
                    </Button>
                </form>
            )}
        </Box>
    );
};

export default ConfirmBooking;
