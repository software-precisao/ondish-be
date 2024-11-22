const axios = require("axios");

const sendPushNotification = async (expoToken, title, body, image) => {
  try {
    const message = {
      to: expoToken,
      sound: "default",
      title: title,
      body: body,
      data: { withSome: "data" },
    };

    if (image) {
      message.image = image;
    }

    const response = await axios.post(
      "https://exp.host/--/api/v2/push/send",
      message,
      {
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Push Notification Result:", response.data);
  } catch (error) {
    console.error("Erro ao enviar notificação push:", error.message);
  }
};

module.exports = { sendPushNotification };
