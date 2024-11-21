import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Box, Typography, Button } from "@mui/material";
import Sheet from "@mui/joy/Sheet";
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link } from "react-router-dom";
import EventItem from "./Events/EventItem";
import {
  getAllEvents,
  getAllCategories,
  getAllCities,
  getEventByCity,
} from "../api-helpers/api-helpers.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import eventImage from "../images/pexels-oandremoura-2675648.jpg";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Wybrana kategoria
  const [selectedCity, setSelectedCity] = useState(""); // Wybrane miasto
  const [noEventsMessage, setNoEventsMessage] = useState("");


      function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{
                    ...style,
                    display: "block",
                    background: "green",
                    borderRadius: "50%",  // nadaje okrągły kształt
                    width: "40px",        // ustaw szerokość strzałki
                    height: "40px",       // ustaw wysokość strzałki
                    lineHeight: "40px",   // centrowanie w pionie
                    textAlign: "center"   // centrowanie w poziomie
                }}
                onClick={onClick}
            />
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{
                    ...style,
                    display: "block",
                    background: "green",
                    borderRadius: "50%",  // nadaje okrągły kształt
                    width: "40px",        // ustaw szerokość strzałki
                    height: "40px",       // ustaw wysokość strzałki
                    lineHeight: "40px",   // centrowanie w pionie
                    textAlign: "center"   // centrowanie w poziomie
                }}
                onClick={onClick}
            />
        );
    }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, categoriesData, citiesData] = await Promise.all([
          getAllEvents(),
          getAllCategories(),
          getAllCities(),
        ]);
        setEvents(eventsData.event || []);
        setFilteredEvents(eventsData.event || []); // Ustawienie wszystkich wydarzeń na początek
        setCategories(categoriesData || []);
        setCities(citiesData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);
  // Słownik komunikatów
  const messages = {
    noEventsInCity: (city) => `Brak wydarzeń w mieście "${city}".`,
    noEventsInCategory: (category) =>
      `Brak wydarzeń dla kategorii "${category}".`,
    noEventsInCategoryAndCity: (category, city) =>
      `Brak wydarzeń dla kategorii "${category}" w mieście "${city}".`,
    noEvents: "Brak wydarzeń.",
  };

  // Funkcja filtrowania wydarzeń (dynamiczna)
  const filterEvents = async (city, category) => {
    let filtered = events;

    if (city) {
      try {
        const cityData = await getEventByCity(city.idcity);
        filtered = cityData.event;
      } catch (error) {
        console.error("Error fetching events by city:", error);
        filtered = [];
      }
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

    // Obsługa braku wyników
    if (filtered.length === 0) {
      if (city && category) {
        setNoEventsMessage(
          messages.noEventsInCategoryAndCity(category, city.city)
        );
      } else if (city) {
        setNoEventsMessage(messages.noEventsInCity(city.city));
      } else if (category) {
        setNoEventsMessage(messages.noEventsInCategory(category));
      } else {
        setNoEventsMessage(messages.noEvents);
      }
    } else {
      setNoEventsMessage("");
    }

    setFilteredEvents(filtered);
  };

  // Obsługa zmiany miasta
  const handleCityChange = async (cityId) => {
    const selected = cities.find((city) => city.idcity === cityId);
    setSelectedCity(selected ? selected.city : "");

    const cityObject = selected || null;
    const categoryObject = categories.find(
      (cat) => cat.category_type === selectedCategory
    );

    await filterEvents(
      cityObject,
      selectedCategory ? categoryObject?.category_type : null
    );
  };

  // Obsługa zmiany kategorii
  const handleCategoryChange = async (categoryId) => {
    const selected = categories.find(
      (category) => category.idevent_category === categoryId
    );
    setSelectedCategory(selected ? selected.category_type : "");

    const cityObject =
      cities.find((city) => city.city === selectedCity) || null;
    await filterEvents(cityObject, selected ? selected.category_type : null);
  };

  // Trigger filtrowania po każdej zmianie
  useEffect(() => {
    filterEvents();
  }, [selectedCategory, selectedCity, events]);


  const settings = {
    dots: true,
    infinite: filteredEvents.length > 1, // Wyłącz nieskończone przewijanie, jeśli tylko jedno wydarzenie
    slidesToShow: Math.min(filteredEvents.length, 3), // Pokaż tylko tyle slajdów, ile jest wydarzeń (maksymalnie 3)
    slidesToScroll: 1,
    autoplay: filteredEvents.length > 1, // Wyłącz autoplay, jeśli tylko jedno wydarzenie
    speed: 1000,
    autoplaySpeed: 3000,
    cssEase: "linear",
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
  };
  

  return (
    <Box width="100%" margin="auto" marginTop={2}>
      <Box
        display="flex"
        justifyContent="center"
        margin="auto"
        width="80%"
        height="40vh"
        padding={2}
      >
        <img src={eventImage} alt="Event" width="auto" height="100%" />
      </Box>
      <Box padding={5} margin="auto">
        <Typography variant="h4" textAlign="center">
          Welcome to EventBookings
        </Typography>
      </Box>
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
            {/* Kategorie Dropdown */}
            <Dropdown>
              <MenuButton
                sx={{ "--Button-radius": "1.5rem" }}
                variant="outlined"
                endDecorator={<KeyboardArrowDownIcon />}
              >
                {selectedCategory || "Kategorie"}
              </MenuButton>
              <Menu
                variant="outlined"
                placement="bottom-start"
                disablePortal
                size="sm"
                sx={{
                  "--ListItemDecorator-size": "24px",
                  "--ListItem-minHeight": "40px",
                  "--ListDivider-gap": "4px",
                  minWidth: 200,
                }}
              >
                {categories.length > 0 ? (
                  <>
                    <MenuItem onClick={() => handleCategoryChange(null)}>
                      Odznacz wybór kategorii
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem
                        key={category.idevent_category}
                        onClick={() =>
                          handleCategoryChange(category.idevent_category)
                        }
                      >
                        {category.category_type}
                      </MenuItem>
                    ))}
                  </>
                ) : (
                  <MenuItem disabled>Brak kategorii</MenuItem>
                )}
              </Menu>
            </Dropdown>

            {/* Miasta Dropdown */}
            <Dropdown>
              <MenuButton
                sx={{ "--Button-radius": "1.5rem" }}
                variant="outlined"
                endDecorator={<KeyboardArrowDownIcon />}
              >
                {selectedCity || "Miasta"}
              </MenuButton>
              <Menu
                variant="outlined"
                placement="bottom-start"
                disablePortal
                size="sm"
                sx={{
                  "--ListItemDecorator-size": "24px",
                  "--ListItem-minHeight": "40px",
                  "--ListDivider-gap": "4px",
                  minWidth: 200,
                }}
              >
                {cities.length > 0 ? (
                  <>
                    <MenuItem onClick={() => handleCityChange(null)}>
                      Odznacz wybór miasta
                    </MenuItem>
                    {cities.map((city) => (
                      <MenuItem
                        key={city.idcity}
                        onClick={() => handleCityChange(city.idcity)}
                      >
                        {city.city}
                      </MenuItem>
                    ))}
                  </>
                ) : (
                  <MenuItem disabled>Brak miast</MenuItem>
                )}
              </Menu>
            </Dropdown>
          </Box>
        </Sheet>

        {/* Slider with events */}
        {/* {noEventsMessage ? (
          <Typography textAlign="center" color="error" marginTop={5}>
            {noEventsMessage}
          </Typography>
        ) : (
          <div className="slider-container">
            <Slider {...settings}>
              {filteredEvents.map((event, index) => (
                <Box key={index} padding={2}>
                  <EventItem
                    id={event.idevent}
                    name={event.name}
                    startDate={event.start_date}
                    endDate={event.end_date}
                    description={event.description}
                    numberOfTickets={event.number_of_ticket}
                    posterUrl={event.photo}
                    contactInfo={event.contact_info}
                    idstatus_type={event.idstatus_type}
                    isSeatCategorized={event.is_seat_categorized}
                    locationName={event.location_name}
                    idevent_category={event.idevent_category}
                  />
                </Box>
              ))}
            </Slider>
          </div>
        )} */}
      {/* Slider with events */}
{noEventsMessage ? (
  <Typography textAlign="center" color="error" marginTop={5}>
    {noEventsMessage}
  </Typography>
) : filteredEvents.length === 1 ? (
  // Jeśli jest tylko jedno wydarzenie, wyświetl je bez slidera
  <Box display="flex" justifyContent="center" padding={2}>
    <EventItem
      id={filteredEvents[0].idevent}
      name={filteredEvents[0].name}
      startDate={filteredEvents[0].start_date}
      endDate={filteredEvents[0].end_date}
      description={filteredEvents[0].description}
      numberOfTickets={filteredEvents[0].number_of_ticket}
      posterUrl={filteredEvents[0].photo}
      contactInfo={filteredEvents[0].contact_info}
      idstatus_type={filteredEvents[0].idstatus_type}
      isSeatCategorized={filteredEvents[0].is_seat_categorized}
      locationName={filteredEvents[0].location_name}
      idevent_category={filteredEvents[0].idevent_category}
    />
  </Box>
) : (
  <div className="slider-container">
    <Slider {...settings}>
      {filteredEvents.map((event, index) => (
        <Box key={index} padding={2}>
          <EventItem
            id={event.idevent}
            name={event.name}
            startDate={event.start_date}
            endDate={event.end_date}
            description={event.description}
            numberOfTickets={event.number_of_ticket}
            posterUrl={event.photo}
            contactInfo={event.contact_info}
            idstatus_type={event.idstatus_type}
            isSeatCategorized={event.is_seat_categorized}
            locationName={event.location_name}
            idevent_category={event.idevent_category}
          />
        </Box>
      ))}
    </Slider>
  </div>
)}
      </Box>
      <Box display="flex" padding={5} margin="auto" justifyContent="center">
        <Button
          component={Link}
          to="/events"
          variant="outlined"
          sx={{ color: "#2b2d42", borderColor: "#2b2d42" }}
        >
          View All Events
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
