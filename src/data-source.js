const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    synchronize: false,
    ssl: false,
    entities: ["src/entity/*.js"],
});

AppDataSource.initialize()
    .then(() => console.log("Banco conectado!"))
    .catch(err => console.error("Erro ao conectar no banco:", err));

module.exports = AppDataSource;
