const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const eventoRoutes = require("./routes/eventoRoutes");
const zonaRoutes = require("./routes/zonaRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/eventos", eventoRoutes);
app.use("/api/zonas", zonaRoutes);

module.exports = app;
