import { Box, Typography, TextField, IconButton,  List,
    ListItem,
    ListItemText,
    ListItemAvatar, } from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import Button from "@mui/joy/Button";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Add from '@mui/icons-material/Add';
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from '@mui/icons-material/Person';
import FavoriteBorder from "@mui/icons-material/Favorite";
import {
  getEventDetails,
  getCategoryNameById,
  getLocationById,
  isSeatCategory,
  getStatusById,
  getPrice,
  fetchEventCoordinates,
  addComment, getCommentsByEvent,
} from "api-helpers/api-helpers";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
dayjs.locale("pl");
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
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
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
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isFavorite, setIsFavorite] = useState(() => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.includes(id);
  });

  const toggleFavorite = () => {
    setIsFavorite((prev) => {
      const updatedFavoriteStatus = !prev;
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const updatedFavorites = updatedFavoriteStatus
        ? [...favorites, id]
        : favorites.filter((eventId) => eventId !== id);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavoriteStatus;
    });
  };

  const { handleSubmit, control } = useForm({
    defaultValues: {
      seatNumber: "",
    },
  });
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const commentData = {
        comment: newComment,
        iduser: 5, // Upewnij się, że userId jest prawidłowy
        idevent: parseInt(id), // Id wydarzenia
        date_comment: new Date(),
    };

    const addedComment = await addComment(commentData);
    if (addedComment) {
        setComments((prev) => [...prev, addedComment]);
        setNewComment("");
    }
};
//DODALES 5 DO IDUSER I ZOBACZ CZY DZIALA

  useEffect(() => {
    const fetchComments = async () => {
        const fetchedComments = await getCommentsByEvent(parseInt(id));
        setComments(fetchedComments);
      };

    const fetchEvent = async () => {
      try {
        const data = await getEventDetails(id);
        if (data && data.event) {
          setEvent(data.event);

          const priceInfo = await getPrice(data.event.idevent);
          setSeatCategoryInfo(
            Array.isArray(priceInfo) ? priceInfo : [priceInfo]
          );

          const fetchedCategoryName = await getCategoryNameById(
            data.event.idevent_category
          );
          setCategoryName(fetchedCategoryName || "Brak kategorii");

          console.log("Fetched category name:", fetchedCategoryName);
          const fetchedLocationName = await getLocationById(
            data.event.idevent_location
          );

          setLocationName(fetchedLocationName || "Brak lokalizacji");
          console.log("Fetched location name:", fetchedLocationName);

          const fetchedStatusName = await getStatusById(
            data.event.idstatus_type
          );
          setStatusName(fetchedStatusName || "Brak statusu");

          if (fetchedLocationName) {
            const coords = await fetchEventCoordinates(fetchedLocationName);
            if (coords) {
              setCoordinates(coords);
            } else {
              console.warn("Brak współrzędnych dla podanej lokalizacji.");
            }
          } else {
            console.error(
              "Nie ustawiono poprawnie `locationName` dla biletów niekategoryzowanych."
            );
          }
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };
    fetchComments();
    fetchEvent();
  }, []);

  const onSubmit = (data) => {
    navigate("/confirm", {
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
        eventDescription: event.description,
      },
    });
  };

  return (
    <Box
      padding={5}
      border="1px solid #ccc"
      borderRadius={4}
      maxWidth="800px"
      margin="auto"
    >
      {event ? (
        <>
          <Typography variant="h4" gutterBottom textAlign="center">
            {event.name}
          </Typography>
          
          <IconButton
            onClick={toggleFavorite}
            sx={{ color: isFavorite ? "red" : "grey" }}
            aria-label="add to favorites"
          >
            <FavoriteIcon />
          </IconButton>

          <Box
            marginTop={3}
            marginBottom={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <img
              width="auto"
              height="300px"
              src={event.photo}
              alt={event.name}
              style={{ borderRadius: "4px" }}
            />
          </Box>
          <Box marginTop={3} marginBottom={3}>
          <Typography variant="h6">Opis wydarzenia:</Typography>
          <Typography>{event.description}</Typography>
          </Box>
          <Box marginTop={3} marginBottom={3}>
            <Typography variant="h6">Szczegóły wydarzenia:</Typography>
            <Typography>
              <strong>Wydarzenie:</strong> {event.name}
            </Typography>
            <Typography>
              <strong>Data rozpoczęcia:</strong> {formatDate(event.start_date)}
            </Typography>
            <Typography>
              <strong>Data zakończenia:</strong> {formatDate(event.end_date)}
            </Typography>
            <Typography>
              <strong>Godzina:</strong> {formatTime(event.start_date)} -{" "}
              {formatTime(event.end_date)}
            </Typography>
            <Typography>
              <strong>Czas trwania:</strong>{" "}
              {dayjs(event.end_date).from(dayjs(event.start_date), true)}
            </Typography>
            <Typography>
              <strong>Lokalizacja:</strong> {locationName}
            </Typography>
            <Typography>
              <strong>Informacje kontaktowe:</strong> {event.contact_info}
            </Typography>
            <Typography>
              <strong>Podział miejsc:</strong>{" "}
              {event.is_seat_categorized ? "Tak" : "Nie"}
            </Typography>
          </Box>

          <Box marginTop={3} marginBottom={3}>
            <Typography variant="h6">Szczegóły biletu:</Typography>
            <Typography>
              <strong>Kategoria:</strong> {categoryName}
            </Typography>
            <Typography>
              <strong>Cena za sztukę:</strong>{" "}
              {seatCategoryInfo[0]?.price || "Brak ceny"} zł
            </Typography>
            <Typography>
              <strong>Ilość miejsc:</strong> {event.number_of_ticket}
            </Typography>
            <Typography>
              <strong>Status:</strong> {statusName}
            </Typography>
          </Box>

          <Box paddingTop={2} marginBottom={3}>
            <Typography fontWeight="bold">Pule biletów:</Typography>
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
              <Typography variant="h6" gutterBottom>
                Mapa lokalizacji wydarzenia:
              </Typography>
              {coordinates ? (
                <MapContainer
                  center={[coordinates.latitude, coordinates.longitude]}
                  zoom={13}
                  style={{ height: "300px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[coordinates.latitude, coordinates.longitude]}
                  >
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
      {/* Wyświetlanie komentarzy */}
      <Box marginTop={5}>
        <Typography variant="h6">Komentarze:</Typography>
        <List>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <ListItem key={comment.idcomment}>
                <ListItemAvatar><PersonIcon /></ListItemAvatar>
                <ListItemText
                  primary={comment.comment}
                  secondary={new Date(comment.date_comment).toLocaleString()}
                />
              </ListItem>
            ))
          ) : (
            <Typography>Brak komentarzy.</Typography>
          )}
        </List>
      </Box>

      {/* Dodawanie komentarza */}
      <Box marginTop={3}>
        <TextField
          label="Dodaj komentarz"
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          multiline
        />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          onClick={handleAddComment}
                startDecorator={<Add />}
                sx={{ bgcolor: "#4A79D9" }}
        >
          Dodaj komentarz
        </Button>
        </Box>
      </Box>
          <Box display="flex" justifyContent="center" marginTop={3} >
            <Button
              endDecorator={<KeyboardArrowRight />}
              sx={{ bgcolor: "#4A79D9" }}
              onClick={handleSubmit(onSubmit)}
            >
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
