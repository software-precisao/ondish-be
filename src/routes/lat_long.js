const express = require("express");
const router = express.Router();
const latLongController = require("../controller/latlongController");

router.get("/", latLongController.buscarTodasCoordenadas);

router.get("/:id", latLongController.buscarCoordenadasPorId);

router.put("/editar/:id", latLongController.atualizarCoordenada);

router.post("/cadastrar", latLongController.adicionarCoordenadas);

router.put("/edit/:id/status", latLongController.atualizarStatus);

router.delete("/deletar/:id", latLongController.removerCoordenada);

module.exports = router;
