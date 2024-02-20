const Sequelize = require("sequelize");

const sequelize = new Sequelize('pulsebeat', 'postgres', 'indrish', {
    host: 'localhost',
    dialect: 'postgres',
    logging:false
});

module.exports = sequelize;