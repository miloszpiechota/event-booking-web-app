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
                backgroundImage: "linear-gradient(to top, #4A79D9, #5C8BD9)",
                borderRadius: "1rem",
              }}
            >
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase" style={{ color: "#ffffff" }}>
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
                              backgroundColor: "#ffffff",
                              borderColor: "#5C8BD9",
                              borderWidth: "2px",
                              borderRadius: "0.75rem",
                              paddingLeft: "1rem",
                              paddingRight: "1rem",
                            },
                          }}
                          InputLabelProps={{
                            style: {
                              color: "#4A79D9",
                            },
                          }}
                          InputProps={{
                            style: {
                              color: "#4A79D9",
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
                              backgroundColor: "#ffffff",
                              borderColor: "#5C8BD9",
                              borderWidth: "2px",
                              borderRadius: "0.75rem",
                              paddingLeft: "1rem",
                              paddingRight: "1rem",
                            },
                          }}
                          InputLabelProps={{
                            style: {
                              color: "#4A79D9",
                            },
                          }}
                          InputProps={{
                            style: {
                              color: "#4A79D9",
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
                    style={{
                      backgroundColor: "#011C40",
                      color: "#ffffff",
                    }}
                    fullWidth
                    onClick={handleSubmit(onSubmit)}
                    className="btn btn-outline-light btn-lg px-5"
                  >
                    Login
                  </Button>
  
                  <div>
                    <p className="mb-0" style={{ marginTop: "10px" }}>
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
  
//   return (
//     <section className="vh-100" style={{ backgroundColor: "#ffffff" }}>
//   <div className="container py-5 h-100">
//     <div className="row d-flex justify-content-center align-items-center h-100">
//       <div className="col-12 col-md-8 col-lg-6 col-xl-5">
//         <div
//           className="card text-white"
//           style={{
//             backgroundImage: "linear-gradient(to top, #4A79D9, #5C8BD9)",
//             borderRadius: "1rem",
//           }}
//         >
//           <div className="card-body p-5 text-center">
//             <div className="mb-md-5 mt-md-4 pb-5">
//               <h2 className="fw-bold mb-2 text-uppercase" style={{ color: "#fff" }}>
//                 Login
//               </h2>
//               <p className="text-white-50 mb-5">Please enter your login and password!</p>

//               {/* Email Field */}
//               <div className="form-outline form-white mb-4">
//                 <Controller
//                   control={control}
//                   name="email"
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       label="Email"
//                       type="email"
//                       fullWidth
//                       error={!!errors.email}
//                       helperText={errors.email?.message}
//                       variant="outlined"
//                       color="primary"
//                       className="form-control form-control-lg"
//                       inputProps={{
//                         style: {
//                           backgroundColor: "#ffffff", // Tło dla pola
//                           borderColor: "#388e3c", // Kolor obwódki
//                           borderWidth: "2px",
//                           borderRadius: "0.75rem", // Zaokrąglone rogi
//                           paddingLeft: "1rem", // Margines wewnętrzny
//                           paddingRight: "1rem", // Margines wewnętrzny
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           color: "#388e3c", // Kolor napisu label
//                         },
//                       }}
//                       InputProps={{
//                         style: {
//                           color: "#388e3c", // Kolor tekstu w polu
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               </div>

//               {/* Password Field */}
//               <div className="form-outline form-white mb-4">
//                 <Controller
//                   control={control}
//                   name="password"
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       label="Password"
//                       type="password"
//                       fullWidth
//                       error={!!errors.password}
//                       helperText={errors.password?.message}
//                       variant="outlined"
//                       color="primary"
//                       className="form-control form-control-lg"
//                       inputProps={{
//                         style: {
//                           backgroundColor: "#ffffff", // Tło dla pola
//                           borderColor: "#388e3c", // Kolor obwódki
//                           borderWidth: "2px",
//                           borderRadius: "0.75rem", // Zaokrąglone rogi
//                           paddingLeft: "1rem", // Margines wewnętrzny
//                           paddingRight: "1rem", // Margines wewnętrzny
//                         },
//                       }}
//                       InputLabelProps={{
//                         style: {
//                           color: "#388e3c", // Kolor napisu label
//                         },
//                       }}
//                       InputProps={{
//                         style: {
//                           color: "#388e3c", // Kolor tekstu w polu
//                         },
//                       }}
//                     />
//                   )}
//                 />
//               </div>

//               <p className="small mb-5 pb-lg-2">
//                 <a className="text-white-50" href="#!">Forgot password?</a>
//               </p>

//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="success" // Zielony kolor przycisku
//                 fullWidth
//                 onClick={handleSubmit(onSubmit)}
//                 className="btn btn-outline-light btn-lg px-5"
//                 style={{ marginBottom: "10px" }} // Zmniejszenie odległości
//               >
//                 Login
//               </Button>

//               <div>
//               <p className="mb-0" style={{ marginTop: "10px" }}> {/* Mniejszy margines górny */}
//                 Don't have an account?{" "}
//                 <a href="/register" className="text-white-50 fw-bold">Sign Up</a>
//               </p>
//             </div>
//             </div>

            
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>

//   );
}
  

export default UserLogin;
