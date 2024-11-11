import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Radio, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllPaymentMethods, getPaymentsMethodsById } from '../../api-helpers/api-helpers';

const ConfirmBooking = () => {
    const location = useLocation();
    const { event, eventName, seatCategoryInfo, seatNumber, date, start_date, end_date, locationName } = location.state || {};
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [paymentMethodId, setPaymentMethodId] = useState('');
    const [paymentMethodName, setPaymentMethodName] = useState('');
    const { handleSubmit, control, setValue } = useForm();

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            const methods = await getAllPaymentMethods();
            setPaymentMethods(methods);
        };
        fetchPaymentMethods();
    }, []);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setValue("selectedCategory", category);
    };

    const handlePaymentMethodChange = async (methodId) => {
        setPaymentMethodId(methodId);
        const methodName = await getPaymentsMethodsById(methodId);
        setPaymentMethodName(methodName);
    };

    const onSubmit = (data) => {
        navigate('/confirm-ticket', {
            state: {
                selectedCategory,
                quantity: data.quantity || 1,
                event,
                eventName,
                seatNumber,
                date,
                start_date,
                end_date,
                locationName,
                paymentMethodName
            }
        });
    };

    return (
        <Box textAlign="center" padding={5}>
            <Typography variant="h5" gutterBottom>
                Wybierz kategorię miejsc:
            </Typography>
            {seatCategoryInfo.length > 0 ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    {seatCategoryInfo.map((category, index) => (
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
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="payment-method-label">Metoda płatności</InputLabel>
                        <Select
                            labelId="payment-method-label"
                            value={paymentMethodId}
                            onChange={(e) => handlePaymentMethodChange(e.target.value)}
                            label="Metoda płatności"
                        >
                            {paymentMethods.map((method) => (
                                <MenuItem key={method.idpayment_method} value={method.idpayment_method}>
                                    {method.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" sx={{ marginTop: 4, width: '50%' }}>
                        Zatwierdź
                    </Button>
                </form>
            ) : (
                <Typography>Brak dostępnych kategorii miejsc.</Typography>
            )}
        </Box>
    );
};

export default ConfirmBooking;
