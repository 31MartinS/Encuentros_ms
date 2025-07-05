const EventoModel = require("../models/eventoModel");

const EventoService = {
  getAll: EventoModel.getAll,
  create: EventoModel.create,
  update: EventoModel.update,
};

module.exports = EventoService;
