
const twilio = require("twilio")
const axios = require("axios")

require("dotenv").config();


const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const client = twilio(accountSid, authToken);

exports.sendSms = async (to, body) => {
  if (!to || to.trim() === "") {
    console.error("Erro: Número de telefone não fornecido.");
    throw new Error("Número de telefone não fornecido.");
  }

  try {
    if (process.env.SMS_PROVIDER === "TWILIO") {
      await client.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      });
      console.log("SMS enviado com sucesso via Twilio para", to);
    } else if (process.env.SMS_PROVIDER === "API") {
      const response = await axios.post(process.env.SMS_URL, {
        key: process.env.SMS_TOKEN_API_KEY,
        number: to,
        template: body || "<#> Seu código de verificação é: {999-999}",
        expire: 180,
      });

      if (response.data.situacao === "OK") {
        console.log("✅ SMS enviado com sucesso via API:", response.data);
      } else {
        console.error("Erro ao enviar SMS via API:", response.data);
      }
    } else {
      console.error("Nenhum provedor de SMS configurado.");
    }
  } catch (error) {
    console.error("Erro ao enviar SMS:", error.message);
    throw error;
  }
};
