import React, { useState, useEffect } from "react";
import { getAllCities, getUserInfo, getUserTypes } from "../../api-helpers/api-helpers";

import { Modal, Box, Typography } from '@mui/material';
import style from './modalStyle';
const UserModal = ({ open, onClose, user }) => {
    const [cities, setCities] = useState([]);
    const [isEditable, setIsEditable] = useState(false);
  const [user_types, setUserTypes] = useState([]);
    useEffect(() => {
      const fetchUserTypesData = async () => {
          try {
            const [userTypes] = await Promise.all([getUserTypes()]);
            console.log(userTypes);
            setUserTypes(userTypes);
          } catch (error) {
            console.error(error.message);
          }
        };
      const fetchCitiesData = async () => {
        try {
          const [citiesData] = await Promise.all([getAllCities()]);
          setCities(citiesData);
        } catch (error) {
          console.error(error.message);
        }
      };
      // const fetchUserData = async () => {
      //   try {
      //     const iduser = sessionStorage.getItem("iduser");
      //     const [userData] = await Promise.all([getUserInfo(iduser)]);
  
      //     setUser(userData);
      //   } catch (error) {
      //     console.error(error.message);
      //   }
      // };
      fetchCitiesData();
      fetchUserTypesData();
      // fetchUserData();
      
    }, []);
    if (!user) {
      // Jeżeli dane jeszcze nie zostały załadowane
      return <div>Loading...</div>;
    }
  
    // Funkcja do obsługi przycisku, który przełącza tryb edycji
    const toggleEditMode = () => {
      setIsEditable((prev) => !prev); // Zmiana trybu edycji
    };
  
    // Funkcja wywołująca aktualizację danych (przykład)
    const handleUpdate = () => {
      // Możesz tu dodać logikę do wysłania aktualnych danych do backendu
      //updateUserData(user);
    };
    const handleDelete = () => {
      // Możesz tu dodać logikę do wysłania aktualnych danych do backendu
      //updateUserData(user);
    };
    const groupedCities = cities.reduce((acc, city) => {
      const countryName = city.country.name_country; // Pobieramy nazwę kraju z obiektu country
      if (!acc[countryName]) {
        acc[countryName] = [];
      }
      acc[countryName].push(city);
      return acc;
    }, {});
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-user-title"
      aria-describedby="modal-user-description"
    >
      <Box sx={style}>
        <Typography id="modal-user-title" variant="h6" component="h2">
          Szczegóły użytkownika: {user ? user.name : 'Ładowanie...'}
        </Typography>
        <Typography id="modal-user-description" sx={{ mt: 2 }}>
          {user ? (
            <section>
              <dl className="collumn">
                <dt className="col-sm-2">ID użytkownika</dt>
                <dd className="col-sm-10">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      value={user.iduser}
                      disabled
                    />
                  </div>
                </dd>

                <dt className="col-sm-2">Imię</dt>
                <dd className="col-sm-10">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      value={user.name}
                      disabled={!isEditable}
                      onChange={(e) => (user.name = e.target.value)}
                    />
                  </div>
                </dd>

                <dt className="col-sm-2">Drugie imię</dt>
                <dd className="col-sm-10">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      value={user.second_name}
                      disabled={!isEditable}
                      onChange={(e) => (user.second_name = e.target.value)}
                    />
                  </div>
                </dd>

                <dt className="col-sm-2">Nazwisko</dt>
                <dd className="col-sm-10">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      value={user.surname}
                      disabled={!isEditable}
                      onChange={(e) => (user.surname = e.target.value)}
                    />
                  </div>
                </dd>

                <dt className="col-sm-2">Typ użytkownika</dt>
                <dd className="col-sm-10">
                  <div className="input-group mb-3">
                    <select
                      className="form-control"
                      value={user.iduser_type || ""}
                      disabled={!isEditable}
                      onChange={(e) => (user.iduser_type = Number(e.target.value))}
                    >
                      <option value="" disabled>Wybierz typ użytkownika</option>
                      {user.user_types?.map((type) => (
                        <option key={type.iduser_type} value={type.iduser_type}>
                          {type.name_type}
                        </option>
                      ))}
                    </select>
                  </div>
                </dd>

                <dt className="col-sm-2">Adres email</dt>
                <dd className="col-sm-10">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      value={user.email}
                      disabled
                    />
                  </div>
                </dd>

                <dt className="col-sm-2">Numer telefonu</dt>
                <dd className="col-sm-10">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      value={user.phonenumber}
                      disabled={!isEditable}
                      onChange={(e) => (user.phonenumber = e.target.value)}
                    />
                  </div>
                </dd>

                <dt className="col-sm-2">Kod pocztowy</dt>
                <dd className="col-sm-10">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      value={user.zipcode}
                      disabled={!isEditable}
                      onChange={(e) => (user.zipcode = e.target.value)}
                    />
                  </div>
                </dd>

                <dt className="col-sm-2">Miasto</dt>
                <dd className="col-sm-10">
                  <div className="input-group mb-3">
                    <select
                      className="form-control"
                      value={user.idcity || ""}
                      disabled={!isEditable}
                      onChange={(e) => (user.idcity = Number(e.target.value))}
                    >
                      <option value="" disabled>Wybierz miasto</option>
                      {Object.keys(user.groupedCities || {}).map((country) => (
                        <optgroup key={country} label={country}>
                          {user.groupedCities[country]?.map((city) => (
                            <option key={city.idcity} value={city.idcity}>
                              {city.city}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </dd>
              </dl>

              {/* Przyciski do przełączania trybu edycji, aktualizacji i usuwania */}
              <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-primary" onClick={toggleEditMode}>
                  {isEditable ? "Zablokuj edycję" : "Edytuj"}
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Usuń użytkownika
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleUpdate}
                  disabled={!isEditable}
                >
                  Zaktualizuj dane
                </button>
              </div>
            </section>
          ) : (
            "Ładowanie..."
          )}
        </Typography>
      </Box>
    </Modal>
  );
};

export default UserModal;
