const { EntitySchema } = require("typeorm")

module.exports = new EntitySchema({
  name: "Album",
  tableName: "albums",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
    },
    releaseYear: {
      type: "int",
    },
    bandName: {
      type: "varchar",
    },
  },
})
