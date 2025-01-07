import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import { printPrice } from "../../api-helpers/api-helpers";
dayjs.locale("pl");
dayjs.extend(require("dayjs/plugin/localizedFormat"));
dayjs.extend(require("dayjs/plugin/relativeTime"));

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    selectedCategory,
    quantity,
    eventName,
    seatNumber,
    start_date,
    end_date,
    price,
    locationName,
    is_seat_categorized,
    paymentMethodName,

  } = location.state || {};

  const [ticketPrices, setTicketPrices] = useState(null);

  useEffect(() => {
    const loadPrices = async () => {
      if (selectedCategory?.price || price) {
        const result = await printPrice(selectedCategory?.price || price);
        setTicketPrices(result);
      }
    };
    loadPrices();
  }, [selectedCategory?.price, price]);

  const handleBuyTicket = () => {
    navigate("/confirm-ticket", {
      state: {
        selectedCategory,
        quantity,
        eventName,
        seatNumber,
        start_date,
        end_date,
        price,
        locationName,
        is_seat_categorized,
        paymentMethodName,

      },
    });
    };
    const handleCancel = () => {
        navigate('/'); // Przekierowanie na stronę główną
    };

  return (
    <Box
      padding={5}
      border="1px solid #ccc"
      borderRadius={4}
      maxWidth="600px"
      margin="auto"
    >
      <Typography variant="h4" gutterBottom>
        Potwierdzenie Rezerwacji
      </Typography>
      <Typography variant="h6">Wybrana kategoria miejsca:</Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {selectedCategory ? (
          <Box padding={2} border="1px solid gray" borderRadius={4}>
            <Typography variant="body1" fontWeight="bold">
              {selectedCategory.name}
            </Typography>
            {selectedCategory.price !== null ? (
              <>
                <Typography variant="body2">
                  Cena za sztukę: {selectedCategory.price} zł
                </Typography>
                <Typography variant="body2">Ilość: {quantity}</Typography>
                {ticketPrices && (
                  <>
                    <Typography>
                      <strong>Cena opłaty serwisowej:</strong>{" "}
                      {ticketPrices.servicePrice} zł
                    </Typography>
                    <Typography>
                      <strong>Łączna cena z opłatą serwisową:</strong>{" "}
                      {ticketPrices.basePrice * quantity + ticketPrices.servicePrice} zł
                    </Typography>
                  </>
                )}
              </>
            ) : (
              <>
                <Typography variant="body2">Ilość: {quantity}</Typography>
                {ticketPrices && (
                  <>
                    <Typography>
                      <strong>Cena opłaty serwisowej:</strong>{" "}
                      {ticketPrices.servicePrice} zł
                    </Typography>
                    <Typography>
                      <strong>Łączna cena z opłatą serwisową:</strong>{" "}
                      {ticketPrices.basePrice * quantity + ticketPrices.servicePrice} zł
                    </Typography>
                  </>
                )}
              </>
            )}
          </Box>
        ) : (
          <Typography>Brak wybranej kategorii.</Typography>
        )}
      </Box>
      <Box marginTop={4}>
        <Typography variant="h6">Szczegóły zamówienia:</Typography>
        <Typography>Wydarzenie: {eventName}</Typography>
        <Typography>
          Data rozpoczęcia: {dayjs(start_date).format("L")}
        </Typography>
        <Typography>Data zakończenia: {dayjs(end_date).format("L")}</Typography>
        <Typography>Lokalizacja: {locationName}</Typography>
        <Typography>
          Podział miejsc: {is_seat_categorized ? "Tak" : "Nie"}
        </Typography>
        {is_seat_categorized && (
          <Typography>Numer Miejsca: {seatNumber}</Typography>
        )}
      </Box>
      {/* Przyciski akcji */}
      <Box marginTop={5} display="flex" justifyContent="center" gap={2}>
                <Button variant="contained" color="primary" onClick={handleBuyTicket}>
                    Kup bilet
                </Button>
                <Button variant="contained" color="error" onClick={handleCancel}>
                    Zrezygnuj
                </Button>
            </Box>
    </Box>
  );
};

export default Confirmation;
