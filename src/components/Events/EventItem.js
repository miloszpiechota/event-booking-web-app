// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardActions, Typography, Button, CardMedia, CardActionArea, IconButton } from '@mui/material';
// import { Link } from 'react-router-dom';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// const EventItem = ({ id, name, startDate, endDate, description, numberOfTickets, posterUrl, contactInfo, isSeatCategorized, idstatus_type }) => {
//     // Sprawdź, czy wydarzenie jest zapisane jako ulubione
//     const [isFavorite, setIsFavorite] = useState(() => {
//         const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
//         return favorites.includes(id);
//     });
//     // Funkcja do przełączania stanu ulubionego wydarzenia
//     const toggleFavorite = () => {
//         setIsFavorite((prev) => {
//             const updatedFavoriteStatus = !prev;
//             const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            
//             // Dodaj lub usuń wydarzenie z listy ulubionych
//             const updatedFavorites = updatedFavoriteStatus
//                 ? [...favorites, id]
//                 : favorites.filter(eventId => eventId !== id);

//             // Zapisz aktualizację w lokalnym storage
//             localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

//             return updatedFavoriteStatus;
//         });
//     };
//     return (
//         <Card sx={{ height: 400 , minWidth: 275 , margin: 2, ":hover": { boxShadow: "10px 10px 20px #ccc" } }}>
//             <CardActionArea>
//                 <CardMedia sx={{ height: 140 }} image={posterUrl} />
//                 <CardContent>
//                     <Typography variant="h5">{name}</Typography>
//                     <Typography variant="body2" color="text.secondary">{description}</Typography>
//                 </CardContent>
//                 {/* Ikona ulubionego serduszka */}
//                 <IconButton
//                     onClick={toggleFavorite}
//                     sx={{
//                         position: 'absolute',
//                         top: 8,
//                         right: 8,
//                         color: isFavorite ? 'red' : 'grey',
//                     }}
//                 >
//                     <FavoriteIcon />
//                 </IconButton>
//             </CardActionArea>
//             <CardActions>
//                 <Button
//                     variant="contained"
//                     fullWidth
//                     component={Link}
//                     to={`/booking/${id}`} // Link do strony rezerwacji z id wydarzenia
//                     sx={{
//                         margin: "auto",
//                         bgcolor: "#2b2d42",
//                         ":hover": { bgcolor: "#121217" },
//                     }}
//                     size="medium"
//                 >
//                     Book
//                 </Button>
//             </CardActions>
//         </Card>
//     );
// };

// export default EventItem;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardActions, Typography, Button, CardMedia, IconButton, CardHeader } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dayjs from 'dayjs';
import { getEventDetails, getCategoryNameById, getLocationById, isSeatCategory, getStatusById, getPrice, fetchEventCoordinates} from 'api-helpers/api-helpers';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

dayjs.locale('pl');

// Ustawienie domyślnej ikony dla Leaflet
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const EventItem = ({ id, name, startDate, endDate, description, posterUrl, locationName, isSeatCategorized, numberOfTickets, contactInfo, idstatus_type }) => {
    const [isFavorite, setIsFavorite] = useState(() => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.includes(id);
    });
    const [event, setEvent] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [fetchedLocationName, setFetchedLocationName] = useState("Ładowanie lokalizacji...");
    const toggleFavorite = () => {
        setIsFavorite((prev) => {
            const updatedFavoriteStatus = !prev;
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            const updatedFavorites = updatedFavoriteStatus
                ? [...favorites, id]
                : favorites.filter(eventId => eventId !== id);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            return updatedFavoriteStatus;
        });
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ maxWidth: 345, margin: 2, ":hover": { boxShadow: "10px 10px 20px #ccc" } }}>
            <CardHeader
                subheader={`${dayjs(startDate).format("L")} - ${dayjs(endDate).format("L")}`}
                action={
                    <IconButton
                        onClick={toggleFavorite}
                        sx={{ color: isFavorite ? 'red' : 'grey' }}
                        aria-label="add to favorites"
                    >
                        <FavoriteIcon />
                    </IconButton>
                }
            />
            <CardMedia component="img" height="194" image={posterUrl} alt="Event image" />
            <CardContent>
                <Typography variant="h5" align="center">{name}</Typography>
                <Typography variant="body2" sx={{ textAlign: 'justify', color: 'text.secondary' }}>
                    {description}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    to={`/booking/${id}`}
                    sx={{ margin: "auto", bgcolor: "#2b2d42", ":hover": { bgcolor: "#121217" } }}
                    size="medium"
                >
                    Book
                </Button>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography variant="h6">Szczegóły wydarzenia:</Typography>
                    <Typography><strong>Data rozpoczęcia:</strong> {dayjs(startDate).format("L")}</Typography>
                    <Typography><strong>Data zakończenia:</strong> {dayjs(endDate).format("L")}</Typography>
                    <Typography><strong>Lokalizacja:</strong> {fetchedLocationName}</Typography>
                    <Typography><strong>Podział miejsc:</strong> {isSeatCategorized ? "Tak" : "Nie"}</Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default EventItem;


