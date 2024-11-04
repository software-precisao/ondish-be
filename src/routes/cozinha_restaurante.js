const express = require("express");
const router = express.Router();
const cozinhaController = require("../controller/cozinhaRestauranteController");

router.post("/cadastrar", cozinhaController.criarCozinha);
router.get("/", cozinhaController.buscarTodasCozinhas);
router.get("/restaurante/:id_restaurante", cozinhaController.buscarCozinhasPorRestaurante);
router.get("/cozinha/:id_cozinha", cozinhaController.buscarCozinhaPorId);
router.patch("/editar/:id_cozinha", cozinhaController.atualizarCozinha);
router.delete("/delete/:id_cozinha", cozinhaController.deletarCozinha);

module.exports = router;
    