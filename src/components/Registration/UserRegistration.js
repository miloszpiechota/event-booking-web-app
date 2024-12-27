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
} from "@mui/material";
import { getAllCities } from "../../api-helpers/api-helpers";


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
  const [cities, setCities] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // const [isCitiesLoaded, setIsCitiesLoaded] = useState(false); // Track if cities are loaded

  useEffect(() => {
    const fetchCitiesData = async () => {
      try {
        const [citiesData] = await Promise.all([getAllCities()]);
        setCities(citiesData);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchCitiesData();
    // fetch(
    //   "https://inzynierka-event-app-backend.azurewebsites.net/api/cities/read"
    // )
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setCities(data); // Just populate cities
    //   })
    //   .catch((err) => console.log("Error fetching cities:", err));
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

  const groupedCities = cities.reduce((acc, city) => {
    const countryName = city.country.name_country;
    if (!acc[countryName]) {
      acc[countryName] = [];
    }
    acc[countryName].push(city);
    return acc;
  }, {});

  console.log(cities);  // Sprawdź strukturę danych
console.log(groupedCities);
  return (
    <section className="vh-100" style={{ backgroundColor: "#ffffff" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card text-white"
              style={{
                backgroundImage: "linear-gradient(to top, #4A79D9, #5C8BD9)",
                borderRadius: "1rem",
              }}
            >
              <div className="card-body p-5 text-center">
                <h2 className="fw-bold mb-2 text-uppercase" style={{ color: "#ffffff" }}>
                  User Registration
                </h2>
                <p className="text-white-50 mb-5">Please fill in the form to create an account!</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* First Name */}
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
                        variant="outlined"
                        inputProps={{
                          style: {
                            backgroundColor: "#ffffff",
                            borderColor: "#5C8BD9",
                            borderWidth: "2px",
                            borderRadius: "0.75rem",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                          },
                        }}
                        InputLabelProps={{
                          style: { color: "#4A79D9" },
                        }}
                        InputProps={{
                          style: { color: "#4A79D9" },
                        }}
                        className="form-control form-control-lg mb-3"
                      />
                    )}
                  />
  
                  {/* Second Name */}
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
                        variant="outlined"
                        inputProps={{
                          style: {
                            backgroundColor: "#ffffff",
                            borderColor: "#5C8BD9",
                            borderWidth: "2px",
                            borderRadius: "0.75rem",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                          },
                        }}
                        InputLabelProps={{
                          style: { color: "#4A79D9" },
                        }}
                        InputProps={{
                          style: { color: "#4A79D9" },
                        }}
                        className="form-control form-control-lg mb-3"
                      />
                    )}
                  />
  
                  {/* Surname */}
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
                        variant="outlined"
                        inputProps={{
                          style: {
                            backgroundColor: "#ffffff",
                            borderColor: "#5C8BD9",
                            borderWidth: "2px",
                            borderRadius: "0.75rem",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                          },
                        }}
                        InputLabelProps={{
                          style: { color: "#4A79D9" },
                        }}
                        InputProps={{
                          style: { color: "#4A79D9" },
                        }}
                        className="form-control form-control-lg mb-3"
                      />
                    )}
                  />
  
                  {/* Email */}
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
                        variant="outlined"
                        inputProps={{
                          style: {
                            backgroundColor: "#ffffff",
                            borderColor: "#5C8BD9",
                            borderWidth: "2px",
                            borderRadius: "0.75rem",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                          },
                        }}
                        InputLabelProps={{
                          style: { color: "#4A79D9" },
                        }}
                        InputProps={{
                          style: { color: "#4A79D9" },
                        }}
                        className="form-control form-control-lg mb-3"
                      />
                    )}
                  />
  
                  {/* Password */}
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
                        variant="outlined"
                        inputProps={{
                          style: {
                            backgroundColor: "#ffffff",
                            borderColor: "#5C8BD9",
                            borderWidth: "2px",
                            borderRadius: "0.75rem",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                          },
                        }}
                        InputLabelProps={{
                          style: { color: "#4A79D9" },
                        }}
                        InputProps={{
                          style: { color: "#4A79D9" },
                        }}
                        className="form-control form-control-lg mb-3"
                      />
                    )}
                  />
  
                  {/* Phone Number */}
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
                        variant="outlined"
                        inputProps={{
                          style: {
                            backgroundColor: "#ffffff",
                            borderColor: "#5C8BD9",
                            borderWidth: "2px",
                            borderRadius: "0.75rem",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                          },
                        }}
                        InputLabelProps={{
                          style: { color: "#4A79D9" },
                        }}
                        InputProps={{
                          style: { color: "#4A79D9" },
                        }}
                        className="form-control form-control-lg mb-3"
                      />
                    )}
                  />
  
                  {/* Address */}
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
                        variant="outlined"
                        inputProps={{
                          style: {
                            backgroundColor: "#ffffff",
                            borderColor: "#5C8BD9",
                            borderWidth: "2px",
                            borderRadius: "0.75rem",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                          },
                        }}
                        InputLabelProps={{
                          style: { color: "#4A79D9" },
                        }}
                        InputProps={{
                          style: { color: "#4A79D9" },
                        }}
                        className="form-control form-control-lg mb-3"
                      />
                    )}
                  />
  
                  {/* Zip Code */}
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
                        variant="outlined"
                        inputProps={{
                          style: {
                            backgroundColor: "#ffffff",
                            borderColor: "#5C8BD9",
                            borderWidth: "2px",
                            borderRadius: "0.75rem",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                          },
                        }}
                        InputLabelProps={{
                          style: { color: "#4A79D9" },
                        }}
                        InputProps={{
                          style: { color: "#4A79D9" },
                        }}
                        className="form-control form-control-lg mb-3"
                      />
                    )}
                  />
  
                  {/* City */}
                  <Controller
                    control={control}
                    name="selectedCity"
                    defaultValue=""
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.selectedCity}>
                        <InputLabel style={{ color: "#4A79D9" }}>City</InputLabel>
                        <Select
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          style={{
                            backgroundColor: "#ffffff",
                            borderColor: "#5C8BD9",
                            borderWidth: "2px",
                            borderRadius: "0.75rem",
                            color: "#4A79D9",
                          }}
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

                  <Button
                    type="submit"
                    variant="contained"
                    style={{
                      backgroundColor: "#011C40",
                      color: "#ffffff",
                      marginTop: "20px",
                    }}
                    fullWidth
                  >
                    Sign Up
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  
  // return (
  //   <div>
  //     <h2>User Registration</h2>
  //     <form onSubmit={handleSubmit(onSubmit)}>
  //       <Controller
  //         control={control}
  //         name="name"
  //         render={({ field }) => (
  //           <TextField
  //             {...field}
  //             label="First Name"
  //             fullWidth
  //             error={!!errors.name}
  //             helperText={errors.name?.message}
  //           />
  //         )}
  //       />

  //       <Controller
  //         control={control}
  //         name="secondName"
  //         render={({ field }) => (
  //           <TextField
  //             {...field}
  //             label="Second Name"
  //             fullWidth
  //             error={!!errors.secondName}
  //             helperText={errors.secondName?.message}
  //           />
  //         )}
  //       />

  //       <Controller
  //         control={control}
  //         name="surname"
  //         render={({ field }) => (
  //           <TextField
  //             {...field}
  //             label="Surname"
  //             fullWidth
  //             error={!!errors.surname}
  //             helperText={errors.surname?.message}
  //           />
  //         )}
  //       />

  //       <Controller
  //         control={control}
  //         name="email"
  //         render={({ field }) => (
  //           <TextField
  //             {...field}
  //             label="Email"
  //             fullWidth
  //             error={!!errors.email}
  //             helperText={errors.email?.message}
  //           />
  //         )}
  //       />

  //       <Controller
  //         control={control}
  //         name="password"
  //         render={({ field }) => (
  //           <TextField
  //             {...field}
  //             label="Password"
  //             type="password"
  //             fullWidth
  //             error={!!errors.password}
  //             helperText={errors.password?.message}
  //           />
  //         )}
  //       />

  //       <Controller
  //         control={control}
  //         name="phonenumber"
  //         render={({ field }) => (
  //           <TextField
  //             {...field}
  //             label="Phone Number"
  //             fullWidth
  //             error={!!errors.phonenumber}
  //             helperText={errors.phonenumber?.message}
  //           />
  //         )}
  //       />

  //       <Controller
  //         control={control}
  //         name="street"
  //         render={({ field }) => (
  //           <TextField
  //             {...field}
  //             label="Street"
  //             fullWidth
  //             error={!!errors.street}
  //             helperText={errors.street?.message}
  //           />
  //         )}
  //       />

  //       <Controller
  //         control={control}
  //         name="zipcode"
  //         render={({ field }) => (
  //           <TextField
  //             {...field}
  //             label="Zipcode"
  //             fullWidth
  //             error={!!errors.zipcode}
  //             helperText={errors.zipcode?.message}
  //           />
  //         )}
  //       />
  //       <Controller
  //         control={control}
  //         name="selectedCity"
  //         defaultValue="" // Make sure the default value is always an empty string.
  //         render={({ field }) => (
  //           <FormControl fullWidth error={!!errors.selectedCity}>
  //             <InputLabel>City</InputLabel>
  //             <Select
  //               {...field}
  //               label="City"
  //               value={field.value || ""} // Ensure value is always either a string or an empty string
  //               onChange={(e) => field.onChange(e.target.value)} // Ensure controlled behavior
  //             >
  //               <MenuItem value="">
  //                 <em>None</em>
  //               </MenuItem>
  //               {cities.map((city) => (
  //                 <MenuItem key={city.idcity} value={city.idcity}>
  //                   {city.city}
  //                 </MenuItem>
  //               ))}
  //             </Select>
  //             <FormHelperText>{errors.selectedCity?.message}</FormHelperText>
  //           </FormControl>
  //         )}
  //       />

  //       <Button type="submit" variant="contained" color="primary" fullWidth>
  //         Sign Up
  //       </Button>
  //     </form>
  //   </div>
  // );
};

export default UserRegistration;
