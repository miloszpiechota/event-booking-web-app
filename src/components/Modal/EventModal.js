import React from "react";
import { Modal, Box, Typography, Grid, Button, Paper } from "@mui/material";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import style from "./modalStyle";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";

const EventModal = ({ open, onClose, event, comments }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-event-title"
      aria-describedby="modal-event-description"
    >
      <Box sx={style}>
        {/* Tytuł */}
        <Typography id="modal-event-title" variant="h6" component="h2">
          Szczegóły wydarzenia: {event ? event.name : "Ładowanie..."}
        </Typography>

        {/* Górna sekcja dwukolumnowa */}
        <Box sx={{ mt: 2 }}>
          {event && event.event_location ? (
            <Grid container spacing={2}>
              {/* Lewa kolumna */}
              <Grid item xs={6}>
                <Typography variant="subtitle1">Informacje ogólne</Typography>
                <p>
                  <strong>Nazwa wydarzenia:</strong> {event.name}
                </p>
                <p>
                  <strong>Lokalizacja:</strong> {event.event_location.name}
                </p>
                <p>
                  <strong>Opis:</strong> {event.description || "Brak opisu"}
                </p>
              </Grid>

              {/* Prawa kolumna */}
              <Grid item xs={6}>
                <Typography variant="subtitle1">Terminy</Typography>
                <p>
                  <strong>Data rozpoczęcia:</strong>{" "}
                  {event.start_date
                    ? format(
                        new Date(event.start_date),
                        "dd MMMM yyyy, HH:mm",
                        {
                          locale: pl,
                        }
                      )
                    : "Błędna data"}
                </p>
                <p>
                  <strong>Data zakończenia:</strong>{" "}
                  {event.end_date
                    ? format(new Date(event.end_date), "dd MMMM yyyy, HH:mm", {
                        locale: pl,
                      })
                    : "Błędna data"}
                </p>
              </Grid>
            </Grid>
          ) : (
            "Ładowanie..."
          )}
        </Box>

        {/* Sekcja komentarzy */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1">Komentarze</Typography>
          <Paper
            elevation={3}
            sx={{
              maxHeight: "200px",
              overflowY: "auto",
              p: 2,
              border: "1px solid #ddd",
            }}
          >
            {event && event.comments && event.comments.length > 0 ? (
              event.comments.map((comment, index) => (
                <TableRow key={index}>
                  <TableCell>{comment.iduser}</TableCell>
                  <TableCell>{comment.comment}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  Brak komentarzy
                </TableCell>
              </TableRow>
            )}
          </Paper>
        </Box>

        {/* Sekcja przycisków */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="contained" color="primary">
            Edytuj
          </Button>
          <Button variant="contained" color="error">
            Usuń
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EventModal;

// import React from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import { format } from "date-fns";
// import { pl } from "date-fns/locale";
// import style from "./modalStyle";

// const commentsContainerStyle = {
//   maxHeight: 200, // Stała wysokość dla sekcji komentarzy
//   overflowY: "scroll", // Włączenie przewijania w pionie
//   border: "1px solid #ccc", // Ramka
//   marginTop: 16, // Odstęp od innych sekcji
//   padding: 8,
// };

// const EventModal = ({ open, onClose, event, comments }) => {
//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       aria-labelledby="modal-event-title"
//       aria-describedby="modal-event-description"
//     >
//       <Box sx={style}>
//         <Typography id="modal-event-title" variant="h6" component="h2">
//           Szczegóły wydarzenia: {event ? event.name : "Ładowanie..."}
//         </Typography>
//         <Typography id="modal-event-description" sx={{ mt: 2 }}>
//           {event && event.event_location ? (
//             <div>
//               <p>Nazwa wydarzenia: {event.name}</p>
//               <p>Lokalizacja: {event.event_location.name}</p>
//               <p>
//                 Data rozpoczęcia:{" "}
//                 {event.start_date
//                   ? format(new Date(event.start_date), "dd MMMM yyyy, HH:mm", {
//                       locale: pl,
//                     })
//                   : "Błędna data"}
//               </p>
//               <p>
//                 Data zakończenia:{" "}
//                 {event.end_date
//                   ? format(new Date(event.end_date), "dd MMMM yyyy, HH:mm", {
//                       locale: pl,
//                     })
//                   : "Błędna data"}
//               </p>

//               {/* Sekcja komentarzy */}
//               <Box sx={commentsContainerStyle}>
//                 <Typography variant="subtitle1">Komentarze:</Typography>
//                 <TableContainer component={Paper}>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Autor</TableCell>
//                         <TableCell>Komentarz</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {event.comments && event.comments.length > 0 ? (
//                         event.comments.map((comment, index) => (
//                           <TableRow key={index}>
//                             <TableCell>{comment.iduser}</TableCell>
//                             <TableCell>{comment.comment}</TableCell>
//                           </TableRow>
//                         ))
//                       ) : (
//                         <TableRow>
//                           <TableCell colSpan={2} align="center">
//                             Brak komentarzy
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </Box>
//             </div>
//           ) : (
//             "Ładowanie..."
//           )}
//         </Typography>
//       </Box>
//     </Modal>
//   );
// };

// export default EventModal;
// import React from "react";
// import { Modal, Box, Typography } from "@mui/material";
// import style from "./modalStyle";
// import { format } from "date-fns";
// import { pl } from "date-fns/locale";
// const EventModal = ({ open, onClose, event }) => {
//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       aria-labelledby="modal-event-title"
//       aria-describedby="modal-event-description"
//     >
//       <Box sx={style}>
//         <Typography id="modal-event-title" variant="h6" component="h2">
//           Szczegóły wydarzenia: {event ? event.name : "Ładowanie..."}
//         </Typography>
//         <Typography id="modal-event-description" sx={{ mt: 2 }}>
//           {event && event.event_location ? (
//             <div>
//               <p>Nazwa wydarzenia: {event.name}</p>
//               <p>Lokalizacja: {event.event_location.name}</p>
//               <p>
//                 Data rozpoczęcia:
//                 {event && event.start_date
//                   ? format(new Date(event.start_date), "dd MMMM yyyy, HH:mm", {
//                       locale: pl,
//                     })
//                   : "Błędna data"}
//               </p>
//               <p>
//                 Data zakończenia:{" "}
//                 {event && event.end_date
//                   ? format(new Date(event.end_date), "dd MMMM yyyy, HH:mm", {
//                       locale: pl,
//                     })
//                   : "Błędna data"}
//               </p>
//             </div>
//             //tu możesz dodać to okno
//           ) : (
//             "Ładowanie..."
//           )}
//         </Typography>
//       </Box>
//     </Modal>
//   );
// };

// export default EventModal;
