// import React, { useState, useEffect } from 'react';
// import { Box, TextField, Button, Typography, MenuItem, Autocomplete, Checkbox, FormControlLabel } from '@mui/material';
// import {
//     validateEventName,
//     validateDate,
//     validateTickets,
//     validateDescription,
//     validateLocationName,
//     validateContactInfo,
//     validatePhotoUrl,
// } from 'validate/validateEventForm.js'; // Import walidacji
// import {
//     getAllCategories,
//     getAllCities,
//     getAllStatuses,
//     getSuggestedLocations,
//     createEvent,
//     createEventLocation,
// } from 'api-helpers/api-helpers.js';

// const EventForm = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         start_date: '',
//         end_date: '',
//         description: '',
//         number_of_ticket: '',
//         photo: '',
//         contact_info: '',
//         idevent_category: '',
//         idevent_location: '',
//         idstatus_type: '',
//         is_seat_categorized: false,
//         custom_location_name: '',
//         city_id: '',
//     });

//     const [errors, setErrors] = useState({
//         name: '',
//         start_date: '',
//         end_date: '',
//         description: '',
//         number_of_ticket: '',
//         idevent_category: '',
//         idevent_location: '',
//         idstatus_type: '',
//         custom_location_name: '',
//         city_id: '',
//         photo: '',
//         contact_info: '',
//         is_seat_categorized: false,
//     });

//     const [categories, setCategories] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [statuses, setStatuses] = useState([]);
//     const [suggestedLocations, setSuggestedLocations] = useState([]);
//     const [selectedSuggestion, setSelectedSuggestion] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const categoriesData = await getAllCategories();
//                 const citiesData = await getAllCities();
//                 const statusesData = await getAllStatuses();

//                 setCategories(Array.isArray(categoriesData) ? categoriesData : []);
//                 setCities(Array.isArray(citiesData) ? citiesData : []);
//                 setStatuses(Array.isArray(statusesData) ? statusesData : []);
//             } catch (error) {
//                 console.error('Błąd podczas pobierania danych:', error);
//                 setCategories([]);
//                 setCities([]);
//                 setStatuses([]);
//             }
//         };
//         fetchData();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleCityChange = (e) => {
//         const cityId = e.target.value;
//         setFormData((prev) => ({
//             ...prev,
//             city_id: cityId,
//             custom_location_name: '',
//             idevent_location: '',
//         }));
//         setSuggestedLocations([]);
//     };

//     const handleLocationInput = async (inputValue) => {
//         if (!inputValue.trim() || !formData.city_id) return;
//         const city = cities.find((c) => c.idcity === formData.city_id)?.city;
//         if (!city) return;

//         const suggestions = await getSuggestedLocations(inputValue, city);
//         setSuggestedLocations(suggestions || []);
//     };

//     const extractObjectName = (displayName) => {
//         if (!displayName) return "";
//         const parts = displayName.split(","); // Dzielimy tekst po przecinku
//         return parts[0].trim(); // Zwracamy pierwszą część, usuwając zbędne spacje
//     };
    
//     const handleLocationSelect = (newValue) => {
//         if (newValue) {
//             const objectName = extractObjectName(newValue.display_name);
//             setFormData((prev) => ({
//                 ...prev,
//                 custom_location_name: objectName, // Przekazujemy tylko nazwę obiektu
//             }));
//         } else {
//             setFormData((prev) => ({
//                 ...prev,
//                 custom_location_name: "",
//             }));
//         }
//     };
    

//     const handleCheckboxChange = () => {
//         setFormData((prev) => ({
//             ...prev,
//             is_seat_categorized: !prev.is_seat_categorized,
//             idevent_category: '',
//         }));
//     }

//     const handleValidation = () => {
//         const validationErrors = {
//             name: validateEventName(formData.name),
//             start_date: validateDate(formData.start_date, 'start_date'),
//             end_date: validateDate(formData.end_date, 'end_date', formData.start_date),
//             number_of_ticket: validateTickets(formData.number_of_ticket),
//             description: validateDescription(formData.description),
//             custom_location_name: validateLocationName(formData.custom_location_name),
//             contact_info: validateContactInfo(formData.contact_info),
//             photo: validatePhotoUrl(formData.photo),
//             idevent_category: '',
//             idevent_location: '',
//             idstatus_type: '',
//             city_id: '',
//             is_seat_categorized: false,
//         };

//         setErrors(validationErrors);
//         return !Object.values(validationErrors).some((error) => error); // Zwraca `true`, jeśli brak błędów
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log('Form submitted:', formData);
//         if (!handleValidation()) return;

//         try {
//             let locationId = formData.idevent_location;

//             // Dodawanie nowej lokalizacji, jeśli użytkownik wpisał nową nazwę
//             if (formData.custom_location_name && !formData.idevent_location) {
//                 const newLocation = await createEventLocation({
//                     name: formData.custom_location_name,
//                     city_id: formData.city_id,
//                 });
//                 locationId = newLocation?.idevent_location;
//             }

//             const eventData = {
//                 ...formData,
//                 idevent_location: locationId,
//             };
//             console.log('Sending data to backend...');
//             const response = await createEvent(eventData);
//             if (response.success) {
//                 alert('Wydarzenie zostało pomyślnie dodane!');
//                 setFormData({
//                     name: '',
//                     start_date: '',
//                     end_date: '',
//                     description: '',
//                     number_of_ticket: '',
//                     photo: '',
//                     contact_info: '',
//                     idevent_category: '',
//                     idevent_location: '',
//                     idstatus_type: '',
//                     is_seat_categorized: false,
//                     custom_location_name: '',
//                     city_id: '',
//                 });
//                 setErrors({
//                     name: '',
//                     start_date: '',
//                     end_date: '',
//                     description: '',
//                     number_of_ticket: '',
//                     photo: '',
//                     contact_info: '',
//                     idevent_category: '',
//                     idevent_location: '',
//                     idstatus_type: '',
//                     is_seat_categorized: false,
//                     custom_location_name: '',
//                     city_id: '',
//                 });
//             } else {
//                 alert('Błąd przy dodawaniu wydarzenia.');
//             }
//         } catch (error) {
//             console.error('Błąd przy wysyłaniu formularza:', error);
//         }
//     };
//     const handleButtonClick = () => {
//         console.log('Button clicked! FormData:', formData);
//         handleSubmit(new Event('submit')); // Testowe wywołanie handleSubmit
//     };

//     return (
//         <Box padding={5} maxWidth="800px" margin="auto">
//             <Typography variant="h4" gutterBottom>
//                 Dodaj Wydarzenie
//             </Typography>
//             <form onSubmit={handleSubmit}>
//                 <TextField
//                     fullWidth
//                     label="Nazwa Wydarzenia"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     error={!!errors.name}
//                     helperText={errors.name}
//                     margin="normal"
//                 />
//                 <TextField
//                     fullWidth
//                     label="Data Rozpoczęcia"
//                     name="start_date"
//                     type="datetime-local"
//                     value={formData.start_date}
//                     onChange={handleChange}
//                     error={!!errors.start_date}
//                     helperText={errors.start_date}
//                     margin="normal"
//                     InputLabelProps={{
//                         shrink: true,
//                     }}
//                 />
//                 <TextField
//                     fullWidth
//                     label="Data Zakończenia"
//                     name="end_date"
//                     type="datetime-local"
//                     value={formData.end_date}
//                     onChange={handleChange}
//                     error={!!errors.end_date}
//                     helperText={errors.end_date}
//                     margin="normal"
//                     InputLabelProps={{
//                         shrink: true,
//                     }}
//                 />
//                 <TextField
//                     fullWidth
//                     label="Liczba Biletów"
//                     name="number_of_ticket"
//                     type="number"
//                     value={formData.number_of_ticket}
//                     onChange={handleChange}
//                     error={!!errors.number_of_ticket}
//                     helperText={errors.number_of_ticket}
//                     margin="normal"
//                 />
//                 <TextField
//                     fullWidth
//                     label="URL Zdjęcia"
//                     name="photo"
//                     value={formData.photo}
//                     onChange={handleChange}
//                     error={!!errors.photo}
//                     helperText={errors.photo}
//                     margin="normal"
//                 />
//                 <TextField
//                     fullWidth
//                     label="Informacje Kontaktowe"
//                     name="contact_info"
//                     value={formData.contact_info}
//                     onChange={handleChange}
//                     error={!!errors.contact_info}
//                     helperText={errors.contact_info}
//                     margin="normal"
//                 />
//                 <TextField
//                     fullWidth
//                     label="Miasto"
//                     name="city_id"
//                     select
//                     value={formData.city_id}
//                     onChange={handleCityChange}
//                     margin="normal"
//                 >
//                     {cities.map((city) => (
//                         <MenuItem key={city.idcity} value={city.idcity}>
//                             {city.city}
//                         </MenuItem>
//                     ))}
//                 </TextField>
//                 <Autocomplete
//                     freeSolo
//                     options={suggestedLocations}
//                     getOptionLabel={(option) => option.display_name || ''}
//                     onInputChange={(event, newValue) => handleLocationInput(newValue)}
//                     onChange={(event, newValue) => handleLocationSelect(newValue)}
//                     renderInput={(params) => (
//                         <TextField
//                             {...params}
//                             label="Lokalizacja"
//                             margin="normal"
//                             error={!!errors.custom_location_name}
//                             helperText={errors.custom_location_name}
//                         />
//                     )}
//                 />
//                 <TextField
//                     fullWidth
//                     label="Opis"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     error={!!errors.description}
//                     helperText={errors.description}
//                     multiline
//                     rows={4}
//                     margin="normal"
//                 />
//                 <FormControlLabel
//                     // control={
//                     //     <Checkbox
//                     //         checked={formData.is_seat_categorized}
//                     //         onChange={handleCheckboxChange}
//                     //     />
//                     // }
//                     control={
//                         <Checkbox
//                             checked={formData.is_seat_categorized}
//                             onChange={(e) =>
//                                 setFormData((prev) => ({
//                                     ...prev,
//                                     is_seat_categorized: e.target.checked,
//                                 }))
//                             }
//                         />
//                     }
//                     label="Czy miejsca są kategoryzowane?"
//                 />
//                 {formData.is_seat_categorized && (
//                     <TextField
//                         fullWidth
//                         label="Kategoria"
//                         name="idevent_category"
//                         select
//                         value={formData.idevent_category}
//                         onChange={handleChange}
//                         margin="normal"
//                     >
//                         {categories.map((category) => (
//                             <MenuItem key={category.idevent_category} value={category.idevent_category}>
//                                 {category.category_type}
//                             </MenuItem>
//                         ))}
//                     </TextField>
//                 )}
//                 <TextField
//                     fullWidth
//                     label="Status"
//                     name="idstatus_type"
//                     select
//                     value={formData.idstatus_type}
//                     onChange={handleChange}
//                     margin="normal"
//                 >
//                     {statuses.map((status) => (
//                         <MenuItem key={status.idstatus_type} value={status.idstatus_type}>
//                             {status.name}
//                         </MenuItem>
//                     ))}
//                 </TextField>
//                 <Button type="submit" variant="contained" onClick={handleButtonClick} color="primary" fullWidth>
//                     Dodaj Wydarzenie
//                 </Button>
//             </form>
//         </Box>
//     );
// };

// export default EventForm;

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem, Autocomplete, Checkbox, FormControlLabel } from '@mui/material';
import {
    validateEventName,
    validateDate,
    validateTickets,
    validateDescription,
    validateLocationName,
    validateContactInfo,
    validatePhotoUrl,
} from 'validate/validateEventForm.js'; // Import walidacji
import {
    getAllCategories,
    getAllCities,
    getAllStatuses,
    getSuggestedLocations,
    createEvent,
    createEventLocation,
} from 'api-helpers/api-helpers.js';

const EventForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        start_date: '',
        end_date: '',
        description: '',
        number_of_ticket: '',
        photo: '',
        contact_info: '',
        idevent_category: '',
        idevent_location: '',
        idstatus_type: '',
        is_seat_categorized: false,
        custom_location_name: '',
        city_id: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        start_date: '',
        end_date: '',
        description: '',
        number_of_ticket: '',
        idevent_category: '',
        idevent_location: '',
        idstatus_type: '',
        custom_location_name: '',
        city_id: '',
        photo: '',
        contact_info: '',
        is_seat_categorized: false,
    });

    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [suggestedLocations, setSuggestedLocations] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesData = await getAllCategories();
                const citiesData = await getAllCities();
                const statusesData = await getAllStatuses();

                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
                setCities(Array.isArray(citiesData) ? citiesData : []);
                setStatuses(Array.isArray(statusesData) ? statusesData : []);
            } catch (error) {
                console.error('Błąd podczas pobierania danych:', error);
                setCategories([]);
                setCities([]);
                setStatuses([]);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setFormData((prev) => ({
            ...prev,
            city_id: cityId,
            custom_location_name: '',
            idevent_location: '',
        }));
        setSuggestedLocations([]);
    };

    const handleLocationInput = async (inputValue) => {
        if (!inputValue.trim() || !formData.city_id) return;
        const city = cities.find((c) => c.idcity === formData.city_id)?.city;
        if (!city) return;

        const suggestions = await getSuggestedLocations(inputValue, city);
        setSuggestedLocations(suggestions || []);
    };

    const extractObjectName = (displayName) => {
        if (!displayName) return "";
        const parts = displayName.split(","); // Dzielimy tekst po przecinku
        return parts[0].trim(); // Zwracamy pierwszą część, usuwając zbędne spacje
    };
    
    const handleLocationSelect = (newValue) => {
        if (newValue) {
            const objectName = extractObjectName(newValue.display_name);
            setFormData((prev) => ({
                ...prev,
                custom_location_name: objectName, // Przekazujemy tylko nazwę obiektu
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                custom_location_name: "",
            }));
        }
    };
    

    const handleCheckboxChange = () => {
        setFormData((prev) => ({
            ...prev,
            is_seat_categorized: !prev.is_seat_categorized,
            idevent_category: '',
        }));
    }

    const handleValidation = () => {
        const validationErrors = {
            name: validateEventName(formData.name),
            start_date: validateDate(formData.start_date, 'start_date'),
            end_date: validateDate(formData.end_date, 'end_date', formData.start_date),
            number_of_ticket: validateTickets(formData.number_of_ticket),
            description: validateDescription(formData.description),
            custom_location_name: validateLocationName(formData.custom_location_name),
            contact_info: validateContactInfo(formData.contact_info),
            photo: validatePhotoUrl(formData.photo),
            idevent_category: '',
            idevent_location: '',
            idstatus_type: '',
            city_id: '',
            is_seat_categorized: false,
        };

        setErrors(validationErrors);
        return !Object.values(validationErrors).some((error) => error); // Zwraca `true`, jeśli brak błędów
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        if (!handleValidation()) return;

        try {
            let locationId = formData.idevent_location;

            // Dodawanie nowej lokalizacji, jeśli użytkownik wpisał nową nazwę
            if (formData.custom_location_name && !formData.idevent_location) {
                const newLocation = await createEventLocation({
                    name: formData.custom_location_name,
                    city_id: formData.city_id,
                });
                locationId = newLocation?.idevent_location;
            }

            const eventData = {
                ...formData,
                idevent_location: locationId,
            };
            console.log('Sending data to backend...');
            const response = await createEvent(eventData);
            if (response.success) {
                alert('Wydarzenie zostało pomyślnie dodane!');
                setFormData({
                    name: '',
                    start_date: '',
                    end_date: '',
                    description: '',
                    number_of_ticket: '',
                    photo: '',
                    contact_info: '',
                    idevent_category: '',
                    idevent_location: '',
                    idstatus_type: '',
                    is_seat_categorized: false,
                    custom_location_name: '',
                    city_id: '',
                });
                setErrors({
                    name: '',
                    start_date: '',
                    end_date: '',
                    description: '',
                    number_of_ticket: '',
                    photo: '',
                    contact_info: '',
                    idevent_category: '',
                    idevent_location: '',
                    idstatus_type: '',
                    is_seat_categorized: false,
                    custom_location_name: '',
                    city_id: '',
                });
            } else {
                alert('Błąd przy dodawaniu wydarzenia.');
            }
        } catch (error) {
            console.error('Błąd przy wysyłaniu formularza:', error);
        }
    };
    const handleButtonClick = () => {
        console.log('Button clicked! FormData:', formData);
        handleSubmit(new Event('submit')); // Testowe wywołanie handleSubmit
    };

    return (
        <Box padding={5} maxWidth="800px" margin="auto">
            <Typography variant="h4" gutterBottom>
                Dodaj Wydarzenie
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Nazwa Wydarzenia"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Data Rozpoczęcia"
                    name="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={handleChange}
                    error={!!errors.start_date}
                    helperText={errors.start_date}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    fullWidth
                    label="Data Zakończenia"
                    name="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={handleChange}
                    error={!!errors.end_date}
                    helperText={errors.end_date}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    fullWidth
                    label="Liczba Biletów"
                    name="number_of_ticket"
                    type="number"
                    value={formData.number_of_ticket}
                    onChange={handleChange}
                    error={!!errors.number_of_ticket}
                    helperText={errors.number_of_ticket}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="URL Zdjęcia"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                    error={!!errors.photo}
                    helperText={errors.photo}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Informacje Kontaktowe"
                    name="contact_info"
                    value={formData.contact_info}
                    onChange={handleChange}
                    error={!!errors.contact_info}
                    helperText={errors.contact_info}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Miasto"
                    name="city_id"
                    select
                    value={formData.city_id}
                    onChange={handleCityChange}
                    margin="normal"
                >
                    {cities.map((city) => (
                        <MenuItem key={city.idcity} value={city.idcity}>
                            {city.city}
                        </MenuItem>
                    ))}
                </TextField>
                <Autocomplete
                    freeSolo
                    options={suggestedLocations}
                    getOptionLabel={(option) => option.display_name || ''}
                    onInputChange={(event, newValue) => handleLocationInput(newValue)}
                    onChange={(event, newValue) => handleLocationSelect(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Lokalizacja"
                            margin="normal"
                            error={!!errors.custom_location_name}
                            helperText={errors.custom_location_name}
                        />
                    )}
                />
                <TextField
                    fullWidth
                    label="Opis"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    error={!!errors.description}
                    helperText={errors.description}
                    multiline
                    rows={4}
                    margin="normal"
                />
                <FormControlLabel
                    // control={
                    //     <Checkbox
                    //         checked={formData.is_seat_categorized}
                    //         onChange={handleCheckboxChange}
                    //     />
                    // }
                    control={
                        <Checkbox
                            checked={formData.is_seat_categorized}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    is_seat_categorized: e.target.checked,
                                }))
                            }
                        />
                    }
                    label="Czy miejsca są kategoryzowane?"
                />
                {formData.is_seat_categorized && (
                    <TextField
                        fullWidth
                        label="Kategoria"
                        name="idevent_category"
                        select
                        value={formData.idevent_category}
                        onChange={handleChange}
                        margin="normal"
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.idevent_category} value={category.idevent_category}>
                                {category.category_type}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
                <TextField
                    fullWidth
                    label="Status"
                    name="idstatus_type"
                    select
                    value={formData.idstatus_type}
                    onChange={handleChange}
                    margin="normal"
                >
                    {statuses.map((status) => (
                        <MenuItem key={status.idstatus_type} value={status.idstatus_type}>
                            {status.name}
                        </MenuItem>
                    ))}
                </TextField>
                <Button type="submit" variant="contained" onClick={handleButtonClick} color="primary" fullWidth>
                    Dodaj Wydarzenie
                </Button>
            </form>
        </Box>
    );
};

export default EventForm;

