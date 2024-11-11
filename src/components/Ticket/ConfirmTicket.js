import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import QRCode from 'qrcode.react';
import { QRCodeCanvas } from 'qrcode.react';

import dayjs from 'dayjs';
import html2pdf from 'html2pdf.js';
import { generateTicketData } from '../../api-helpers/api-helpers';

dayjs.locale('pl');
dayjs.extend(require("dayjs/plugin/localizedFormat"));

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
        seatNumber,
        paymentMethodName
    } = location.state || {};

    // Dynamiczne generowanie obiektu biletu
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
                    <Typography><strong>Łączna cena:</strong> {(selectedCategory?.price || price) * quantity} zł</Typography>
                    <Typography><strong>Metoda płatności:</strong> {paymentMethodName}</Typography>
                    <Typography><strong>Data zakupu:</strong> {dayjs().format("L LTS")}</Typography>
                </Box>
                <Box textAlign="center" marginTop={3}>
                    <QRCodeCanvas id="qrcode" value={qrCodeData} size={150} />

                </Box>
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
