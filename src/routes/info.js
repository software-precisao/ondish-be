const express = require("express");
const router = express.Router();
const appInfoController = require("../controller/infoController");

router.get("/", appInfoController.getAppInfo);

router.post("/cadastrar", appInfoController.createAppInfo);

router.put("/edit/:id_info", appInfoController.updateAppInfo);

router.delete("/delete/:id", appInfoController.deleteAppInfo);

module.exports = router;
