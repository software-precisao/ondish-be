const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();

const Restaurante = require("./src/models/tb_restaurante");
const Pratos = require("./src/models/tb_pratos");
const Opcoes = require("./src/models/tb_opcoes");
const Avaliacao = require("./src/models/tb_avaliacao");
const Cozinha = require("./src/models/tb_cozinha_restaurante");
const Fotos = require("./src/models/tb_foto_pratos");
const Bebidas = require("./src/models/tb_bebidas");
const FotosBebidas = require("./src/models/tb_foto_bebidas");
const { swaggerUi, specs } = require("./swaggerConfig");
const Sobremesa = require("./src/models/tb_sobremesas");
const FotoSobremesas = require("./src/models/tb_foto_sobremesas");
const Sala = require("./src/models/tb_sala");
const SalaConvidado = require("./src/models/tb_sala_convidado");

Restaurante.hasMany(Pratos, {
  foreignKey: "id_restaurante",
  as: "pratos",
});

Pratos.hasMany(Opcoes, {
  foreignKey: "id_pratos",
  as: "opcoes",
});

Restaurante.hasMany(Cozinha, {
  foreignKey: "id_restaurante",
  as: "cozinha_restaurante",
});

Restaurante.hasMany(Avaliacao, {
  foreignKey: "id_restaurante",
  as: "avaliacoes",
});

Pratos.hasMany(Fotos, {
  foreignKey: "id_pratos",
  as: "fotos",
});

Bebidas.hasMany(FotosBebidas, {
  foreignKey: "id_bebida",
  as: "fotos",
});

Sobremesa.hasMany(FotoSobremesas, {
  foreignKey: "id_sobremesa",
  as: "fotos",
});

Restaurante.hasMany(Bebidas, {
  foreignKey: "id_restaurante",
  as: "bebidas",
});

Restaurante.hasMany(Sobremesa, {
  foreignKey: "id_restaurante",
  as: "sobremesa",
});

Pratos.hasMany(Cozinha, {
  foreignKey: "id_cozinha_restaurante",
  as: "cozinha",
});

Sala.hasMany(SalaConvidado, {
  foreignKey: "id_sala",
  as: "salaConvidados",
});

SalaConvidado.belongsTo(Sala, {
  foreignKey: "id_sala",
  as: "salas",
});

// Rotas
const rotaLogin = require("./src/routes/login");
const rotaUser = require("./src/routes/usuario");
const rotaNivel = require("./src/routes/nivel");
const rotaStatus = require("./src/routes/status");
const rotaEmail = require("./src/routes/email");
const rotaCozinha = require("./src/routes/cozinha");
const rotaRestaurante = require("./src/routes/restaurante");
const rotaCoordenadas = require("./src/routes/coordenadas");
const rotaToken = require("./src/routes/token");
const rotaPratos = require("./src/routes/pratos");
const rotaBebidas = require("./src/routes/bebidas");
const rotaAvaliacao = require("./src/routes/avaliacao");
const rotaCozinhaRestaurante = require("./src/routes/cozinha_restaurante");
const rotaPedido = require("./src/routes/pedido");
const rotaSala = require("./src/routes/sala");
const rotaMesa = require("./src/routes/mesa");
const rotaFuncionarios = require("./src/routes/funcionarios");
const rotaPagamento = require("./src/routes/pagamento");
const rotaAtividadeSala = require("./src/routes/atividadeSala");
const rotaAtividadePedido = require("./src/routes/atividadePedido");
const rotaSobremesa = require("./src/routes/sobremesa");
const rotaStatusMesa = require("./src/routes/statusMesa");
const rotaLogs = require("./src/routes/logs");
const rotaBoasVindas = require("./src/routes/boasVindas");
const rotaLatLong = require("./src/routes/lat_long");
const rotaCartao = require("./src/routes/cartaoPagamento");
const rotaInfo = require("./src/routes/info");
const rotaGarcom = require("./src/routes/garcom");
const rotaPreferenciaUser = require("./src/routes/preferenciasUser");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/public", express.static("public"));

// Configurações de CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET, OPTIONS"
    );
    return res.status(200).send({});
  }
  next();
});

const syncModels = async () => {
  try {
    await conn.sync({ force: true });
    console.log("Models synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing models:", error);
  }
};

//syncModels();

const swaggerOptions = {
  customCss: `
      .swagger-ui .topbar img { content: url('./public/assets/images/logo.png'); height: 40px; }
    `,
  customSiteTitle: "API Ondish",
  customfavIcon: "/assets/images/favicon.ico",
  customCssUrl: "./assets/css/swagger-logo.css",
};

// Endpoints
app.use("/login", rotaLogin);
app.use("/usuario", rotaUser);
app.use("/nivel", rotaNivel);
app.use("/status", rotaStatus);
app.use("/send", rotaEmail);
app.use("/cozinha", rotaCozinha);
app.use("/restaurante", rotaRestaurante);
app.use("/coordenadas", rotaCoordenadas);
app.use("/token", rotaToken);
app.use("/prato", rotaPratos);
app.use("/mesa", rotaMesa);
app.use("/avaliacao", rotaAvaliacao);
app.use("/bebidas", rotaBebidas);
app.use("/cozinha-restaurante", rotaCozinhaRestaurante);
app.use("/pedido", rotaPedido);
app.use("/sala", rotaSala);
app.use("/funcionario", rotaFuncionarios);
app.use("/payment", rotaPagamento);
app.use("/atividade-sala", rotaAtividadeSala);
app.use("/atividade-pedido", rotaAtividadePedido);
app.use("/sobremesa", rotaSobremesa);
app.use("/status-mesa", rotaStatusMesa);
app.use("/logs", rotaLogs);
app.use("/boas-vindas", rotaBoasVindas);
app.use("/lat", rotaLatLong);
app.use("/cartao", rotaCartao);
app.use("/info", rotaInfo);
app.use("/chamar-garcom", rotaGarcom);
app.use("/preferencias-usuario", rotaPreferenciaUser);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

app.get("/test", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use((req, res, next) => {
  const erro = new Error("Rota não encontrada");
  erro.status = 404;
  next(erro);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    erro: {
      mensagem: error.message,
    },
  });
});

module.exports = app;
