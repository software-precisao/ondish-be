const express = require("express");
const router = express.Router();
const motivoVisitaController = require("../controller/motivoVisitaController");

router.post("/cadastrar", motivoVisitaController.createMotivoVisita);

router.get("/:id_mesa", motivoVisitaController.getMotivoVisitaByMesa);

router.put("/editar/:id", motivoVisitaController.updateMotivoVisita);

router.delete("/delete/:id", motivoVisitaController.deleteMotivoVisita);

module.exports = router;
