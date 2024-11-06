const express = require("express");
const promocaoController = require("../controller/promocaoController");

const router = express.Router();

router.get("/", promocaoController.listarPromocoes);
router.post("/usar-promocao", promocaoController.aplicarPromocao);
router.put("/edit/:id_promocao", promocaoController.atualizarPromocao);
router.delete("/delete/:id_promocao", promocaoController.excluirPromocao);
router.post('/aplicar', promocaoController.criarPromocao);


module.exports = router;
