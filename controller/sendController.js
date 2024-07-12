const path = require('path');
const fs = require("fs").promises;
const nodemailer = require("nodemailer");
require('dotenv').config();

const enviarBoasVindas = async (req, res) => {
    const { email, nome } = req.body;
    try {
        const htmlFilePath = path.join(__dirname, '../template/welcome/index.html');
        let htmlContent = await fs.readFile(htmlFilePath, "utf8");

        htmlContent = htmlContent
            .replace("{{nome}}", nome)

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                ciphers: "TLSv1",
            },
        });

        let mailOptions = {
            from: `"Atendimento Ondish" ${process.env.EMAIL_FROM}`,
            to: email,
            subject: "✅ Conta criada com sucesso!",
            html: htmlContent,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Mensagem enviada: %s", info.messageId);
        res.send("Email enviado com sucesso!");
    } catch (error) {
        console.error("Erro ao enviar email: ", error);
        res.send("Erro ao enviar email.");
    }
};

module.exports = {
    enviarBoasVindas
}
