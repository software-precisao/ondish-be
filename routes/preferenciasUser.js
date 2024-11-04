const express = require("express");
const PreferenciasUsuarioController = require("../controller/preferenciasUserController");

const router = express.Router();

router.put("/editar/:id_user", PreferenciasUsuarioController.atualizarPreferencias);
router.get("/:id_user", PreferenciasUsuarioController.obterPreferencias);

module.exports = router;
