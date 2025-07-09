const db = require("./db");

async function initDB() {
  try {
    // Crear tabla zonas
    await db.query(`
      CREATE TABLE IF NOT EXISTS zonas (
        id INT PRIMARY KEY DEFAULT unique_rowid(),
        nombre VARCHAR(100) NOT NULL
      );
    `);

    // Evitar inserciones duplicadas
    const { rows } = await db.query("SELECT COUNT(*) FROM zonas");
    if (parseInt(rows[0].count) === 0) {
      await db.query(`
        INSERT INTO zonas (nombre)
        VALUES ('Palco'), ('Tribuna'), ('VIP');
      `);
    }

    // Crear tabla eventos
    await db.query(`
      CREATE TABLE IF NOT EXISTS eventos (
        id INT PRIMARY KEY DEFAULT unique_rowid(),
        nombre VARCHAR(100),
        descripcion TEXT,
        fecha TIMESTAMPTZ,
        zona_id INT REFERENCES zonas(id)
      );
    `);

    console.log("🟢 Base de datos inicializada correctamente");
  } catch (error) {
    console.error("🔴 Error inicializando la base de datos:", error.message);
  }
}

module.exports = initDB;
