// const admin = require("firebase-admin");
const axios = require("axios");
require("dotenv").config();

// Hàm gửi thông báo push đến một thiết bị cụ thể
const sendNotification = async () => {
  const serverKey = process.env.SERVER_KEY; // Server key from Firebase console
  const deviceToken = [
    "foU5AHmpSN-igDQ4x-OTir:APA91bHtxPqx68yEueeQNCQ9kDhMSHzHSXNhUIe9_i4MP1E_W25UJs8slEecYCwKZKNfiTrIJ2-t16tINdEDL2Zfeq8gUtt5quDvdtwZjnTQRlGNDAPBYOJ854nYYket4NZJpGfTRd0O",
    "etoTKnBRRQuwEsZx03QvQb:APA91bFUYlykpRbroS-Hsr9IMdqTd2lV186obeNgiqwCwXMn9ECAgLELW_RkbmuC6K8Vu6ep5tmmRyMwUyrbS2S77jPtn5_7bhlJToO0mHdSX556fz2FwQ254QE04VTQ92Oi3a1Q8tqr",
  ];
  const datapayload = {
    // to: deviceToken,
    registration_ids : deviceToken,
    notification: {
      title: "New notification in your app",
      body: "Someone is waiting for your approval!",
    },
    priority: "high",
    time_to_live: 3600,
  };

  await axios
    .post("https://fcm.googleapis.com/fcm/send", datapayload, {
      headers: {
        Authorization: `key=${serverKey}`,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  sendNotification,
};
