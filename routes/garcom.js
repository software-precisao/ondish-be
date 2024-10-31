const express = require("express");
const router = express.Router();
const chamadoController = require("../controller/garcomController");

router.post("/chamar", chamadoController.chamarGarcom);

router.put("/edit/:id_chamado", chamadoController.atualizarStatusChamado);

router.put("/edit-status/:id_chamado", chamadoController.editarStatusChamado);

router.get("/", chamadoController.listarChamados);

router.get("/mesa/:id_mesa", chamadoController.buscarChamadosPorMesa);

router.get("/restaurante/:id_restaurante", chamadoController.buscarChamadosPorRestaurante);

router.delete("/delete/:id_chamado", chamadoController.excluirChamado);


module.exports = router;
