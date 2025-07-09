CREATE TABLE IF NOT EXISTS entradas (
  id INT PRIMARY KEY DEFAULT unique_rowid(),
  evento_id STRING NOT NULL,
  usuario_id STRING NOT NULL,
  asiento STRING NOT NULL,
  qr_code STRING,
  fecha_compra TIMESTAMP DEFAULT now()
);
