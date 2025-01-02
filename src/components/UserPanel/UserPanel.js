import React, { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import UserOrders from "./UserOrders";
import AdminPanel from "./AdminPanel";
import EventCreatorPanel from "./EventCreatorPanel";
import axios from 'axios';

// import ZakupioneBilety from "./ZakupioneBilety"; // przykładowy komponent
// import DaneUzytkownika from "./DaneUzytkownika"; // przykładowy komponent
import "bootstrap/dist/css/bootstrap.min.css";

const UserPanel = () => {
  const [activeTab, setActiveTab] = useState("UserInfo");
  const [adminPanelPrivilege, setAdminPanelPrivilege] = useState(false);
  const [eventCreatorPanelPrivilege, setEventCreatorPanelPrivilege] = useState(false);
  const [privilegeError, setPrivilegeError] = useState(null); // Stan do przechowywania błędu logowania
  
  // Funkcja sprawdzająca uprawnienia
  const checkPrivileges = async () => {
    const token = sessionStorage.getItem('token');

    try {
      const token = sessionStorage.getItem('token');

       // Sprawdzenie uprawnienia do "admin_panel"
       const adminResponse = await axios.get("api/rbac/checkPrivliges/admin_panel", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("adminResponse");
      if(adminResponse && adminResponse.status == 200){
        console.log(adminResponse);
        setAdminPanelPrivilege(adminResponse.data.accessGranted);
      }
      
    } catch (error) {
      console.error("Błąd podczas sprawdzania uprawnień:", error);
    }
    try{
      // Sprawdzenie uprawnienia do "event_creator_panel"
      const eventResponse = await axios.get("api/rbac/checkPrivliges/event_creator_panel", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("eventResponse");
      if(eventResponse && eventResponse.status == 200){
        console.log(eventResponse);
        setEventCreatorPanelPrivilege(eventResponse.data.accessGranted);
      }
    }catch (error) {
      console.error("Błąd podczas sprawdzania uprawnień:", error);
    }
  };

  // Sprawdzanie uprawnień przy ładowaniu komponentu
  useEffect(() => {
    checkPrivileges();
  }, []);
  
  // Funkcja renderująca zawartość na podstawie aktywnej zakładki
  const renderTabContent = () => {
    switch (activeTab) {
      case "UserInfo":
        return <UserInfo />;
      case "ZakupioneBilety":
        return <UserOrders />;
      case "PanelAdministratora":
        return <AdminPanel />;
        // return <div>Brak zawartości PanelAdministratora</div>;
      case "PanelTwórcyWydarzeń":
        return <EventCreatorPanel />
        // return <div>Brak zawartości PanelTwórcyWydarzeń</div>;
      
      default:
        return null;
    }
  };

  axios.interceptors.response.use(
    //dla kodów 200 przekazuje dalej
    (response) => response,
    async (error) => {
      //sprawdza czy kody błędów zostały zdefiniowane i je obsługuje
      if (error.response && error.response.status === 403) {
        if (error.response.data.msg === "Access denied") {
          setPrivilegeError("Brak dostępu");
        } 
      }
    }
  );
  return (
    <div id="panel" className="container mt-5">
      <div id="wybórpodpaneli">
        <ul className="nav nav-tabs">
        <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "UserInfo" ? "active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("UserInfo");
              }}
            >
              Informacje o użytkowniku
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${
                activeTab === "ZakupioneBilety" ? "active" : ""
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("ZakupioneBilety");
              }}
            >
              Zakupione Bilety
            </a>
          </li>

          {adminPanelPrivilege && (
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "PanelAdministratora" ? "active" : ""
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("PanelAdministratora");
                }}
              >
                Panel Administratora
              </a>
            </li>
          )}
          {eventCreatorPanelPrivilege && (
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "PanelTwórcyWydarzeń" ? "active" : ""
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("PanelTwórcyWydarzeń");
                }}
              >
                Panel Twórcy Wydarzeń
              </a>
            </li>
          )}
          
              {/* moderatora nie mamy, lecz zostawiam na zaś */}
          {/* <li className="nav-item">
            <a
              className={`nav-link ${
                activeTab === "PanelModeratora" ? "active" : ""
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("PanelModeratora");
              }}
            >
              Panel Moderatora
            </a>
          </li> */}
          

        </ul>
      </div>

      <div id="podpanel" className="mt-3">
        {renderTabContent()}
      </div>
      <footer style={{ height: "100px", backgroundColor: "#ffffff" }}></footer>
    </div>
  );

  //   return (
  //     <div id="panel">
  //       <div id="wybórpodpaneli">
  //         <ul className="nav nav-tabs">
  //           <li className="nav-item">
  //             <button onClick={() => setActiveTab("ZakupioneBilety")}>
  //               Zakupione Bilety
  //             </button>
  //           </li>
  //           <li className="nav-item">
  //             <button onClick={() => setActiveTab("DaneUzytkownika")}>
  //               Dane Użytkownika
  //             </button>
  //           </li>
  //           <li className="nav-item">
  //             <button onClick={() => setActiveTab("UserInfo")}>
  //               Informacje o użytkowniku
  //             </button>
  //           </li>
  //         </ul>
  //       </div>
  //       <div id="podpanel">
  //       {renderTabContent()}
  //       </div>
  //     </div>
  //     // <div id="panel">
  //     //   <div id="wybórpodpaneli">
  //     //     {/* Zakładki */}
  //     //
  //     //
  //     //   </div>
  //     //   <div id="podpanel">
  //     //     {/* Renderowanie zawartości aktywnej zakładki */}
  //     //
  //     //   </div>
  //     // </div>
  //     // <div id="panel">
  //     //     <div id="wybórpodpaneli">
  //     //         {/* <Zakupionebilety></Zakupionebilety>
  //     //         <DaneUżytkownika></DaneUżytkownika>
  //     //         <PanelTwórcyEventów></PanelTwórcyEventów>
  //     //         <PanelAdministratora></PanelAdministratora> */}
  //     //     </div>
  //     //
  //     // </div>
  //   );
};
export default UserPanel;
