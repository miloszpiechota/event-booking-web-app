import axios from 'axios';
const getAuthToken = () => {
    return localStorage.getItem("token"); // Zakładamy, że token jest przechowywany w localStorage
};

export const getAllEvents = async () => {
  const res = await axios
    .get("api/events/read")
    .catch((err) => console.log(err));

    if(!res || res.status !== 200){
         return console.log("No data");
    }
    const data = await res.data;
    return data;
};
export const handleLogin = async (email, password) => {
  try {
    //przygotuj dane logowania do wysyłki na backend
    const loginData = {
      email,
      password,
    };
    //wyślij zapytanie logowania na bacend
    const res = await axios.post("api/users/login", loginData);

    //sprawdź status odpowiedzi
    if (res.status !== 200) {
        console.log(res.data)
        return res;
    }
    //deszyfruj token jeśli chcesz
    //decryptTOKEN(res.data.token);

    alert("Login successful!");
    //zwróć odpowiedź serwera tylko status i token
    return res.data;
  } catch (error) {
    console.error("Login error: ", error);
    throw(error);
    // return { success: false, msg: error.message || "An error occurred while logging in." };
  }
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
    const response = await axios.get(`/api/events/read/${id}`); // Correct the URL path
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
// export const ConfirmBooking = async (data) => {
//   try {
//     // Sprawdzenie kategorii miejsc i cen
//     const seatCategoryInfo = await isSeatCategory(data.event);

//     const res = await axios.post("/confirm", {
//       seatNumber: data.seatNumber,
//       date: data.date,
//       event: data.event,
//       user: localStorage.getItem("userId"),
//       seatCategoryInfo, // Dodajemy seatCategoryInfo do zapytania
//     });

//     if (res.status !== 200) {
//       throw new Error("Unexpected Error");
//     }

//     return res.data;
//   } catch (err) {
//     console.log("Error in ConfirmBooking:", err);
//   }
// };

export const seatCategories = (inputPrice) => [
  { name: `Pierwsza Kategoria `, price: inputPrice * 3.0 },
  { name: `Druga Kategoria `, price: inputPrice * 2.0 },
  { name: `Trzecia Kategoria `, price: inputPrice },
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
        return [
          {
            name: "Bilet niekategoryzowany",
            price: eventData.event.default_price,
          },
        ];
      }

      const ticketRes = await axios.get(`/api/event_tickets/read/${eventId}`);

      if (
        ticketRes.status === 200 &&
        ticketRes.data &&
        ticketRes.data.categories
      ) {
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
export const getAllCategories = async () => {
    try {
        const response = await axios.get('/api/categories/read');
        console.log("Categories API response:", response.data);
        return response.data.data || [];  // Zwraca `data` jako listę kategorii
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};
export const getAllCities = async () => {
    try {
        const response = await axios.get('/api/cities/read');
        console.log("Cities API response:", response.data);
        return response.data.data || [];  // Zwraca `data` jako listę miast
    } catch (error) {
        console.error("Error fetching cities:", error);
        return [];
    }
}
export const getCityById = async (cityId) => {
    try {
        const cityRes = await axios.get(`/api/cities/read/${cityId}`);
        console.log("City by id API response:", cityRes.data);
        if(cityRes.status === 200 && cityRes.data && cityRes.data.data){
            return cityRes.data.data.city_name;  // Pobiera `city_name` z obiektu `data`
        } else {
            return "Brak miasta";
        }
    } catch (error) {
        console.error("Error fetching city name:", error);
        return "Błąd: Nieoczekiwany problem z połączeniem.";
    }
};
export const getLocationById = async (locationId) => {
  try {
    const locationRes = await axios.get(`/api/locations/read/${locationId}`);

    if (
      locationRes.status === 200 &&
      locationRes.data &&
      locationRes.data.data
    ) {
      const { location_name, city_name, country_name } = locationRes.data.data;
      console.log("Location API response:", locationRes.data);
      return `${location_name}, ${city_name}, ${country_name}`; // Zwracamy pełną lokalizację
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
    const response = await axios.get("/api/payment/read");
    console.log("Payment methods API response:", response.data);
    return response.data.data || []; // Zwracamy `data` jako listę metod płatności
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
export const getAllStatuses = async () => {
    try {
        const response = await axios.get('/api/status/read');
        console.log("Statuses API response:", response.data);
        return response.data.data || [];  // Zwracamy `data` jako listę statusów
    } catch (error) {
        console.error("Error fetching statuses:", error);
        return [];
    }
}
export const fetchEventCoordinates = async (locationName) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: locationName, // Zapytanie (nazwa lub adres lokalizacji)
          format: "json", // Format odpowiedzi
          addressdetails: 1, // Dodanie szczegółów adresu
          limit: 1, // Pobranie pierwszego wyniku
        },
      }
    );

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
export const getEventByCity = async (idCity) => {
    const res = await axios
    .get(`/api/events/read/city/${idCity}`)
    .catch((err)=>console.log(err));

    if(!res || res.status !== 200){
         return console.log("No data");
    }
    const data = await res.data;
    return data;
};

export const getEventsByDates = async (startDate, endDate) => {
    try {
      const res = await axios.get(`/api/events/dates`, {
        params: { startDate, endDate },
      });
  
      if (!res || res.status !== 200) {
        console.error("Error fetching events by date range:", res.data);
        return [];
      }
  
      return res.data.events;
    } catch (error) {
      console.error("Error fetching events by date range:", error);
      return [];
    }
};

// Funkcja do dodawania komentarza
export const addComment = async (commentData) => {
  try {
      
    console.log("commentData", commentData);
        const res = await axios.post("/api/comments/create", commentData);

        if (res.status === 201) {
            return res.data.comment; // Zwraca nowo utworzony komentarz
        } else {
            console.error("Error adding comment:", res.data.error);
            return null;
        }
    } catch (error) {
        console.error("Error adding comment:", error);
        return null;
    }
};
 
// Funkcja do pobierania komentarzy dla konkretnego wydarzenia
export const getCommentsByEvent = async (idevent) => {
    try {
      const res = await axios.get(`/api/comments/read`, {
        params: { idevent },
      });
  
      if (res.status === 200) {
        return res.data.comments.filter((comment) => comment.idevent === idevent);
      } else {
        console.error("Error fetching comments:", res.data.msg);
        return [];
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
};

// Działać chyba działa ale ta autoryzacja, pogadaj z Piotrkiem o tym
export const createEvent = async (eventData) => {
    try {
        const response = await axios.post(
            "/api/events/create",
            eventData
            // {
            //     headers: {
            //         Authorization: `Bearer ${getAuthToken()}`, // Dodanie tokenu JWT do nagłówka
            //     },
            // }
        );
        if (response.status === 201) {
            console.log("Event created successfully:", response.data);
            return { success: true, data: response.data };
        } else {
            console.error("Failed to create event:", response.data);
            return { success: false, error: response.data };
        }
    } catch (error) {
        console.error("Error creating event:", error);
        return { success: false, error: error.message };
    }
};

// Fetch suggested locations from OpenStreetMap
export const getSuggestedLocations = async (query, city) => {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: `${query}, ${city}`,
        format: "json",
        addressdetails: 1,
        limit: 5,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching suggested locations:", error);
    return [];
  }
};

// Create new event location
export const createEventLocation = async (locationData) => {
  try {
    const response = await axios.post("/api/locations/create", locationData);
    return response.data;
  } catch (error) {
    console.error("Error creating new location:", error);
    throw error;
  }
};

export const getUserInfo = async (iduser) => {
  try{
    const token = sessionStorage.getItem('token');
    console.log("getuserinfo");
    console.log(token);
    if(token == null){
      return [];
    }
    console.log("asking for user info");
    console.log(iduser);
    const res = await axios.post(`/api/users/read/${iduser}`, null, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    if(res.status === 200){
      console.log("got user info");
      console.log(res.data)
      return res.data.user;
    }else if(res.status === 403){
      console.error("Access denied");
      return [];
    }else if(res.status === 404){
      console.error("User not found");
      return [];
    }else{
      console.error("Error fetching comments:", res.data.msg);
        return [];
    }
    
  }catch(e){
    console.error(e.message);
  }
}

export const getUserTypes = async () => {
  try{
    const token = sessionStorage.getItem('token');
   
    if(token == null){
      return [];
    }
    
    const res = await axios.get(`/api/users/types/read`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    console.log(res);
    if(res.status === 200){
      
      return res.data.data.user_types;
    }else if(res.status === 403){
      console.error("Access denied");
      return [];
    }else if(res.status === 404){
      console.error("User not found");
      return [];
    }else{
      console.error("Error fetching comments:", res.data.msg);
        return [];
    }
    
  }catch(e){
    console.error(e.message);
  }
}

export const getUserOrders = async (iduser) => {
  try{
    const token = sessionStorage.getItem('token');
    console.log("getuserorders");
    console.log(token);
    if(token == null){
      return [];
    }
    console.log("asking for user orders");
    console.log(iduser);
    const res = await axios.get(`/api/orders/read/user/${iduser}`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    if(res.status === 200){
      console.log("got user orders");
      console.log(res.data.orders)
      return res.data.orders;
    }else if(res.status === 403){
      console.error("Access denied");
      return [];
    }else if(res.status === 404){
      console.error("User not found");
      return [];
    }else{
      console.error("Error fetching comments:", res.data.msg);
        return [];
    }
    
  }catch(e){
    console.error(e.message);
  }
}

export const getUserOrder = async (idorder) => {
  try{
    const token = sessionStorage.getItem('token');
    console.log("getuserorders");
    console.log(token);
    if(token == null){
      return [];
    }
    console.log("asking for specific order");
    console.log(idorder);
    const res = await axios.get(`/api/orders/read/${idorder}`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    if(res.status === 200){
      console.log("got user orders");
      console.log(res.data)
      return res.data.order;
    }else if(res.status === 403){
      console.error("Access denied");
      return [];
    }else if(res.status === 404){
      console.error("User not found");
      return [];
    }else{
      console.error("Error fetching comments:", res.data.msg);
        return [];
    }
    
  }catch(e){
    console.error(e.message);
  }
}
const servicePrice = 5.25;
export const printPrice = async (price) => {
  return {
      withServicePrice: price + servicePrice,
      noServicePrice: price - servicePrice,
      servicePrice: servicePrice,
      basePrice: price,
  };
};

export const createTicketOrder = async (orderData) => {
  try {
    const response = await axios.post("/api/orders/", orderData);
    if (response.status === 201) {
      console.log("Order created successfully:", response.data);
      return { success: true, data: response.data };
    } else {
      console.error("Failed to create order:", response.data);
      return { success: false, error: response.data };
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
};
