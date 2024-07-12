const express = require("express");
const router = express.Router();
const emailController = require("../controller/sendController");

router.post("/nova-conta", emailController.enviarBoasVindas);

module.exports = router;
