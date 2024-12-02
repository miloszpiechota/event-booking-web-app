import React, { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import UserOrders from "./UserOrders";
// import ZakupioneBilety from "./ZakupioneBilety"; // przykładowy komponent
// import DaneUzytkownika from "./DaneUzytkownika"; // przykładowy komponent
import "bootstrap/dist/css/bootstrap.min.css";

const UserPanel = () => {
  const [activeTab, setActiveTab] = useState("UserInfo");

  // Funkcja renderująca zawartość na podstawie aktywnej zakładki
  const renderTabContent = () => {
    switch (activeTab) {
      case "ZakupioneBilety":
        return <UserOrders />;
      // return <ZakupioneBilety />;
      case "DaneUzytkownika":
        return <div>Brak zawartości...</div>;
      // return <DaneUzytkownika />;
      case "UserInfo":
        return <UserInfo />;
      default:
        return null;
    }
  };
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
          <li className="nav-item">
            <a
              className={`nav-link ${
                activeTab === "DaneUzytkownika" ? "active" : ""
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("DaneUzytkownika");
              }}
            >
              Dane Użytkownika
            </a>
          </li>
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
