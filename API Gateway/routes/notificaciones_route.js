const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();
const { notificacionService } = require("../config/services");

router.use(
  "/",
  createProxyMiddleware({
    target: notificacionService,
    changeOrigin: true,
  })
);

module.exports = router;
