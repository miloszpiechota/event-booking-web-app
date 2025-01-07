import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Box, // Import Box for better layout control
  Typography, // Import Typography for headings
} from "@mui/material";

// Define the schema for form validation
const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  secondName: Yup.string().required("Second name is required"),
  surname: Yup.string().required("Surname is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  phonenumber: Yup.string()
    .matches(/^\d{9}$/, "Phone number must be 9 digits")
    .required("Phone number is required"),
  street: Yup.string().required("Street is required"),
  zipcode: Yup.string().required("Zipcode is required"),
  selectedCity: Yup.string().required("City is required"),
});

const UserRegistration = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [cities, setCities] = useState([]);
  // const [isCitiesLoaded, setIsCitiesLoaded] = useState(false); // Track if cities are loaded

  useEffect(() => {
    fetch(
      "https://inzynierka-event-app-backend.azurewebsites.net/api/cities/read"
    )
      .then((response) => response.json())
      .then((data) => {
        setCities(data); // Just populate cities
      })
      .catch((err) => console.log("Error fetching cities:", err));
  }, []); // Fetch cities when the component mounts
  // Fetch cities when the component mounts

  const onSubmit = (data) => {
    // Prepare the data to be sent to the backend
    const userData = {
      ...data,
      iduser_type: 1, // Set to user type (you may adjust this logic)
      phonenumber: parseInt(data.phonenumber),
      idcity: parseInt(data.selectedCity), // Use the selected city ID
    };

    // Send data to backend to create the user
    fetch("https://inzynierka-event-app-backend.azurewebsites.net/api/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("User registered successfully!");
        } else {
          alert("Error: " + result.msg);
        }
      })
      .catch((error) => alert("Error: " + error.message));
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#ffffff' }}>
      <Box sx={{ width: { xs: '90%', md: '50%', lg: '40%' } }}> {/* Responsive width */}
        <Box
          sx={{
            bgcolor: 'linear-gradient(to top, #4A79D9, #5C8BD9)',
            borderRadius: '1rem',
            p: 5, // Consistent padding
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom> {/* Using Typography component */}
            User Registration
          </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField
              {...field}
              label="First Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="secondName"
          render={({ field }) => (
            <TextField
              {...field}
              label="Second Name"
              fullWidth
              error={!!errors.secondName}
              helperText={errors.secondName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="surname"
          render={({ field }) => (
            <TextField
              {...field}
              label="Surname"
              fullWidth
              error={!!errors.surname}
              helperText={errors.surname?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="phonenumber"
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone Number"
              fullWidth
              error={!!errors.phonenumber}
              helperText={errors.phonenumber?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="street"
          render={({ field }) => (
            <TextField
              {...field}
              label="Street"
              fullWidth
              error={!!errors.street}
              helperText={errors.street?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="zipcode"
          render={({ field }) => (
            <TextField
              {...field}
              label="Zipcode"
              fullWidth
              error={!!errors.zipcode}
              helperText={errors.zipcode?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="selectedCity"
          defaultValue="" // Make sure the default value is always an empty string.
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.selectedCity}>
              <InputLabel>City</InputLabel>
              <Select
                {...field}
                label="City"
                value={field.value || ""} // Ensure value is always either a string or an empty string
                onChange={(e) => field.onChange(e.target.value)} // Ensure controlled behavior
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city.idcity} value={city.idcity}>
                    {city.city}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.selectedCity?.message}</FormHelperText>
            </FormControl>
          )}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign Up
        </Button>
        </form>
        </Box>
      </Box>
    </Box>
  );
};

export default UserRegistration;