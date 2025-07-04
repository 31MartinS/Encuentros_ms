const express = require("express");
const router = express.Router();
const controller = require("../controllers/eventoController");

router.get("/", controller.getAll);
router.post("/", controller.create);
router.put("/:id", controller.update);

module.exports = router;
