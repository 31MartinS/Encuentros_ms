const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();
const { usuarioService } = require("../config/services");

router.use(
  "/",
  createProxyMiddleware({
    target: usuarioService,
    changeOrigin: true,
  })
);

module.exports = router;
