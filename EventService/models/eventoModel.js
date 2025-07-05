const db = require("../database/db");

const EventoModel = {
  async getAll() {
    const result = await db.query("SELECT * FROM eventos");
    return result.rows;
  },
  async getById(id) {
    const result = await db.query("SELECT * FROM eventos WHERE id = $1", [id]);
    return result.rows[0];
  },
  async create(data) {
    const { nombre, descripcion, fecha, zona_id } = data;
    const result = await db.query(
      "INSERT INTO eventos (nombre, descripcion, fecha, zona_id) VALUES ($1, $2, $3, $4) RETURNING id",
      [nombre, descripcion, fecha, zona_id]
    );
    return result.rows[0].id;
  },
  async update(id, data) {
    const { nombre, descripcion, fecha, zona_id } = data;
    await db.query(
      "UPDATE eventos SET nombre = $1, descripcion = $2, fecha = $3, zona_id = $4 WHERE id = $5",
      [nombre, descripcion, fecha, zona_id, id]
    );
  },
};

module.exports = EventoModel;
