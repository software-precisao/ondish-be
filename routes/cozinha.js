const express = require("express");
const router = express.Router();
const cozinhaController = require("../controller/cozinhaController");

router.post("/cadastrar", cozinhaController.criarCozinha);
router.get("/", cozinhaController.obterCozinhas);
router.post("/cozinha/:id_cozinha", cozinhaController.obterCozinhaPorId);
router.post("/delete/:id_cozinha", cozinhaController.deletarCozinha);


module.exports = router;
