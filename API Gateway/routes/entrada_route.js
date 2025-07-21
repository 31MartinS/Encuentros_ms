const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();
const { entradaService } = require("../config/services");

router.use(
  "/",
  createProxyMiddleware({
    target: entradaService,
    changeOrigin: true,
  })
);

module.exports = router;
