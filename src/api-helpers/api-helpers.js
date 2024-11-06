import axios from 'axios';
export const getAllEvents = async () => {
    const res = await axios
    .get('api/events/read')
    .catch((err)=>console.log(err));

    if(!res || res.status !== 200){
         return console.log("No data");
    }
    const data = await res.data;
    console.log("getAllEvents");
    console.log(data);
    console.log("getAllEvents data.event");
    console.log(data.event);
    return data;
};



  // export const getEventDetails = async(id) => {
  //   const res = await axios
  //     .get(`api/events/read/${id}`)
  //     .catch((err)=>console.log(err));

  //   if(!res || res.status !== 200) {
  //     return console.log("Unexpected Error");
  //   }

  //   if(!res || res.status !== 200){
  //        return console.log("No data");
  //   }
  //   const data = await res.data;
  //   console.log("getEventById");
  //   console.log(data);
  //   console.log("getEventById data.event");
  //   console.log(data.event);
  //   return data;
  // };
  export const getEventDetails = async (id) => {
    try {
        const response = await axios.get(`/api/events/read/${id}`);  // Correct the URL path
        return response.data;
    } catch (error) {
        console.error("Error fetching event details:", error);
        throw error;
    }
};



export const newBooking = async(data) => {
  const res = await axios
  .post('/booking', {
    seatNumber: data.seatNumber,
    date: data.date,
    event: data.event,
    user: localStorage.getItem("userId"),
  })
  .catch((err)=>console.log(err));

  if(!res || res.status !== 200) {
    return console.log("Unexpected Error");
  }
  const resData = await res.data;
  return resData;
}

