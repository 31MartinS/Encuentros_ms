const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();
const { asistenciaService } = require("../config/services");

router.use(
  "/",
  createProxyMiddleware({
    target: asistenciaService,
    changeOrigin: true,
  })
);

module.exports = router;
