const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();
const { asistenciaService } = require("../config/services");

router.use(
  "/asistencias",
  createProxyMiddleware({
    target: asistenciaService,
    changeOrigin: true,
    pathRewrite: {
      "^/api/asistencias": "",
    },
  })
);

module.exports = router;
