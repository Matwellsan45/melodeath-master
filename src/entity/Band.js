const { EntitySchema } = require("typeorm")

module.exports = new EntitySchema({
  name: "Band",
  tableName: "bands",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    genre: {
      type: "varchar",
    },
    approved: {
      type: "boolean",
      default: false,
    },
  },
})
