// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Collapse,
//   IconButton,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { styled } from "@mui/material/styles";
// import Sheet from "@mui/joy/Sheet";
// import Dropdown from "@mui/joy/Dropdown";
// import MenuButton from "@mui/joy/MenuButton";
// import Menu from "@mui/joy/Menu";
// import MenuItem from "@mui/joy/MenuItem";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import { Link } from "react-router-dom";
// import EventItem from "./EventItem";
// import {
//   getAllEvents,
//   getAllCategories,
//   getAllCities,
//   getEventByCity,
//   getEventsByDates
// } from "../../api-helpers/api-helpers";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import dayjs from "dayjs";

// // Stylowanie rozwijania sekcji
// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
//   marginLeft: "auto",
//   transition: theme.transitions.create("transform", {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const Events = () => {
//   const [events, setEvents] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(""); // Wybrana kategoria
//   const [selectedCity, setSelectedCity] = useState(""); // Wybrane miasto
//   const [noEventsMessage, setNoEventsMessage] = useState("");
//   const [expanded, setExpanded] = useState(null); // Kontrola rozwinięcia szczegółów
//   const [value, setValue] = useState(null);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [eventsData, categoriesData, citiesData] = await Promise.all([
//           getAllEvents(),
//           getAllCategories(),
//           getAllCities(),
//         ]);
//         setEvents(eventsData.event || []);
//         setFilteredEvents(eventsData.event || []); // Ustawienie wszystkich wydarzeń na początek
//         setCategories(categoriesData || []);
//         setCities(citiesData || []);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       }
//     };
//     fetchData();
//   }, []);



//   // Słownik komunikatów
//   const messages = {
//     noEventsInCity: (city) => `Brak wydarzeń w mieście "${city}".`,
//     noEventsInCategory: (category) =>
//       `Brak wydarzeń dla kategorii "${category}".`,
//     noEventsInCategoryAndCity: (category, city) =>
//       `Brak wydarzeń dla kategorii "${category}" w mieście "${city}".`,
//     noEvents: "Brak wydarzeń.",
//   };

//   // Funkcja filtrowania wydarzeń (dynamiczna)
//   // const filterEvents = async (city, category) => {
//   //   let filtered = events;

//   //   if (city) {
//   //     try {
//   //       const cityData = await getEventByCity(city.idcity);
//   //       filtered = cityData.event;
//   //     } catch (error) {
//   //       console.error("Error fetching events by city:", error);
//   //       filtered = [];
//   //     }
//   //   }

//   //   if (category) {
//   //     const selectedCategoryObject = categories.find(
//   //       (cat) => cat.category_type === category
//   //     );

//   //     if (selectedCategoryObject) {
//   //       filtered = filtered.filter(
//   //         (event) =>
//   //           event.idevent_category === selectedCategoryObject.idevent_category
//   //       );
//   //     }
//   //   }

//   //   // Obsługa braku wyników
//   //   if (filtered.length === 0) {
//   //     if (city && category) {
//   //       setNoEventsMessage(
//   //         messages.noEventsInCategoryAndCity(category, city.city)
//   //       );
//   //     } else if (city) {
//   //       setNoEventsMessage(messages.noEventsInCity(city.city));
//   //     } else if (category) {
//   //       setNoEventsMessage(messages.noEventsInCategory(category));
//   //     } else {
//   //       setNoEventsMessage(messages.noEvents);
//   //     }
//   //   } else {
//   //     setNoEventsMessage("");
//   //   }
//   //   setFilteredEvents(filtered);
//   // };

//   const filterEvents = async (city, category) => {
//     let filtered = events;
  
//     if (city) {
//       const cityData = await getEventByCity(city.idcity);
//       filtered = cityData.event;
//     }
  
//     if (category) {
//       const selectedCategoryObject = categories.find(
//         (cat) => cat.category_type === category
//       );
  
//       if (selectedCategoryObject) {
//         filtered = filtered.filter(
//           (event) =>
//             event.idevent_category === selectedCategoryObject.idevent_category
//         );
//       }
//     }
  
//     if (startDate && endDate) {
//       filtered = filtered.filter(
//         (event) =>
//           dayjs(event.start_date).isAfter(dayjs(startDate)) &&
//           dayjs(event.end_date).isBefore(dayjs(endDate))
//       );
//     }
  
//     setFilteredEvents(filtered);
//   };
  




//   // Obsługa zmiany miasta
//   const handleCityChange = async (cityId) => {
//     const selected = cities.find((city) => city.idcity === cityId);
//     setSelectedCity(selected ? selected.city : "");

//     const cityObject = selected || null;
//     const categoryObject = categories.find(
//       (cat) => cat.category_type === selectedCategory
//     );

//     await filterEvents(
//       cityObject,
//       selectedCategory ? categoryObject?.category_type : null
//     );
//   };

//   // Obsługa zmiany kategorii
//   const handleCategoryChange = async (categoryId) => {
//     const selected = categories.find(
//       (category) => category.idevent_category === categoryId
//     );
//     setSelectedCategory(selected ? selected.category_type : "");

//     const cityObject =
//       cities.find((city) => city.city === selectedCity) || null;
//     await filterEvents(cityObject, selected ? selected.category_type : null);
//   };

// const filterEventsByDate = async () => {
//   if (startDate && endDate) {
//     const events = await getEventsByDates(dayjs(startDate).toISOString(), dayjs(endDate).toISOString());
//     setFilteredEvents(events);
//   } else {
//     setFilteredEvents(events); // Resetuj do wszystkich wydarzeń, jeśli brak zakresu dat
//   }
// };


//   // Trigger filtrowania po każdej zmianie
//   useEffect(() => {
//     filterEvents();
//   }, [selectedCategory, selectedCity, events]);

//   const handleExpandClick = (eventId) => {
//     setExpanded(expanded === eventId ? null : eventId);
//   };

//   return (
//     <Box margin="auto" width="80%">
//       <Sheet
//         variant="solid"
//         color="success"
//         invertedColors
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           flexGrow: 1,
//           p: 2,
//           borderRadius: { xs: 0, sm: "sm" },
//           minWidth: "min-content",
//           background: `linear-gradient(to top, #4caf50, #66bb6a)`,
//         }}
//       >
//         <Box sx={{ flex: 1, display: "flex", gap: 2 }}>
//           {/* Kategorie Dropdown */}
//           <Dropdown>
//             <MenuButton
//               sx={{ "--Button-radius": "1.5rem" }}
//               variant="outlined"
//               endDecorator={<KeyboardArrowDownIcon />}
//             >
//               {selectedCategory || "Kategorie"}
//             </MenuButton>
//             <Menu
//               variant="outlined"
//               placement="bottom-start"
//               disablePortal
//               size="sm"
//               sx={{
//                 "--ListItemDecorator-size": "24px",
//                 "--ListItem-minHeight": "40px",
//                 "--ListDivider-gap": "4px",
//                 minWidth: 200,
//               }}
//             >
//               {categories.length > 0 ? (
//                 <>
//                   <MenuItem onClick={() => handleCategoryChange(null)}>
//                     Odznacz wybór kategorii
//                   </MenuItem>
//                   {categories.map((category) => (
//                     <MenuItem
//                       key={category.idevent_category}
//                       onClick={() =>
//                         handleCategoryChange(category.idevent_category)
//                       }
//                     >
//                       {category.category_type}
//                     </MenuItem>
//                   ))}
//                 </>
//               ) : (
//                 <MenuItem disabled>Brak kategorii</MenuItem>
//               )}
//             </Menu>
//           </Dropdown>

//           {/* Miasta Dropdown */}
//           <Dropdown>
//             <MenuButton
//               sx={{ "--Button-radius": "1.5rem" }}
//               variant="outlined"
//               endDecorator={<KeyboardArrowDownIcon />}
//             >
//               {selectedCity || "Miasta"}
//             </MenuButton>
//             <Menu
//               variant="outlined"
//               placement="bottom-start"
//               disablePortal
//               size="sm"
//               sx={{
//                 "--ListItemDecorator-size": "24px",
//                 "--ListItem-minHeight": "40px",
//                 "--ListDivider-gap": "4px",
//                 minWidth: 200,
//               }}
//             >
//               {cities.length > 0 ? (
//                 <>
//                   <MenuItem onClick={() => handleCityChange(null)}>
//                     Odznacz wybór miasta
//                   </MenuItem>
//                   {cities.map((city) => (
//                     <MenuItem
//                       key={city.idcity}
//                       onClick={() => handleCityChange(city.idcity)}
//                     >
//                       {city.city}
//                     </MenuItem>
//                   ))}
//                 </>
//               ) : (
//                 <MenuItem disabled>Brak miast</MenuItem>
//               )}
//             </Menu>
//           </Dropdown>
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//   <Box display="flex" gap={2} alignItems="center">
//     <DatePicker
//       label="Od"
//       value={startDate}
//       onChange={(newValue) => setStartDate(newValue)}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           variant="outlined"
//           sx={{
//             "--Button-radius": "1.5rem",
//             width: "200px",
//             borderRadius: "1.5rem",
//           }}
//         />
//       )}
//     />
//     <DatePicker
//       label="Do"
//       value={endDate}
//       onChange={(newValue) => setEndDate(newValue)}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           variant="outlined"
//           sx={{
//             "--Button-radius": "1.5rem",
//             width: "200px",
//             borderRadius: "1.5rem",
//           }}
//         />
//       )}
//     />
//     <Button
//       variant="contained"
//       color="primary"
//       onClick={filterEventsByDate}
//       disabled={!startDate || !endDate}
//     >
//       Filtruj
//     </Button>
//   </Box>
// </LocalizationProvider>

//         </Box>
//       </Sheet>

//       {noEventsMessage ? (
//         <Typography textAlign="center" color="error" marginTop={5}>
//           {noEventsMessage}
//         </Typography>
//       ) : (
//         filteredEvents.map((event) => (
//           <Card
//             key={event.idevent}
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               margin: "1rem 0",
//               border: "1px solid #ccc",
//               borderRadius: "10px",
//             }}
//           >
//             <Box display="flex" alignItems="center">
//               <Box
//                 component="img"
//                 src={event.photo}
//                 alt={event.name}
//                 sx={{
//                   width: 182,
//                   height: 182,
//                   objectFit: "cover",
//                   borderRadius: "10px 0 0 10px",
//                 }}
//               />
//               <CardContent sx={{ flex: 1 }}>
//                 <Typography variant="h5" sx={{ fontWeight: "bold" }}>
//                   {event.name}
//                 </Typography>
//                 <Typography variant="subtitle1" color="text.secondary">
//                   {event.description}
//                 </Typography>
//                 <Box sx={{ display: "flex", gap: 2, marginTop: "1rem" }}>
//                   <Button
//                     variant="outlined"
//                     color="primary"
//                     onClick={() => alert(`Booking event: ${event.name}`)}
//                   >
//                     Book
//                   </Button>
//                   <ExpandMore
//                     expand={expanded === event.idevent}
//                     onClick={() => handleExpandClick(event.idevent)}
//                     aria-expanded={expanded === event.idevent}
//                     aria-label="show more"
//                   >
//                     <ExpandMoreIcon />
//                   </ExpandMore>
//                 </Box>
//               </CardContent>
//             </Box>
//             <Collapse
//               in={expanded === event.idevent}
//               timeout="auto"
//               unmountOnExit
//             >
//               <CardContent>
//                 <Typography variant="h6">Szczegóły wydarzenia:</Typography>
//                 <Typography>
//                   <strong>Data rozpoczęcia:</strong>{" "}
//                   {dayjs(event.start_date).format("L")}
//                 </Typography>
//                 <Typography>
//                   <strong>Data zakończenia:</strong>{" "}
//                   {dayjs(event.end_date).format("L")}
//                 </Typography>
//                 <Typography>
//                   <strong>Lokalizacja:</strong>{" "}
//                   {event.locationName || "Nieznana"}
//                 </Typography>
//                 <Typography>
//                   <strong>Podział miejsc:</strong>{" "}
//                   {event.isSeatCategorized ? "Tak" : "Nie"}
//                 </Typography>
//               </CardContent>
//             </Collapse>
//           </Card>
//         ))
//       )}
//     </Box>
//   );
// };

// export default Events;

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import Sheet from "@mui/joy/Sheet";
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getAllEvents, getAllCategories, getAllCities, getEventByCity, getEventsByDates } from "../../api-helpers/api-helpers";
import { Link } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// Stylowanie rozwijania sekcji
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Events = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [noEventsMessage, setNoEventsMessage] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, categoriesData, citiesData] = await Promise.all([
          getAllEvents(),
          getAllCategories(),
          getAllCities(),
        ]);
        setEvents(eventsData.event || []);
        setFilteredEvents(eventsData.event || []);
        setCategories(categoriesData || []);
        setCities(citiesData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const filterEvents = async (city, category) => {
    let filtered = events;

    if (city) {
      const cityData = await getEventByCity(city.idcity);
      filtered = cityData.event;
    }

    if (category) {
      const selectedCategoryObject = categories.find(
        (cat) => cat.category_type === category
      );
      if (selectedCategoryObject) {
        filtered = filtered.filter(
          (event) =>
            event.idevent_category === selectedCategoryObject.idevent_category
        );
      }
    }

    if (startDate && endDate) {
      filtered = filtered.filter(
        (event) =>
          dayjs(event.start_date).isAfter(dayjs(startDate)) &&
          dayjs(event.end_date).isBefore(dayjs(endDate))
      );
    }

    setFilteredEvents(filtered);

    if (filtered.length === 0) {
      setNoEventsMessage("Brak wydarzeń dla podanych filtrów.");
    } else {
      setNoEventsMessage("");
    }
  };

  const handleCityChange = async (cityId) => {
    const selected = cities.find((city) => city.idcity === cityId);
    setSelectedCity(selected ? selected.city : "");
    const cityObject = selected || null;
    const categoryObject = categories.find(
      (cat) => cat.category_type === selectedCategory
    );
    await filterEvents(cityObject, selectedCategory ? categoryObject?.category_type : null);
  };

  const handleCategoryChange = async (categoryId) => {
    const selected = categories.find(
      (category) => category.idevent_category === categoryId
    );
    setSelectedCategory(selected ? selected.category_type : "");
    const cityObject = cities.find((city) => city.city === selectedCity) || null;
    await filterEvents(cityObject, selected ? selected.category_type : null);
  };

  const filterEventsByDate = async () => {
    try {
      if (startDate && endDate) {
        const events = await getEventsByDates(
          dayjs(startDate).toISOString(),
          dayjs(endDate).toISOString()
        );
  
        if (!events || events.length === 0) {
          setNoEventsMessage("Brak wydarzeń w podanym zakresie dat.");
          setFilteredEvents([]); // Ustaw pustą listę
        } else {
          setNoEventsMessage("");
          setFilteredEvents(events);
        }
      } else {
        setFilteredEvents(events); // Resetuj do wszystkich wydarzeń, jeśli brak zakresu dat
      }
    } catch (error) {
      console.error("Error fetching events by date range:", error);
      setNoEventsMessage("Wystąpił problem podczas filtrowania wydarzeń.");
    }
  };
  

  const handleExpandClick = (eventId) => {
    setExpanded(expanded === eventId ? null : eventId);
  };

  return (
    <Box margin="auto" width="80%">
      <Sheet
        variant="solid"
        color="success"
        invertedColors
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          p: 2,
          borderRadius: { xs: 0, sm: "sm" },
          minWidth: "min-content",
          background: `linear-gradient(to top, #4caf50, #66bb6a)`,
        }}
      >
        <Box sx={{ flex: 1, display: "flex", gap: 2 }}>
          <Dropdown>
            <MenuButton
              sx={{ "--Button-radius": "1.5rem" }}
              variant="outlined"
              endDecorator={<KeyboardArrowDownIcon />}
            >
              {selectedCategory || "Kategorie"}
            </MenuButton>
            <Menu>
              {categories.map((category) => (
                <MenuItem
                  key={category.idevent_category}
                  onClick={() => handleCategoryChange(category.idevent_category)}
                >
                  {category.category_type}
                </MenuItem>
              ))}
            </Menu>
          </Dropdown>
          <Dropdown>
            <MenuButton
              sx={{ "--Button-radius": "1.5rem" }}
              variant="outlined"
              endDecorator={<KeyboardArrowDownIcon />}
            >
              {selectedCity || "Miasta"}
            </MenuButton>
            <Menu>
              {cities.map((city) => (
                <MenuItem key={city.idcity} onClick={() => handleCityChange(city.idcity)}>
                  {city.city}
                </MenuItem>
              ))}
            </Menu>
          </Dropdown>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display="flex" gap={2}>
              <DatePicker
                label="Od"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
              />
              <DatePicker
                label="Do"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={filterEventsByDate}
                disabled={!startDate || !endDate}
              >
                Filtruj
              </Button>
            </Box>
          </LocalizationProvider>
        </Box>
      </Sheet>
      {filteredEvents && filteredEvents.length > 0 ? (
  filteredEvents.map((event) => (
    <Card
      key={event.idevent}
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: "1rem 0",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <Box display="flex" alignItems="center">
        <Box
          component="img"
          src={event.photo}
          alt={event.name}
          sx={{
            width: 182,
            height: 182,
            objectFit: "cover",
            borderRadius: "10px 0 0 10px",
          }}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {event.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {event.description}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, marginTop: "1rem" }}>
          <Button
                component={Link}
                to={`/booking/${event.idevent}`} // Przekierowanie do strony z ID wydarzenia
                variant="outlined"
                color="primary"
              >
                Book
              </Button>
            <ExpandMore
              expand={expanded === event.idevent}
              onClick={() => handleExpandClick(event.idevent)}
              aria-expanded={expanded === event.idevent}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Box>
        </CardContent>
      </Box>
      <Collapse in={expanded === event.idevent} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="h6">Szczegóły wydarzenia:</Typography>
          <Typography>
            <strong>Data rozpoczęcia:</strong> {dayjs(event.start_date).format("L")}
          </Typography>
          <Typography>
            <strong>Data zakończenia:</strong> {dayjs(event.end_date).format("L")}
          </Typography>
          <Typography>
            <strong>Lokalizacja:</strong> {event.locationName || "Nieznana"}
          </Typography>
          <Typography>
            <strong>Podział miejsc:</strong>{" "}
            {event.isSeatCategorized ? "Tak" : "Nie"}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  ))
) : (
  <Typography textAlign="center" color="error" marginTop={5}>
    {noEventsMessage || "Brak wydarzeń."}
  </Typography>
)}

    </Box>
  );
};

export default Events;

