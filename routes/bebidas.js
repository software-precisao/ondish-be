const express = require("express");
const router = express.Router();
const bebidasController = require("../controller/bebidasController");
const { uploadArray } = require("../helpers/img-uploader");


// Rota para buscar todas as bebidas com foto por ID do restaurante
router.post(
  "/cadastro",
  uploadArray,
  (req, res, next) => {
    next();
  },
  bebidasController.criarBebidas
);
router.get("/restaurante/:id", bebidasController.buscarBebidasPorRestaurante);

module.exports = router;
