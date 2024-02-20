const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

const db = {};

// const sequelize = new Sequelize('pulsebeat', 'postgres', 'indrish', {
//   host: 'localhost',
//   dialect: 'postgres',
//   logging: false
// });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

fs.readdirSync(__dirname)
  .filter((file) => {
    return file !== basename && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
})

Object.keys(db).forEach((name) => {
    if (db[name].associate) {
      db[name].associate(db);
    }
})

sequelize.sync()
  .then(() => {
    console.log('Database and tables synchronized.');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

module.exports = db;