import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const Confirmation = () => {
    const location = useLocation();
    // const { seatCategoryInfo = [], event, seatNumber, date } = location.state || {};
    const { selectedCategories = [], event, seatNumber, date } = location.state || {};
    const handleCategorySelect = (category) => {
        console.log(`Wybrana kategoria: ${category}`);
    };

    return (
        <Box padding={5}>
            <Typography variant="h4" gutterBottom>
                Potwierdzenie Rezerwacji
            </Typography>
            <Typography variant="h6">Wybrane kategorie miejsc:</Typography>
            <Box display="flex" flexDirection="column" gap={2}>
                {selectedCategories.map((category, index) => (
                    <Box key={index} padding={2} border="1px solid gray" borderRadius={4}>
                        <Typography variant="body1" fontWeight="bold">{category.name}</Typography>
                        <Typography variant="body2">Cena: {category.price} zł</Typography>
                    </Box>
                ))}
            </Box>
            <Box marginTop={4}>
                <Typography>Event ID: {event}</Typography>
                <Typography>Numer Miejsca: {seatNumber}</Typography>
                <Typography>Data: {date}</Typography>
            </Box>
        </Box>
    );

    // return (
    //     <Box padding={5}>
    //         <Typography variant="h4" gutterBottom>
    //             Potwierdzenie Rezerwacji
    //         </Typography>
    //         <Typography variant="h6">Wybierz kategorię miejsc:</Typography>
    //         <Box display="flex" flexDirection="column" gap={2}>
    //             {seatCategoryInfo.map((category, index) => (
    //                 <Button
    //                     key={index}
    //                     variant="contained"
    //                     onClick={() => handleCategorySelect(category)}
    //                 >
    //                     {category}
    //                 </Button>
    //             ))}
    //         </Box>
    //         <Box marginTop={4}>
    //             <Typography>Event ID: {event}</Typography>
    //             <Typography>Numer Miejsca: {seatNumber}</Typography>
    //             <Typography>Data: {date}</Typography>
    //         </Box>
    //     </Box>
    // );
};

export default Confirmation;

