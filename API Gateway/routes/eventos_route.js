const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const router = express.Router();
const { eventoService } = require("../config/services");

router.use(
  "/eventos",
  createProxyMiddleware({
    target: eventoService,
    changeOrigin: true,
    pathRewrite: {
      "^/api/eventos": "",
    },
  })
);

module.exports = router;
