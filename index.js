const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

// Conexão com better-sqlite3
const db = new Database("./database.sqlite");

// Criar tabela se não existir (opcional, mas recomendado)
db.exec(`
  CREATE TABLE IF NOT EXISTS bands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    album TEXT,
    year TEXT,
    genre TEXT,
    country TEXT,
    label TEXT,
    format TEXT,
    approved INTEGER DEFAULT 0
  )
`);

app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

// Teste de conexão
app.get("/api/health", (req, res) => {
  res.json({ api: "ok", db: "ok" });
});

// Listar bandas
app.get("/api/bandas", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM bands").all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar bandas" });
  }
});

// Inserir banda
app.post("/api/bandas", (req, res) => {
  const { band, album, year, genre, country, label, format } = req.body;

  if (!band || !genre) {
    return res.status(400).json({ erro: "Preencha pelo menos Band e Genre" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO bands (name, album, year, genre, country, label, format, approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `);

    const result = stmt.run(band, album, year, genre, country, label, format);

    res.json({
      id: result.lastInsertRowid,
      band,
      album,
      year,
      genre,
      country,
      label,
      format,
      approved: 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao inserir banda" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
