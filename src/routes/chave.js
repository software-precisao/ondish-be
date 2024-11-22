const express = require("express");
const router = express.Router();
const chaveController = require("../controller/chaveController");

router.get("/", chaveController.getChaves);

router.get("/:id", chaveController.getChaveById);

router.post("/cadastrar", chaveController.createChave);

router.put("/editar/:id", chaveController.updateChaveProd);

router.delete("/deletar/:id", chaveController.deleteChave);

module.exports = router;
