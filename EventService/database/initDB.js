const db = require("./db");

async function initDB() {
  try {
    // Crear tabla zonas
    await db.query(`
      CREATE TABLE IF NOT EXISTS zonas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL
      );d
    `);

    await db.query(`    
        INSERT INTO zonas (nombre)
            VALUES ('Palco'), ('Tribuna'), ('VIP');
    `);

    // Crear tabla eventos
    await db.query(`
      CREATE TABLE IF NOT EXISTS eventos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        descripcion TEXT,
        fecha TIMESTAMP,
        zona_id INT REFERENCES zonas(id)
      );
    `);

    console.log("🟢 Base de datos inicializada correctamente");
  } catch (error) {
    console.error("🔴 Error inicializando la base de datos:", error.message);
  }
}

module.exports = initDB;
