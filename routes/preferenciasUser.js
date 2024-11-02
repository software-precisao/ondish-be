const express = require("express");
const PreferenciasUsuarioController = require("../controller/preferenciasUserController");

const router = express.Router();

router.put("/editar/:id_user", PreferenciasUsuarioController.atualizarPreferencias);

module.exports = router;
