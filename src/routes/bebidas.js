const express = require("express");
const router = express.Router();
const bebidasController = require("../controller/bebidasController");
const { uploadArray } = require("../helpers/img-uploader");

router.post(
  "/cadastro",
  uploadArray,
  (req, res, next) => {
    next();
  },
  bebidasController.criarBebidas
);
router.get("/restaurante/:id", bebidasController.buscarBebidasPorRestaurante);
router.get("/", bebidasController.obterBebidas);
router.delete("/delete/:id_bebida", bebidasController.deletarBebida);

module.exports = router;
