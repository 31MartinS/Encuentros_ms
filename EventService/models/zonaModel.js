const db = require("../database/db");

const ZonaModel = {
  async getAll() {
    const result = await db.query("SELECT * FROM zonas");
    return result.rows;
  },
};

module.exports = ZonaModel;
