const db = require("./db");

async function initDB() {
  try {
    // Crear la base de datos si no existe
    await db.query("CREATE DATABASE IF NOT EXISTS eventosDB;");
    await db.query("USE eventosDB;");

    await db.query(`
      CREATE TABLE IF NOT EXISTS zonas (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(100) NOT NULL
      );
    `);

    const { rows } = await db.query("SELECT COUNT(*) as count FROM zonas");
    if (parseInt(rows[0].count) === 0) {
      await db.query(`
        INSERT INTO zonas (nombre)
        VALUES ('Palco'), ('Tribuna'), ('VIP');
      `);
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS eventos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        fecha TIMESTAMP,  // Sin zona horaria
        zona_id UUID REFERENCES zonas(id)
      );
    `);

    console.log("🟢 Base de datos inicializada correctamente");
  } catch (error) {
    console.error("🔴 Error inicializando la base de datos:", error.message);
    process.exit(1);
  }
}

module.exports = initDB;
