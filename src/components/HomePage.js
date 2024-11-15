// import React, { useEffect, useState } from 'react';
// import { Box, Typography, Button } from '@mui/material';
// import { Link } from "react-router-dom";
// import EventItem from './Events/EventItem';
// import { getAllEvents } from '../api-helpers/api-helpers.js';

// const HomePage = () => {
//     const [events, setEvents] = useState([]);
//  useEffect(() => {
//      const fetchData = async () => {
//          try {
//              const data = await getAllEvents();
//              setEvents(data.event); 
//          } catch (err) {
//              console.log(err);
//          }
//      };
//      fetchData();
//  }, []);

//   return (
//     <Box width={'100%'} height="100%" margin="auto" marginTop={2}>
//         <Box margin={"auto"} width="80%" height={"40vh"} padding={2}>
//             <img src="https://www.eventbookings.com/wp-content/uploads/2024/01/Different-Types-of-Events-in-2024-Which-is-Right-for-You-2048x1365.jpg"
//              alt="Event"
//              width={'100%'}
//              height={'100%'} />
//         </Box>
//         <Box padding={5} margin="auto">
//             <Typography variant="h4" textAlign={"center"}>
//                 Welcome to EventBookings
//             </Typography>
//         </Box>
//         <Box
//         margin={"auto"}
//         display="flex"
//         width="80%"
//         justifyContent={"center"}
//         alignContent="center"
//         flexWrap="wrap"
//         >
//             {events && 
//                 events
//                 .slice(0, 8)
//                 .map((event,index) => (
//                 <EventItem 
//                     key={index} 
//                     id={event.idevent} 
//                     name={event.name} 
//                     startDate={event.start_date} 
//                     endDate={event.end_date} 
//                     description={event.description} 
//                     numberOfTickets={event.number_of_ticket} 
//                     posterUrl={event.photo} 
//                     contactInfo={event.contact_info} 
//                     idstatus_type={event.idstatus_type}
//                     isSeatCategorized={event.is_seat_categorized}
//                 />
//                 ))}
//         </Box>
//         <Box display="flex" padding={5} margin="auto">
//             <Button 
//                 component={Link} 
//                 to="/events" 
//                 variant="outlined"
//                 sx={{margin: "auto", color: "#2b2d42", borderColor: "#2b2d42"}}
//             >
//                 View All Events
//             </Button>
//         </Box>
//     </Box>   
//   );
// };

// export default HomePage;



import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import { Box, Typography, Button } from '@mui/material';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import { Link } from "react-router-dom";
import EventItem from './Events/EventItem';
import { getAllEvents } from '../api-helpers/api-helpers.js';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const HomePage = () => {
    const [events, setEvents] = useState([]);

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
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 3000,
        cssEase: "linear",
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllEvents();
                setEvents(data.event); 
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);

    return (
        <Box width="100%" margin="auto" marginTop={2}>
            <Box margin="auto" width="80%" height="40vh" padding={2}>
                <img 
                    src="https://www.eventbookings.com/wp-content/uploads/2024/01/Different-Types-of-Events-in-2024-Which-is-Right-for-You-2048x1365.jpg"
                    alt="Event"
                    width="100%"
                    height="100%"
                />
            </Box>
            <Box padding={5} margin="auto">
                <Typography variant="h4" textAlign="center">
                    Welcome to EventBookings
                </Typography>
            </Box>

            {/* Slider z EventItem */}
            <Box margin="auto" width="80%">
            <div className="slider-container">
                <Slider {...settings}>
                    {events && events.slice(0, 8).map((event, index) => (
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
                            />
                        </Box>
                    ))}
                </Slider>
            </div>
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
