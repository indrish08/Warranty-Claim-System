const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

User.findByUsername = async function (username) {
  try {
    return await this.findOne({ where: { username } });
  } catch (error) {
    throw new Error(`Error finding user by username: ${error.message}`);
  }
};

User.createUser = async function (username, password) {
  try {
    const user = await this.create({ username, password });
    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

module.exports = User;
