const EventoService = require("../services/eventoService");

const EventoController = {
  async getAll(req, res) {
    const eventos = await EventoService.getAll();
    res.json(eventos);
  },
  async create(req, res) {
    const id = await EventoService.create(req.body);
    res.status(201).json({ id });
  },
  async update(req, res) {
    const { id } = req.params;
    await EventoService.update(id, req.body);
    res.status(204).end();
  },
};

module.exports = EventoController;
