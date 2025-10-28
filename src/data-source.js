const { DataSource } = require("typeorm")

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  entities: ["src/entity/*.js"],
})

AppDataSource.initialize()
  .then(() => console.log("Banco de dados conectado!"))
  .catch((err) => console.error("Erro ao conectar no banco:", err))

module.exports = AppDataSource
