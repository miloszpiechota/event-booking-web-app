import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../../api-helpers/api-helpers";
import axios from "axios";
// Define the schema for form validation
const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(1, "Password must be at least 1 characters")
    .required("Password is required"),
});

const UserLogin = () => {
  const [loginError, setLoginError] = useState(null); // Stan do przechowywania błędu logowania
  const [email, setEmailValue] = useState("");
  const [password, setPasswordValue] = useState("");

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "", // Początkowa wartość dla email
      password: "", // Początkowa wartość dla password
    },
  });

  if (sessionStorage["token"] != null) {
    //jeżeli użytkownik jest zalogowany, przekieruj do strony głównej
    navigate("/");
  }

  const onSubmit = async (data) => {
    try {
      //wyślij zapytanie do modułu obsługi logowania i odbierz token
      const { token, success, iduser } = await handleLogin(data.email, data.password);

      //dodaj token do sessionStorage i przekierój do strony głównej
      if (success && token) {
        console.log(token);
        console.log(iduser);
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("iduser", iduser);
        navigate("/");
      }
    } catch (error) {
      console.error("error: ", error.message);
    }
  };
  //funkcja do przechwytywania odpowiedzi i błędów przez axios
  axios.interceptors.response.use(
    //dla kodów 200 przekazuje dalej
    (response) => response,
    async (error) => {
      //sprawdza czy kody błędów zostały zdefiniowane i je obsługuje
      if (error.response && error.response.status === 401) {
        if (error.response.data.msg === "Email not found!") {
          setLoginError("Nie znaleziono podanego adresu email!");
        } else if (error.response.data.msg === "Incorrect password!") {
          setLoginError("Błędne hasło!");
        }
      }
    }
  );
  return (
    <section className="vh-100" style={{ backgroundColor: "#ffffff" }}>
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-12 col-md-8 col-lg-6 col-xl-5">
        <div
          className="card text-white"
          style={{
            backgroundImage: "linear-gradient(to top, rgb(76, 175, 80), rgb(102, 187, 106))",
            borderRadius: "1rem",
          }}
        >
          <div className="card-body p-5 text-center">
            <div className="mb-md-5 mt-md-4 pb-5">
              <h2 className="fw-bold mb-2 text-uppercase" style={{ color: "#fff" }}>
                Login
              </h2>
              <p className="text-white-50 mb-5">Please enter your login and password!</p>

              {/* Email Field */}
              <div className="form-outline form-white mb-4">
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
                      variant="outlined"
                      color="primary"
                      className="form-control form-control-lg"
                      inputProps={{
                        style: {
                          backgroundColor: "#ffffff", // Tło dla pola
                          borderColor: "#388e3c", // Kolor obwódki
                          borderWidth: "2px",
                          borderRadius: "0.75rem", // Zaokrąglone rogi
                          paddingLeft: "1rem", // Margines wewnętrzny
                          paddingRight: "1rem", // Margines wewnętrzny
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          color: "#388e3c", // Kolor napisu label
                        },
                      }}
                      InputProps={{
                        style: {
                          color: "#388e3c", // Kolor tekstu w polu
                        },
                      }}
                    />
                  )}
                />
              </div>

              {/* Password Field */}
              <div className="form-outline form-white mb-4">
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
                      color="primary"
                      className="form-control form-control-lg"
                      inputProps={{
                        style: {
                          backgroundColor: "#ffffff", // Tło dla pola
                          borderColor: "#388e3c", // Kolor obwódki
                          borderWidth: "2px",
                          borderRadius: "0.75rem", // Zaokrąglone rogi
                          paddingLeft: "1rem", // Margines wewnętrzny
                          paddingRight: "1rem", // Margines wewnętrzny
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          color: "#388e3c", // Kolor napisu label
                        },
                      }}
                      InputProps={{
                        style: {
                          color: "#388e3c", // Kolor tekstu w polu
                        },
                      }}
                    />
                  )}
                />
              </div>

              <p className="small mb-5 pb-lg-2">
                <a className="text-white-50" href="#!">Forgot password?</a>
              </p>

              <Button
                type="submit"
                variant="contained"
                color="success" // Zielony kolor przycisku
                fullWidth
                onClick={handleSubmit(onSubmit)}
                className="btn btn-outline-light btn-lg px-5"
                style={{ marginBottom: "10px" }} // Zmniejszenie odległości
              >
                Login
              </Button>

              <div>
              <p className="mb-0" style={{ marginTop: "10px" }}> {/* Mniejszy margines górny */}
                Don't have an account?{" "}
                <a href="/register" className="text-white-50 fw-bold">Sign Up</a>
              </p>
            </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

  );

  // return (
  //   <div>
  //     <h2>User Login</h2>
  //     {loginError && (
  //       <div className="alert alert-danger" role="alert">
  //         {loginError}
  //       </div>
  //     )}{" "}
  //     {/* Display login error */}
  //     <form onSubmit={handleSubmit(onSubmit)}>
  //       <Controller
  //         control={control}
  //         name="email"
  //         render={({ field }) => (
  //           <TextField
  //             {...field}
  //             label="Email"
  //             type="email"
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

  //       <Button type="submit" variant="contained" color="primary" fullWidth>
  //         Login
  //       </Button>
  //     </form>
  //   </div>
  // );
};

export default UserLogin;

////////////////////////////////////////////////////////////////

// dopracuj, form logowania na wzór: https://mui.com/toolpad/core/react-sign-in-page/ (ostatniego na stronie)

// import React, { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import * as Yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import {
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   OutlinedInput,
//   InputAdornment,
//   Link,
//   IconButton,
// } from "@mui/material";
// import AccountCircle from "@mui/icons-material/AccountCircle";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";

// // Schema do walidacji formularza
// const schema = Yup.object().shape({
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
// });

// const UserLogin = () => {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const [loginError, setLoginError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleClickShowPassword = () => setShowPassword(!showPassword);
//   const handleMouseDownPassword = (event) => event.preventDefault();

//   const onSubmit = (data) => {
//     const loginData = {
//       email: data.email,
//       password: data.password,
//     };

//     fetch("http://localhost:3000/api/users/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(loginData),
//     })
//       .then((response) => response.json())
//       .then((result) => {
//         if (result.success) {
//           alert("Login successful!");
//         } else {
//           setLoginError(result.msg || "Login failed, please check your credentials.");
//         }
//       })
//       .catch((error) => {
//         setLoginError("Error: " + error.message);
//       });
//   };

//   return (
//     <div>
//       <h2>User Login</h2>
//       {loginError && <div style={{ color: "red" }}>{loginError}</div>}

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Controller
//           control={control}
//           name="email"
//           render={({ field }) => (
//             <TextField
//               {...field}
//               label="Email"
//               type="email"
//               fullWidth
//               required
//               size="small"
//               error={!!errors.email}
//               helperText={errors.email?.message}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <AccountCircle />
//                   </InputAdornment>
//                 ),
//               }}
//               variant="outlined"
//             />
//           )}
//         />

//         <Controller
//           control={control}
//           name="password"
//           render={({ field }) => (
//             <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
//               <InputLabel size="small" htmlFor="outlined-adornment-password">
//                 Password
//               </InputLabel>
//               <OutlinedInput
//                 {...field}
//                 id="outlined-adornment-password"
//                 type={showPassword ? "text" : "password"}
//                 size="small"
//                 error={!!errors.password}
//                 endAdornment={
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={handleClickShowPassword}
//                       onMouseDown={handleMouseDownPassword}
//                       edge="end"
//                       size="small"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 }
//                 label="Password"
//               />
//               <p style={{ color: "red" }}>{errors.password?.message}</p>
//             </FormControl>
//           )}
//         />

//         <Button type="submit" variant="contained" color="primary" fullWidth sx={{ my: 2 }}>
//           Login
//         </Button>

//         <Link href="/" variant="body2">
//           Sign up
//         </Link>
//       </form>
//     </div>
//   );
// };

// export default UserLogin;
