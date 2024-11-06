import React, { useState } from "react";
import { Box, Button, Dialog, IconButton, TextField, Typography } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useNavigate } from "react-router-dom";

const UserLogin = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  // Funkcja obsługująca kliknięcie przycisku logowania
  const onButtonClick = () => {
    // Resetowanie błędów przed każdym kliknięciem
    setEmailError('');
    setPasswordError('');

    // Walidacja formularza
    if ("" === email) {
      setEmailError("Please enter your email");
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if ("" === password) {
      setPasswordError("Please enter a password");
      return;
    }

    if (password.length < 7) {
      setPasswordError("The password must be 8 characters or longer");
      return;
    }

    // Sprawdzenie, czy konto istnieje
    checkAccountExists(accountExists => {
      if (accountExists) {
        logIn();
      } else {
        if (window.confirm(`An account does not exist with this email address: ${email}. Do you want to create a new account?`)) {
          logIn(); // Zakładając, że logowanie jest powiązane z tworzeniem konta, po zaakceptowaniu
        }
      }
    });
  };

  // Sprawdzenie, czy konto istnieje
  const checkAccountExists = (callback) => {
    fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
    .then((response) => response.json())
    .then((data) => {
      callback(data?.userExists);
    })
    .catch((err) => console.error(err));
  };

  // Logowanie użytkownika
  const logIn = () => {
    fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === 'success') {
        localStorage.setItem("user", JSON.stringify({ email, token: data.token }));
        props.setLoggedIn(true);
        props.setEmail(email);
        navigate("/");  // Przekierowanie po udanym logowaniu
      } else {
        window.alert("Wrong email or password");
      }
    })
    .catch((err) => console.error(err));
  };

  return (
    <Dialog PaperProps={{ style: { borderRadius: 20 } }} open={true}>
      <Box sx={{ ml: 'auto', padding: 1 }}>
        <IconButton component="a" href="/">
          <CloseRoundedIcon />
        </IconButton>
      </Box>
      <Typography variant="h4" textAlign="center">
        Login
      </Typography>
      <form>
        <Box
          padding={6}
          display="flex"
          justifyContent="center"
          flexDirection="column"
          width={400}
          margin="auto"
          alignContent="center"
        >
          <TextField
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="Enter your email here"
            variant="standard"
            type="email"
            fullWidth
            error={!!emailError}
            helperText={emailError}
            margin="normal"
          />
          <TextField
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            placeholder="Enter your password here"
            variant="standard"
            type="password"
            fullWidth
            error={!!passwordError}
            helperText={passwordError}
            margin="normal"
          />
          <Button
            sx={{ mt: 2, borderRadius: 10, bgcolor: 'darkorange' }}
            onClick={onButtonClick}
            fullWidth
            variant="contained"
          >
            Log in
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default UserLogin;
