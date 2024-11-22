const twilio = require("twilio");
const axios = require("axios");

require("dotenv").config();

 const sendSms = async (phone_number) => {
  try {
    const response = await axios.post(`${process.env.SMS_URL}`, {
      key: process.env.SMS_TOKEN_API_KEY,
      number: phone_number,
      template: "Seu código de verificação é: {999-999}",
      expire: 180,
    });

    if (response.data.situacao == "OK") {
      console.log("✅ SMS enviado com sucesso:", response.data);

      return response.data;
    } else {
      console.error("Erro ao enviar SMS:", response.data);
    }
  } catch (error) {
    console.error("Erro ao enviar SMS via SMS Token:", error);
  }
};

module.exports = {
  sendSms
}