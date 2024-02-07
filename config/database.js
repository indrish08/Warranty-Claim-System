const { Sequelize, DataTypes } = require("sequelize");

// const sequelize = new Sequelize(
//   "postgres://postgres:indrish@localhost:5432/pulsebeat"
// );

const sequelize = new Sequelize('pulsebeat', 'postgres', 'indrish', {
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;