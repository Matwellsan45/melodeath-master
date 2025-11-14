const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

const db = new sqlite3.Database("./database.sqlite");

app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

// Teste de conexão
app.get("/api/health", (req, res) => {
  res.json({ api: "ok", db: "ok" });
});

// Listar bandas
app.get("/api/bandas", (req, res) => {
  db.all("SELECT * FROM bands", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao buscar bandas" });
    }
    res.json(rows);
  });
});

// Inserir banda
app.post("/api/bandas", (req, res) => {
  const { band, album, year, genre, country, label, format } = req.body;

  if (!band || !genre) {
    return res.status(400).json({ erro: "Preencha pelo menos Band e Genre" });
  }

  const query = `
    INSERT INTO bands (name, album, year, genre, country, label, format, approved)
    VALUES (?, ?, ?, ?, ?, ?, ?, 0)
  `;

  db.run(
    query,
    [band, album, year, genre, country, label, format],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro ao inserir banda" });
      }
      res.json({
        id: this.lastID,
        band,
        album,
        year,
        genre,
        country,
        label,
        format,
        approved: 0,
      });
    }
  );
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});





