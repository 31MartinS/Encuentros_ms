const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();
const { notificacionService } = require("../config/services");

router.use(
  "/notificaciones",
  createProxyMiddleware({
    target: notificacionService,
    changeOrigin: true,
    pathRewrite: {
      "^/api/notificaciones": "",
    },
  })
);

module.exports = router;
