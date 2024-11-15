import { Box,  Typography, TextField } from '@mui/material';

import Textarea from '@mui/joy/Textarea';
import Button from '@mui/joy/Button';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { getEventDetails, getCategoryNameById, getLocationById, isSeatCategory, getStatusById, getPrice, fetchEventCoordinates} from 'api-helpers/api-helpers';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
dayjs.locale('pl');
dayjs.extend(require("dayjs/plugin/localizedFormat"));
dayjs.extend(require("dayjs/plugin/relativeTime"));

// Ustawienie ikony jako domyślnej dla markerów
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Komponent do aktualizacji widoku mapy na nowe współrzędne
const MapCenterUpdater = ({ coordinates }) => {
    const map = useMap();
    useEffect(() => {
        if (coordinates) {
            map.setView([coordinates.latitude, coordinates.longitude], 13);
        }
    }, [coordinates, map]);
    return null;
};

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
    const [coordinates, setCoordinates] = useState(null);
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



                    if (fetchedLocationName) {
                        const coords = await fetchEventCoordinates(fetchedLocationName);
                        if (coords) {
                            setCoordinates(coords);
                        } else {
                            console.warn("Brak współrzędnych dla podanej lokalizacji.");
                        }
                    } else {
                        console.error("Nie ustawiono poprawnie `locationName` dla biletów niekategoryzowanych.");
                    }
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

    // return (
    //     <div>
    //         {event ? (
    //             <>
    //                 <Typography padding={3} fontFamily="fantasy" variant="h4" textAlign={"center"}>
    //                     {event.name}
    //                 </Typography>
    //                 <Box display="flex" justifyContent="center">
    //                     <Box display="flex" flexDirection="column" paddingTop={3} width="50%" marginRight="auto">
    //                         <img width="80%" height="300px" src={event.photo} alt={event.name} />
    //                         <Box width="80%" marginTop={3} padding={2}>
    //                             <Typography paddingTop={2}>{event.description}</Typography>
    //                             <Typography fontWeight="bold" marginTop={1}>
    //                                 Liczba dostępnych miejsc: {event.number_of_ticket}
    //                             </Typography>
    //                             <Typography fontWeight="bold" marginTop={1}>
    //                                 Data: {formatDate(event.start_date)} - {formatDate(event.end_date)}
    //                             </Typography>
    //                             <Typography fontWeight="bold" marginTop={1}>
    //                                 Godzina: {formatTime(event.start_date)} - {formatTime(event.end_date)}
    //                             </Typography>
    //                             <Typography fontWeight="bold" marginTop={1}>
    //                                 Czas trwania: {dayjs(event.end_date).from(dayjs(event.start_date), true)}
    //                             </Typography>
    //                             <Typography paddingTop={2}>
    //                                 Informacje kontaktowe: {event.contact_info}
    //                             </Typography>
    //                             <Typography paddingTop={2}>
    //                                 Podział miejsc: {event.is_seat_categorized ? "Tak" : "Nie"}
    //                             </Typography>
    //                             <Typography paddingTop={2}>
    //                                 Kategoria: {categoryName}
    //                             </Typography>
    //                             <Typography paddingTop={2}>
    //                                 Lokalizacja: {locationName}
    //                             </Typography>
    //                             <Typography paddingTop={2}>
    //                                 Status: {statusName}
    //                             </Typography>

    //                             <Box paddingTop={2}>
    //                                 <Typography fontWeight="bold">Seat Category Info:</Typography>
    //                                 {seatCategoryInfo.length > 0 ? (
    //                                     seatCategoryInfo.map((category, index) => (
    //                                         <Typography key={index}>
    //                                             {category.name} - Cena: {category.price} zł
    //                                         </Typography>
    //                                     ))
    //                                 ) : (
    //                                     <Typography>Brak dostępnych biletów.</Typography>
    //                                 )}
    //                             </Box>

    //                             <Box marginTop={4}>
    //                                 <Typography variant="h6" gutterBottom>Mapa lokalizacji wydarzenia:</Typography>
    //                                 {coordinates ? (
    //                                     <MapContainer center={[coordinates.latitude, coordinates.longitude]} zoom={13} style={{ height: "300px", width: "100%" }}>
    //                                         <TileLayer
    //                                             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //                                             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //                                         />
    //                                         <Marker position={[coordinates.latitude, coordinates.longitude]}>
    //                                             <Popup>
    //                                                 {event.name} - {locationName}
    //                                             </Popup>
    //                                         </Marker>
    //                                         <MapCenterUpdater coordinates={coordinates} />
    //                                     </MapContainer>
    //                                 ) : (
    //                                     <Typography>Ładowanie lokalizacji wydarzenia...</Typography>
    //                                 )}
    //                             </Box>

    //                             <form onSubmit={handleSubmit(onSubmit)}>
    //                                 <Box padding={5} margin="auto" display="flex" flexDirection="column">
    //                                     <Button type="submit" sx={{ mt: 3 }} variant="contained">
    //                                         Next (Confirm)
    //                                     </Button>
    //                                 </Box>
    //                             </form>
    //                         </Box>
    //                     </Box>
    //                 </Box>
    //             </>
    //         ) : (
    //             <Typography textAlign="center" padding={5}>
    //                 Loading event details...
    //             </Typography>
    //         )}
    //     </div>
    // );
    
    return (
        <Box padding={5} border="1px solid #ccc" borderRadius={4} maxWidth="800px" margin="auto">
            {event ? (
                <>
                    <Typography variant="h4" gutterBottom textAlign="center">
                    {event.name}
                    </Typography>
    
                    <Box marginTop={3} marginBottom={3} display="flex" justifyContent="center" alignItems="center">
                        <img
                            width="auto"
                            height="300px"
                            src={event.photo}
                            alt={event.name}
                            
                            style={{ borderRadius: '4px' }}
                        />
                    </Box>
    
                    <Box marginTop={3} marginBottom={3}>
                        <Typography variant="h6">Szczegóły wydarzenia:</Typography>
                        <Typography><strong>Wydarzenie:</strong> {event.name}</Typography>
                        <Typography><strong>Data rozpoczęcia:</strong> {formatDate(event.start_date)}</Typography>
                        <Typography><strong>Data zakończenia:</strong> {formatDate(event.end_date)}</Typography>
                        <Typography><strong>Godzina:</strong> {formatTime(event.start_date)} - {formatTime(event.end_date)}</Typography>
                        <Typography><strong>Czas trwania:</strong> {dayjs(event.end_date).from(dayjs(event.start_date), true)}</Typography>
                        <Typography><strong>Lokalizacja:</strong> {locationName}</Typography>
                        <Typography><strong>Informacje kontaktowe:</strong> {event.contact_info}</Typography>
                        <Typography><strong>Podział miejsc:</strong> {event.is_seat_categorized ? "Tak" : "Nie"}</Typography>
                    </Box>
    
                    <Box marginTop={3} marginBottom={3}>
                        <Typography variant="h6">Szczegóły biletu:</Typography>
                        <Typography><strong>Kategoria:</strong> {categoryName}</Typography>
                        <Typography><strong>Cena za sztukę:</strong> {seatCategoryInfo[0]?.price || "Brak ceny"} zł</Typography>
                        <Typography><strong>Ilość miejsc:</strong> {event.number_of_ticket}</Typography>
                        <Typography><strong>Status:</strong> {statusName}</Typography>
                    </Box>
    
                    <Box paddingTop={2} marginBottom={3}>
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
    
                    <Box textAlign="center" marginTop={3}>
                        <Box marginTop={4}>
                            <Typography variant="h6" gutterBottom>Mapa lokalizacji wydarzenia:</Typography>
                            {coordinates ? (
                                <MapContainer center={[coordinates.latitude, coordinates.longitude]} zoom={13} style={{ height: "300px", width: "100%" }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={[coordinates.latitude, coordinates.longitude]}>
                                        <Popup>
                                            {event.name} - {locationName}
                                        </Popup>
                                    </Marker>
                                    <MapCenterUpdater coordinates={coordinates} />
                                </MapContainer>
                            ) : (
                                <Typography>Ładowanie lokalizacji wydarzenia...</Typography>
                            )}
                        </Box>
                    </Box>         
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                        }}
                        >
                        <Textarea
                            placeholder="Napisz coś o wydarzeniu"
                            required
                            sx={{ mb: 1 }}
                            size="lg"
                            color="success"
                        />
                        <Button type="submit">Dodaj komentarz</Button>
                    </form>
                    <Box display="flex" justifyContent="center" marginTop={3}>
                        <Button endDecorator={<KeyboardArrowRight />} color="success" onClick={handleSubmit(onSubmit)}>
                            Next (Confirm)
                        </Button>
                    </Box>
                </>
            ) : (
                <Typography textAlign="center" padding={5}>
                    Loading event details...
                </Typography>
            )}
        </Box>
    );
    


};

export default Booking;
