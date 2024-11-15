import axios from 'axios';

export const getAllEvents = async () => {
    const res = await axios
    .get('api/events/read')
    .catch((err)=>console.log(err));

    if(!res || res.status !== 200){
         return console.log("No data");
    }
    const data = await res.data;
    return data;
};


export const searchEvents = async (query) => {
    try {
        const res = await axios.get('/api/events/search', {
            params: { name: query }
        });
        
        // Sprawdzamy, czy odpowiedź zakończyła się powodzeniem
        if (res.status === 200 && res.data.success) {
            return res.data.event; // Zwracamy znalezione wydarzenia
        } else {
            console.error("Search failed:", res.data.msg);
            return [];
        }
    } catch (error) {
        console.error("Error searching events:", error);
        return [];
    }
};
export const getEventDetails = async (id) => {
    try {
        const response = await axios.get(`/api/events/read/${id}`);  // Correct the URL path
        return response.data;
    } catch (error) {
        console.error("Error fetching event details:", error);
        throw error;
    }
};

export const generateTicketData = (ticketData) => {
    try {
        return JSON.stringify(ticketData, null, 2); // Zwraca obiekt sformatowany w JSON
    } catch (error) {
        console.error("Błąd podczas generowania JSON-a dla danych biletu:", error);
        return "{}"; // Zwraca pusty JSON w razie błędu
    }
};


// export const newBooking = async(data) => {
//   const res = await axios
//   .post('/booking', {
//     seatNumber: data.seatNumber,
//     date: data.date,
//     event: data.event,
//     user: localStorage.getItem("userId"),
//   })
//   .catch((err)=>console.log(err));

//   if(!res || res.status !== 200) {
//     return console.log("Unexpected Error");
//   }
//   const resData = await res.data;
//   return resData;
// }

export const ConfirmBooking = async (data) => {
    try {
        // Sprawdzenie kategorii miejsc i cen
        const seatCategoryInfo = await isSeatCategory(data.event);
        
        const res = await axios.post("/confirm", {
            seatNumber: data.seatNumber,
            date: data.date,
            event: data.event,
            user: localStorage.getItem("userId"),
            seatCategoryInfo, // Dodajemy seatCategoryInfo do zapytania
        });

        if (res.status !== 200) {
            throw new Error("Unexpected Error");
        }

        return res.data;
    } catch (err) {
        console.log("Error in ConfirmBooking:", err);
    }
};

export const seatCategories = (inputPrice) => [
    { name: `Pierwsza Kategoria `, price: inputPrice * 3.0 },
    { name: `Druga Kategoria `, price: inputPrice * 2.0 },
    { name: `Trzecia Kategoria `, price: inputPrice},
];


export const getPrice = async (eventId) => {
    try {
        const eventData = await getEventDetails(eventId);
        
        if (eventData && eventData.event) {
            const isCategorized = eventData.event.is_seat_categorized;
            const ticketRes = await axios.get(`/api/event_tickets/read/${eventId}`);
            
            if (ticketRes.status === 200 && ticketRes.data) {
                const basePrice = ticketRes.data.price; // Cena bazowa biletu

                if (isCategorized) {
                    // Jeśli jest podział miejsc, generujemy kategorie lokalnie na podstawie ceny bazowej
                    return seatCategories(basePrice); 
                } else {
                    // Jeśli brak podziału miejsc, zwróć cenę biletu niekategoryzowanego
                    return [{ name: "Bilet niekategoryzowany", price: basePrice }];
                }
            }
            return "Brak dostępnych biletów.";
        }
        return "Błąd: Nie można pobrać danych o wydarzeniu.";
    } catch (error) {
        console.error("Błąd podczas pobierania ceny biletu:", error);
        return "Błąd: Nieoczekiwany problem z połączeniem.";
    }
};


export const isSeatCategory = async (eventId) => {
    try {
        const eventData = await getEventDetails(eventId);
        
        if (eventData && eventData.event) {
            return eventData.event.is_seat_categorized;
        }
        return false;
    } catch (error) {
        console.error("Błąd podczas sprawdzania podziału miejsc:", error);
        return false;
    }
};

export const getSeatCategories = async (eventId) => {
    try {
        const eventData = await getEventDetails(eventId);
        
        if (eventData && eventData.event) {
            const isCategorized = eventData.event.is_seat_categorized;
            
            if (!isCategorized) {
                return [{ name: "Bilet niekategoryzowany", price: eventData.event.default_price }];
            }
            
            const ticketRes = await axios.get(`/api/event_tickets/read/${eventId}`);
            
            if (ticketRes.status === 200 && ticketRes.data && ticketRes.data.categories) {
                return ticketRes.data.categories.map((category) => ({
                    name: category.name,
                    price: category.price,
                }));
            } else {
                return "Brak dostępnych biletów.";
            }
        } else {
            console.error("Błąd: Nie można pobrać danych wydarzenia.");
            return [];
        }
    } catch (error) {
        console.error("Błąd podczas pobierania kategorii miejsc:", error);
        return [];
    }
};


export const getCategoryNameById = async (categoryId) => {
    try {
        const eventRes = await axios.get(`/api/categories/read/${categoryId}`);
        console.log("Category API response:", eventRes.data);
        
        if (eventRes.status === 200 && eventRes.data && eventRes.data.data) {
            return eventRes.data.data.category_type;  // Pobiera `category_type` z obiektu `data`
        } else {
            return "Brak kategorii";
        }
    } catch (error) {
        console.error("Error fetching category name:", error);
        return "Błąd: Nieoczekiwany problem z połączeniem.";
    }
};

export const getLocationById = async (locationId) => {
    try {
        const locationRes = await axios.get(`/api/locations/read/${locationId}`);
        
        if (locationRes.status === 200 && locationRes.data && locationRes.data.data) {
            const { location_name, city_name, country_name } = locationRes.data.data;
            console.log("Location API response:", locationRes.data);
            return `${location_name}, ${city_name}, ${country_name}`;  // Zwracamy pełną lokalizację
        } else {
            return "Brak lokalizacji";
        }
    } catch (error) {
        console.error("Error fetching location name:", error);
        return "Błąd: Nieoczekiwany problem z połączeniem.";
    }
};

export const getAllPaymentMethods = async () => {
    try {
        const response = await axios.get('/api/payment/read');
        console.log("Payment methods API response:", response.data);
        return response.data.data || [];  // Zwracamy `data` jako listę metod płatności
    } catch (error) {
        console.error("Error fetching payment methods:", error);
        return [];
    }
};

export const getPaymentsMethodsById = async (paymentMethodId) => {
    try {
        const paymentMethodRes = await axios.get(`/api/payment/read/${paymentMethodId}`);
        if (paymentMethodRes.status === 200 && paymentMethodRes.data && paymentMethodRes.data.data) {
            console.log("Payment method API response:", paymentMethodRes.data);
            return paymentMethodRes.data.data.name;  // Pobiera `payment_method` z obiektu `data`
        } else {
            return "Brak metody płatności";
        }
    } catch (error) {
        console.error("Error fetching payment method name:", error);
        return "Błąd: Nieoczekiwany problem z połączeniem.";
    }
}

export const getStatusById = async (statusId) => {
    try {
        const statusRes = await axios.get(`/api/status/read/${statusId}`);
        if (statusRes.status === 200 && statusRes.data && statusRes.data.data) {
            console.log("Status API response:", statusRes.data);
            return statusRes.data.data.name;  // Pobiera `name` z obiektu `data`
        } else {
            return "Brak statusu";
        }
    } catch (error) {
        console.error("Error fetching status name:", error);
        return "Błąd: Nieoczekiwany problem z połączeniem.";
    }
}

export const fetchEventCoordinates = async (locationName) => {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: locationName,       // Zapytanie (nazwa lub adres lokalizacji)
                format: 'json',        // Format odpowiedzi
                addressdetails: 1,     // Dodanie szczegółów adresu
                limit: 1               // Pobranie pierwszego wyniku
            }
        });

        // Sprawdź, czy odpowiedź zawiera dane o współrzędnych
        if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return {
                latitude: parseFloat(lat),
                longitude: parseFloat(lon)
            };
        } else {
            console.error("Nie znaleziono współrzędnych dla lokalizacji:", locationName);
            return null;
        }
    } catch (error) {
        console.error("Błąd podczas wczytywania współrzędnych lokalizacji:", error);
        return null;
    }
};

