const express = require("express");
const router = express.Router();
const statusMesaController = require("../controller/statusMesaController");

router.post("/cadastrar", statusMesaController.criarStatusMesa);
router.get("/", statusMesaController.obterTodosStatusMesa);
router.get("/:id_status_mesa", statusMesaController.obterStatusMesaPorId);
router.put("/editar/:id_status_mesa", statusMesaController.atualizarStatusMesa);
router.delete("/deletar/:id_status_mesa", statusMesaController.deletarStatusMesa);

module.exports = router;
