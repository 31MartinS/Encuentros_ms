const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();
const { eventoService } = require("../config/services");

router.use(
  "/",
  createProxyMiddleware({
    target: eventoService,
    changeOrigin: true,
  })
);

module.exports = router;
