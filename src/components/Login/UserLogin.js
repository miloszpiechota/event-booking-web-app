import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button } from "@mui/material";

// Define the schema for form validation
const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const UserLogin = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loginError, setLoginError] = useState(""); // To store login errors if any

  const onSubmit = (data) => {
    // Make a request to your backend to authenticate the user
    const loginData = {
      email: data.email,
      password: data.password,
    };

    // Example API call to authenticate
    fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("Login successful!");
          // Perform any additional logic such as redirecting or storing auth token
        } else {
          setLoginError(result.msg || "Login failed, please check your credentials.");
        }
      })
      .catch((error) => {
        setLoginError("Error: " + error.message);
      });
  };

  return (
    <div>
      <h2>User Login</h2>
      {loginError && <div style={{ color: "red" }}>{loginError}</div>} {/* Display login error */}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
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

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </div>
  );
};

export default UserLogin;
