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

export const getEventDetails = async (id) => {
    try {
        const response = await axios.get(`/api/events/read/${id}`);  // Correct the URL path
        return response.data;
    } catch (error) {
        console.error("Error fetching event details:", error);
        throw error;
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

export const isSeatCategory = async (eventId) => {
    try {
        // Pobranie is_seat_categorized z tabeli events
        const eventRes = await axios.get(`/api/events/read/${eventId}`);
        
        if (eventRes.status === 200 && eventRes.data) {
            const is_seat_categorized = eventRes.data.event.is_seat_categorized;
            
            if (is_seat_categorized === false) {
                return "Brak podziału miejsc.";
            } else if (is_seat_categorized === true) {
                // Jeśli podział miejsc jest włączony, pobierz cenę z event_tickets
                const ticketRes = await axios.get(`/api/event_tickets/read/${eventId}`);
                
                if (ticketRes.status === 200 && ticketRes.data) {
                    const { price } = ticketRes.data;
                    
                    if (price) {
                        // Zwraca pełną listę kategorii, zawierającą nazwę i cenę
                        return seatCategories(price);
                    } else {
                        return "Brak dostępnych biletów.";
                    }
                } else {
                    return "Błąd: Nie można pobrać danych o biletach.";
                }
            } else {
                return "Nieprawidłowa wartość podziału miejsc.";
            }
        } else {
            return "Błąd: Nie można pobrać danych o wydarzeniu.";
        }
    } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
        return "Błąd: Nieoczekiwany problem z połączeniem.";
    }
};

export const getSeatCategories = async (eventId) => {
    try {
        // Krok 1: Pobierz is_seat_categorized z tabeli events
        const eventRes = await axios.get(`/api/events/read/${eventId}`);
        
        if (eventRes.status === 200 && eventRes.data) {
            const is_seat_categorized = eventRes.data.event.is_seat_categorized;

            if (!is_seat_categorized) {
                return "Brak podziału miejsc.";
            } else {
                // Krok 2: Jeśli podział miejsc jest włączony, pobierz ceny z event_tickets
                const ticketRes = await axios.get(`/api/event_tickets/read/${eventId}`);
                
                if (ticketRes.status === 200 && ticketRes.data && ticketRes.data.price) {
                    const price = ticketRes.data.price;
                    const categories = seatCategories(price);
                    
                    // Zwróć pełną listę kategorii, zawierającą nazwę i cenę
                    return categories.map(category => ({
                        name: category.name,
                        price: category.price,
                    }));
                } else {
                    return "Brak dostępnych biletów.";
                }
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
