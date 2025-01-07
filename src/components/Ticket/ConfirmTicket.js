
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import dayjs from 'dayjs';
import html2pdf from 'html2pdf.js/dist/html2pdf.min.js';

// import html2pdf from 'html2pdf.js';
import { generateTicketData, fetchEventCoordinates, printPrice } from '../../api-helpers/api-helpers';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

dayjs.locale('pl');
dayjs.extend(require("dayjs/plugin/localizedFormat"));

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

const ConfirmTicket =  () => {
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
        seatNumber,
        paymentMethodName,
    } = location.state || {};

    const [coordinates, setCoordinates] = useState(null); // Ustawienie jako null na start
    const [ticketPrices, setTicketPrices] = useState(null);
    const popupRef = useRef(null); // Referencja do Popup

    useEffect(() => {
        const loadCoordinates = async () => {
            if (locationName) {
                try {
                    const coords = await fetchEventCoordinates(locationName);
                    if (coords) {
                        setCoordinates(coords);
                    } else {
                        console.error("Brak współrzędnych dla podanej lokalizacji.");
                    }
                } catch (error) {
                    console.error("Błąd podczas pobierania współrzędnych:", error);
                }
            }
        };
        const loadPrices = async () => {
            if (selectedCategory?.price || price) {
                const result = await printPrice(selectedCategory?.price || price);
                setTicketPrices(result);
            }
        };
        loadPrices();
        loadCoordinates();
    }, [locationName, selectedCategory?.price, price]);

    useEffect(() => {
        if (popupRef.current) {
            popupRef.current.openPopup(); // Otwórz Popup automatycznie po załadowaniu
        }
    }, [coordinates]);

    const ticketData = {
        eventName,
        startDate: start_date,
        endDate: end_date,
        location: locationName,
        category: selectedCategory?.name || "Bilet niekategoryzowany",
        pricePerTicket: selectedCategory?.price || price,
        quantity,
        totalPrice: (selectedCategory?.price || price) * quantity,
        paymentMethod: paymentMethodName,
        seatNumber: seatNumber || "Nie dotyczy",
        purchaseDate: dayjs().format("L LTS")
    };

    const qrCodeData = generateTicketData(ticketData); // Generowanie JSON-a dla kodu QR

    const handleDownloadPDF = () => {
        const element = document.getElementById("ticket");
        html2pdf().from(element).save(`${eventName}_Ticket.pdf`);
    };

    const handleDownloadQR = () => {
        const canvas = document.getElementById("qrcode");
        if (!canvas) {
            console.error("QR Code element not found");
            alert("QR Code is not available for download.");
            return;
        }
        if (canvas instanceof HTMLCanvasElement) {
            const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `${eventName}_QRCode.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };
    
    return (
        <Box padding={5} border="1px solid #ccc" borderRadius={4} maxWidth="600px" margin="auto">
            <Box id="ticket">
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
                    {ticketPrices && (
                            <>
                                <Typography><strong>Cena opłaty serwisowej:</strong> {ticketPrices.servicePrice * quantity} zł</Typography>
                                <Typography><strong>Łączna cena z opłatą serwisową:</strong> {ticketPrices.withServicePrice * quantity} zł</Typography>
                            </>
                        )}
                    <Typography><strong>Metoda płatności:</strong> {paymentMethodName}</Typography>
                    <Typography><strong>Data zakupu:</strong> {dayjs().format("L LTS")}</Typography>
                </Box>
                <Box textAlign="center" marginTop={3}>
                    <QRCodeCanvas id="qrcode" value={qrCodeData} size={150} />
                </Box>
                </Box>
                <Box marginTop={4}>
                <Typography variant="h6" gutterBottom>Mapa lokalizacji wydarzenia:</Typography>
                {coordinates ? (
                    <MapContainer center={[coordinates.latitude, coordinates.longitude]} zoom={13} style={{ height: "300px", width: "100%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[coordinates.latitude, coordinates.longitude]}>
                            <Popup ref={popupRef}>
                                {eventName} - {locationName}
                            </Popup>
                        </Marker>
                        <MapCenterUpdater coordinates={coordinates} />
                    </MapContainer>
                ) : (
                    <Typography>Ładowanie lokalizacji wydarzenia...</Typography>
                )}
            
            </Box>
            <Box display="flex" justifyContent="center" gap={2} marginTop={4}>
                <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
                    Pobierz PDF
                </Button>
                <Button variant="contained" color="secondary" onClick={handleDownloadQR}>
                    Pobierz Kod QR
                </Button>
            </Box>
        </Box>
    );
};

export default ConfirmTicket;
