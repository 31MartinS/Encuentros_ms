require("dotenv").config();
const app = require("./app");
const initDB = require("./database/initDB");

const PORT = process.env.PORT || 3002;

(async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Evento-Service corriendo en http://localhost:${PORT}`);
  });
})();
