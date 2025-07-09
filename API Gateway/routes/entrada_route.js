const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();
const { entradaService } = require("../config/services");

router.use(
  "/entradas",
  createProxyMiddleware({
    target: entradaService,
    changeOrigin: true,
    pathRewrite: {
      "^/api/entradas": "",
    },
  })
);

module.exports = router;
