
// import { Box, Button,  Typography } from '@mui/material';
// import { getEventDetails, isSeatCategory } from 'api-helpers/api-helpers';
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import dayjs from 'dayjs';
// import 'dayjs/locale/pl';
// dayjs.locale('pl');
// var localizedFormat = require("dayjs/plugin/localizedFormat");
// var relativeTime = require("dayjs/plugin/relativeTime");
// dayjs.extend(localizedFormat);
// dayjs.extend(relativeTime);
// const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
// };

// const formatTime = (dateString) => {
//     return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// };
// const Booking = () => {
//     const navigate = useNavigate();
//     const [inputs, setInputs] = useState({ seatNumber: "", date: "" });
//     const [event, setEvent] = useState(null);
//     const [seatCategoryInfo, setSeatCategoryInfo] = useState("");  
//     const { id } = useParams(); 

//     useEffect(() => {
//         const fetchEvent = async () => {
//             try {
//                 const data = await getEventDetails(id);
//                 if (data && data.event) {
//                     setEvent(data.event);
//                     const categoryInfo = await isSeatCategory(data.event.idevent);
//                     setSeatCategoryInfo(categoryInfo); 
//                 }
//             } catch (error) {
//                 console.error("Error fetching event details:", error);
//             }
//         };
//         fetchEvent();
//     }, [id]);

//     // const handleChange = (e) => {
//     //     setInputs((prevState) => ({
//     //         ...prevState,
//     //         [e.target.name]: e.target.value,
//     //     }));
//     // };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//          // Sprawdzamy, czy seatCategoryInfo jest tablicą. Jeśli nie, przekształcamy ją w tablicę.
//         const categoryInfo = Array.isArray(seatCategoryInfo) ? seatCategoryInfo : [seatCategoryInfo];
//         navigate('/confirm', {
//             state: {
//                 event: id,
//                 seatCategoryInfo: categoryInfo,
//                 seatNumber: inputs.seatNumber,
//                 date: inputs.date,
//             }
//         });}
//         // newBooking({ ...inputs, event: id })
//         //     .then((res) => console.log("Booking successful:", res))
//         //     .catch((err) => console.error("Error creating booking:", err));
//     return (
//         <div>
//             {event ? (
//                 <>
//                     <Typography 
//                         padding={3} 
//                         fontFamily="fantasy" 
//                         variant="h4"
//                         textAlign={"center"}
//                     >
//                         Book Tickets for Event: {event.name}
//                     </Typography>
//                     <Box display="flex" justifyContent="center">
//                         <Box display="flex" flexDirection="column" paddingTop={3} width="50%" marginRight="auto">
//                             <img 
//                                 width="80%"
//                                 height="300px"
//                                 src={event.photo} 
//                                 alt={event.name}
//                             />
//                             <Box width="80%" marginTop={3} padding={2}>
//                                 <Typography paddingTop={2}>{event.description}</Typography>
//                                 <Typography fontWeight="bold" marginTop={1}>
//                                 Liczba dostępnych miejsc: {event.number_of_ticket}
//                                 </Typography>
//                                 <Typography fontWeight="bold" marginTop={1}>
//                                 {/* Data: {dayjs(event.start_date).format("L")} - {dayjs(event.end_date).format("L")} */}
//                                     Data: {formatDate(event.start_date)} - {formatDate(event.end_date)}
//                                 </Typography>
//                                 <Typography fontWeight="bold" marginTop={1}>
//                                 {/* Godzina: {dayjs(event.start_date).format("LT")} - {dayjs(event.end_date).format("LT")} */}
//                                 Godzina: {formatTime(event.start_date)} - {formatTime(event.end_date)}
//                                 </Typography>
//                                 <Typography fontWeight="bold" marginTop={1}>
//                                 {/* Czas trwania: {dayjs(event.end_date).from(dayjs(event.start_date), true)} */}
//                                     Czas trwania: {dayjs(event.end_date).from(dayjs(event.start_date), true)}
//                                 </Typography>
//                                 <Typography paddingTop={2}>
//                                 Informacje kontaktowe: {event.contact_info}
//                                 </Typography>
//                                 <Typography paddingTop={2}>
//                                 Podział miejsc: {event.is_seat_categorized  ? "Tak" : "Nie"}
//                                 </Typography>
//                                     {event.is_seat_categorized && (
//                                         <Typography paddingTop={2}>
//                                             {/* Seat Category Info: {seatCategoryInfo.map(category => `${category.name} - ${category.price} zł`).join(', ')} */}
//                                             Seat Category Info: {seatCategoryInfo}
//                                         </Typography>
//                                     )}
//                                 <form onSubmit={handleSubmit}>
//                                 <Box padding={5} margin="auto" display="flex" flexDirection="column">
//                                     <Button type="submit" sx={{ mt: 3 }} variant="contained">
//                                         Next (Confirm)
//                                     </Button>
//                                 </Box>
//                                 </form>
//                             </Box>
//                         </Box>
//                     </Box>
//                 </>
//             ) : (
//                 <Typography textAlign="center" padding={5}>
//                     Loading event details...
//                 </Typography>
//             )}
//         </div>
//     );
//     };
// export default Booking;


///////////////////////////////////////////////


import { Box, Button, Typography, TextField } from '@mui/material';
import { getEventDetails, isSeatCategory } from 'api-helpers/api-helpers';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
dayjs.locale('pl');
dayjs.extend(require("dayjs/plugin/localizedFormat"));
dayjs.extend(require("dayjs/plugin/relativeTime"));

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const Booking = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [seatCategoryInfo, setSeatCategoryInfo] = useState([]);

    const { handleSubmit, control } = useForm({
        defaultValues: {
            seatNumber: "",
        }
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await getEventDetails(id);
                if (data && data.event) {
                    setEvent(data.event);
                    const categoryInfo = await isSeatCategory(data.event.idevent);
                    setSeatCategoryInfo(Array.isArray(categoryInfo) ? categoryInfo : [categoryInfo]);
                }
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };
        fetchEvent();
    }, [id]);

    const onSubmit = (data) => {
        navigate('/confirm', {
            state: {
                event: id,
                eventName: event.name,
                seatCategoryInfo,
                seatNumber: data.seatNumber,
                date: data.date,
                start_date: event.start_date,
                end_date: event.end_date,
                numberOfTickets: data.number_of_ticket
            }
        });
    };

    return (
        <div>
            {event ? (
                <>
                    <Typography padding={3} fontFamily="fantasy" variant="h4" textAlign={"center"}>
                        Book Tickets for Event: {event.name}
                    </Typography>
                    <Box display="flex" justifyContent="center">
                        <Box display="flex" flexDirection="column" paddingTop={3} width="50%" marginRight="auto">
                            <img width="80%" height="300px" src={event.photo} alt={event.name} />
                            <Box width="80%" marginTop={3} padding={2}>
                                <Typography paddingTop={2}>{event.description}</Typography>
                                <Typography fontWeight="bold" marginTop={1}>
                                    Liczba dostępnych miejsc: {event.number_of_ticket}
                                </Typography>
                                <Typography fontWeight="bold" marginTop={1}>
                                    Data: {formatDate(event.start_date)} - {formatDate(event.end_date)}
                                </Typography>
                                <Typography fontWeight="bold" marginTop={1}>
                                    Godzina: {formatTime(event.start_date)} - {formatTime(event.end_date)}
                                </Typography>
                                <Typography fontWeight="bold" marginTop={1}>
                                    Czas trwania: {dayjs(event.end_date).from(dayjs(event.start_date), true)}
                                </Typography>
                                <Typography paddingTop={2}>
                                    Informacje kontaktowe: {event.contact_info}
                                </Typography>
                                <Typography paddingTop={2}>
                                    Podział miejsc: {event.is_seat_categorized ? "Tak" : "Nie"}
                                </Typography>
                                {event.is_seat_categorized && (
                                    <Box paddingTop={2}>
                                        <Typography fontWeight="bold">Seat Category Info:</Typography>
                                        {seatCategoryInfo.map((category, index) => (
                                            <Typography key={index}>
                                                {category.name} - Cena: {category.price} zł
                                            </Typography>
                                        ))}
                                    </Box>
                                )}
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Box padding={5} margin="auto" display="flex" flexDirection="column">
                                        <Button type="submit" sx={{ mt: 3 }} variant="contained">
                                            Next (Confirm)
                                        </Button>
                                    </Box>
                                </form>
                            </Box>
                        </Box>
                    </Box>
                </>
            ) : (
                <Typography textAlign="center" padding={5}>
                    Loading event details...
                </Typography>
            )}
        </div>
    );
};

export default Booking;
