const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();
const { usuarioService } = require("../config/services");

router.use(
  "/usuarios",
  createProxyMiddleware({
    target: usuarioService,
    changeOrigin: true,
    pathRewrite: {
      "^/api/usuarios": "",
    },
  })
);

module.exports = router;
