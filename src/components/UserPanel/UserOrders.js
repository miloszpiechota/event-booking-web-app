import React, { useState, useEffect } from "react";
import { getUserOrders, getUserOrder } from "../../api-helpers/api-helpers";
// import UserOrderDetails from "./UserOrderDetails";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleShowDetails = async (idorder) => {
    try {
      const userOrder = await getUserOrder(idorder);
      setSelectedOrder(userOrder);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const iduser = sessionStorage.getItem("iduser");

        const [userOrders] = await Promise.all([getUserOrders(iduser)]);
        console.log(userOrders);
        setOrders(userOrders);
        sessionStorage.setItem("orders", userOrders);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchUserOrders();
  }, []);


  return (
    
    <section>
      
      <div className="modal">
        <div className="overlay"></div>
        <div className="modal-content">
          <p>CZESC</p>
          <button className="close-modal" onClick={closeModal}>Close</button>
        </div>    
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>idorder</th>
            <th>data</th>
            <th>iduser</th>
            <th>total_amount</th>
            <th>total_tax_amount</th>
            {/* <th></th> */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.idorder}>
              <td>{order.idorder}</td>
              <td>{order.data}</td>
              <td>{order.iduser}</td>
              <td>{order.total_amount}</td>
              <td>{order.total_tax_amount}</td>
              <td><button className="btn btn-primary" onClick={() => handleShowDetails(order.idorder)}>Szczegóły</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </section>
  );
};
export default UserOrders;
