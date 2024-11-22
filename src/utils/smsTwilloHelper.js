const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const client = twilio(accountSid, authToken);

 const sendSms = async () => {
  if (!to || to.trim() === "") {
    console.error("Erro: Número de telefone não fornecido.");
    throw new Error("Número de telefone não fornecido.");
  }

  try {
    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log("SMS enviado com sucesso para", to);
  } catch (error) {
    console.error("Erro ao enviar SMS:", error);
    throw error;
  }
};


module.exports = {
    sendSms
  }