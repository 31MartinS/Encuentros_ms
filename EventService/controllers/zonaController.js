const ZonaService = require("../services/zonaService");

const ZonaController = {
  async getAll(req, res) {
    const zonas = await ZonaService.getAll();
    res.json(zonas);
  },
};

module.exports = ZonaController;
