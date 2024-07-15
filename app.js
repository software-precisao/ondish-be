const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();

const Pedido = require("./models/tb_pedido");
const ItensPedido = require("./models/tb_itens_pedido");

const Restaurante = require("./models/tb_restaurante");
const Pratos = require("./models/tb_pratos");
const Opcoes = require("./models/tb_opcoes");
const Avaliacao = require("./models/tb_avaliacao");
const Cozinha = require("./models/tb_cozinha_restaurante");
const ItensPedidoOpcoes = require("./models/tb_itens_pedido_opcoes");
const Fotos = require("./models/tb_foto_pratos");
const Bebidas = require("./models/tb_bebidas");
const FotosBebidas = require("./models/tb_foto_bebidas");
const Usuarios = require("./models/tb_usuarios");
const Mesa = require("./models/tb_mesa");
const Sala = require("./models/tb_sala");


const { swaggerUi, specs } = require("./swaggerConfig");

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
  foreignKey: "id_bebidas",
  as: "fotos",
});


//Pedidos

Pedido.hasMany(ItensPedido, {
  foreignKey: "id_pedido",
  as: "itens_pedido",
});

ItensPedido.belongsTo(Pedido, {
  foreignKey: "id_pedido",
  as: "pedido",
});

ItensPedido.belongsTo(Pratos, {
  foreignKey: "id_prato",
  as: "prato",
});

ItensPedido.belongsTo(Bebidas, {
  foreignKey: "id_bebida",
  as: "bebida",
});

ItensPedido.belongsToMany(Opcoes, {
  through: ItensPedidoOpcoes,
  as: 'opcoes',
  foreignKey: 'id_item_pedido',
});

Opcoes.belongsToMany(ItensPedido, {
  through: ItensPedidoOpcoes,
  as: 'itens_pedido',
  foreignKey: 'id_opcao',
});

Pedido.belongsTo(Usuarios, {
  foreignKey: "id_user",
  as: "usuario",
});

Pedido.belongsTo(Restaurante, {
  foreignKey: "id_restaurante",
  as: "restaurante",
});

Pedido.belongsTo(Sala, {
  foreignKey: "id_sala",
  as: "sala",
});

Pedido.belongsTo(Mesa, {
  foreignKey: "id_mesa",
  as: "mesa",
});

// Rotas
const rotaLogin = require("./routes/login");
const rotaUser = require("./routes/usuario");
const rotaNivel = require("./routes/nivel");
const rotaStatus = require("./routes/status");
const rotaEmail = require("./routes/email");
const rotaCozinha = require("./routes/cozinha");
const rotaRestaurante = require("./routes/restaurante");
const rotaCoordenadas = require("./routes/coordenadas");
const rotaToken = require("./routes/token");
const rotaPratos = require("./routes/pratos");
const rotaBebidas = require("./routes/bebidas");
const rotaAvaliacao = require("./routes/avaliacao");
const rotaCozinhaRestaurante = require("./routes/cozinha_restaurante");
const rotaPedido = require("./routes/pedido");
const rotaSala = require("./routes/sala");
const rotaMesa = require("./routes/mesa");
const rotaFuncionarios = require("./routes/funcionarios");
const rotaPagamento = require("./routes/pagamento");

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

syncModels();

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
