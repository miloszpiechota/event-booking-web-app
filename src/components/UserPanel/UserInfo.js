import React, { useState, useEffect } from "react";
import { getAllCities, getUserInfo, getUserTypes } from "../../api-helpers/api-helpers";

const UserInfo = () => {
  const [user, setUser] = useState(null);
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
    const fetchUserData = async () => {
      try {
        const iduser = sessionStorage.getItem("iduser");
        const [userData] = await Promise.all([getUserInfo(iduser)]);

        setUser(userData);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchCitiesData();
    fetchUserTypesData();
    fetchUserData();
    
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
  const groupedCities = cities.reduce((acc, city) => {
    const countryName = city.country.name_country; // Pobieramy nazwę kraju z obiektu country
    if (!acc[countryName]) {
      acc[countryName] = [];
    }
    acc[countryName].push(city);
    return acc;
  }, {});

  return (
    <section>
      <dl className="collumn">
        <dt className="col-sm-2">ID użytkownika</dt>
        <dd className="col-sm-10">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
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
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              value={user.name}
              disabled={!isEditable} // Jeśli tryb edycji jest włączony, pole jest aktywne
              onChange={(e) => (user.name = e.target.value)} // Przykładowa aktualizacja
            />
          </div>
        </dd>

        <dt className="col-sm-2">Drugie imię</dt>
        <dd className="col-sm-10">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              value={user.second_name}
              disabled={!isEditable}
              onChange={(e) => (user.second_name = e.target.value)} // Przykładowa aktualizacja
            />
          </div>
        </dd>

        <dt className="col-sm-2">Nazwisko</dt>
        <dd className="col-sm-10">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              value={user.surname}
              disabled={!isEditable}
              onChange={(e) => (user.surname = e.target.value)} // Przykładowa aktualizacja
            />
          </div>
        </dd>

        {/* <dt className="col-sm-2">iduser_type</dt>
        <dd className="col-sm-10">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              value={user.iduser_type}
              disabled
              onChange={(e) => (user.email = e.target.value)} // Przykładowa aktualizacja
            />
          </div>
        </dd> */}

        <dt className="col-sm-2">Typ użytkownika</dt>
        <dd className="col-sm-10">
          <div className="input-group mb-3">
            <select
              className="form-control"
              value={user.iduser_type || ""}  // Początkowa wartość miasta
              disabled    // Edytowalne tylko w trybie edycji
              onChange={(e) => {
                // Aktualizacja miasta w danych użytkownika
                setUser({
                  ...user,
                  idusertype: Number(e.target.value),
                });
              }}
            >
              <option value="" disabled>Select user type</option>
              {user_types.map((type) => (
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
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              value={user.email}
              disabled
              onChange={(e) => (user.email = e.target.value)} // Przykładowa aktualizacja
            />
          </div>
        </dd>

        <dt className="col-sm-2">Numer telefonu</dt>
        <dd className="col-sm-10">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              value={user.phonenumber}
              disabled={!isEditable}
              onChange={(e) => (user.email = e.target.value)} // Przykładowa aktualizacja
            />
          </div>
        </dd>

        <dt className="col-sm-2">Kod pocztowy</dt>
        <dd className="col-sm-10">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              value={user.zipcode}
              disabled={!isEditable}
              onChange={(e) => (user.email = e.target.value)} // Przykładowa aktualizacja
            />
          </div>
        </dd>

        <dt className="col-sm-2">Ulica</dt>
        <dd className="col-sm-10">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              value={user.street}
              disabled={!isEditable}
              onChange={(e) => (user.email = e.target.value)} // Przykładowa aktualizacja
            />
          </div>
        </dd>

        {/* <dt className="col-sm-2">city</dt>
        <dd className="col-sm-10">
          <div className="input-group mb-3">
            <select
              className="form-control"
              value={user.idcity || ""} // Początkowa wartość miasta
              disabled={!isEditable} // Edytowalne tylko w trybie edycji
              onChange={(e) => {
                // Aktualizacja miasta w danych użytkownika
                setUser({
                  ...user,
                  idcity: Number(e.target.value),
                });
              }}
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.idcity} value={city.idcity}>
                  {city.city}
                </option>
              ))}
            </select>
          </div>
        </dd> */}
         <dt className="col-sm-2">Miasto</dt>
        <dd className="col-sm-10">
          <div className="input-group mb-3">
            <select
              className="form-control"
              value={user.idcity || ""}  // Początkowa wartość miasta
              disabled={!isEditable}    // Edytowalne tylko w trybie edycji
              onChange={(e) => {
                // Aktualizacja miasta w danych użytkownika
                setUser({
                  ...user,
                  idcity: Number(e.target.value),
                });
              }}
            >
              <option value="" disabled>Wybierz miasto</option>
              {Object.keys(groupedCities).map((country) => (
                <optgroup key={country} label={country}>
                  {groupedCities[country].map((city) => (
                    <option key={city.idcity} value={city.idcity}>
                      {city.city}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </dd>

        <dt className="col-sm-2">Hasło</dt>
        <dd className="col-sm-10">
          <div className="input-group mb-3">
            <input
              type="password"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              value={user.password}
              disabled
              onChange={(e) => (user.email = e.target.value)} // Przykładowa aktualizacja
            />
          </div>
        </dd>
      </dl>

      {/* Przyciski do przełączania trybu edycji i aktualizacji */}
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-primary" onClick={toggleEditMode}>
          {isEditable ? "Zablokuj edycję" : "Edytuj"}
        </button>
        <button className="btn btn-primary">
          Zmień hasło
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
  );

  //   return (
  //     <section>
  //       <dl className="collumn">
  //         <dt className="col-sm-2">iduser</dt>
  //         <dd className="col-sm-10">
  //           <div className="input-group mb-3">
  //             <input
  //               type="text"
  //               className="form-control"
  //               aria-label="Sizing example input"
  //               aria-describedby="inputGroup-sizing-default"
  //               value={user.iduser}
  //               disabled
  //             />
  //           </div>
  //         </dd>
  //         <dt className="col-sm-2">name</dt>
  //         <dd className="col-sm-10">
  //           <div className="input-group mb-3">
  //             <input
  //               type="text"
  //               className="form-control"
  //               aria-label="Sizing example input"
  //               aria-describedby="inputGroup-sizing-default"
  //               value={user.name}
  //               disabled
  //             />
  //           </div>
  //         </dd>
  //         <dt className="col-sm-2">second_name</dt>
  //         <dd className="col-sm-10">
  //           <div className="input-group mb-3">
  //             <input
  //               type="text"
  //               className="form-control"
  //               aria-label="Sizing example input"
  //               aria-describedby="inputGroup-sizing-default"
  //               value={user.second_name}
  //               disabled
  //             />
  //           </div>
  //         </dd>
  //         <dt className="col-sm-2">surname</dt>
  //         <dd className="col-sm-10">
  //           <div className="input-group mb-3">
  //             <input
  //               type="text"
  //               className="form-control"
  //               aria-label="Sizing example input"
  //               aria-describedby="inputGroup-sizing-default"
  //               value={user.surname}
  //               disabled
  //             />
  //           </div>
  //         </dd>
  //         <dt className="col-sm-2">email</dt>
  //         <dd className="col-sm-10">
  //           <div className="input-group mb-3">
  //             <input
  //               type="text"
  //               className="form-control"
  //               aria-label="Sizing example input"
  //               aria-describedby="inputGroup-sizing-default"
  //               value={user.email}
  //               disabled
  //             />
  //           </div>
  //         </dd>
  //       </dl>
  //     </section>
  //   );
};
export default UserInfo;
