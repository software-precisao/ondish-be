const express = require("express");
const router = express.Router();
const sobremesaController = require("../controller/sobremesaController");
const { uploadArray } = require("../helpers/img-uploader");

router.post(
  "/cadastro",
  uploadArray,
  (req, res, next) => {
    next();
  },
  sobremesaController.criarSobremesa
);
router.get("/:id", sobremesaController.buscarSobremesasPorRestaurante);
router.get("/", sobremesaController.obterSobremesas);
router.delete("/delete/:id_sobremesa", sobremesaController.deletarSobremesa);

module.exports = router;
