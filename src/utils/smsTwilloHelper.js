const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const client = twilio(accountSid, authToken);

const sendSms = async (to, body) => {
  if (!to || to.trim() === "") {
    console.error("Erro: Número de telefone não fornecido.");
    throw new Error("Número de telefone não fornecido.");
  }

  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log("SMS enviado com sucesso para", to);
    return message;
  } catch (error) {
    console.error("Erro ao enviar SMS:", error);
    throw error;
  }
};

module.exports = {
  sendSms,
};
