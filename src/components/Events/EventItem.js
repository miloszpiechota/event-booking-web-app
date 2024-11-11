import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, CardMedia, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

const EventItem = ({ id, name, startDate, endDate, description, numberOfTickets, posterUrl, contactInfo, isSeatCategorized, idstatus_type }) => {
  return (
      <Card sx={{ maxWidth: 345, margin: 2, ":hover": { boxShadow: "10px 10px 20px #ccc" } }}>
          <CardActionArea>
              <CardMedia sx={{ height: 140 }} image={posterUrl} />
              <CardContent>
                  <Typography variant="h5">{name}</Typography>
                  <Typography variant="body2" color="text.secondary">{description}</Typography>
              </CardContent>
              <Button
                  variant="contained"
                  fullWidth
                  component={Link}
                  to={`/booking/${id}`} // Link to Booking page with event id
                  sx={{
                      margin: "auto",
                      bgcolor: "#2b2d42",
                      ":hover": { bgcolor: "#121217" },
                  }}
                  size="medium"
              >
                  Book
              </Button>
          </CardActionArea>
      </Card>
  );
};

export default EventItem;

