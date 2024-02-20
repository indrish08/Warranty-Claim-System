const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require('bcrypt')

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

User.associate = function (models) {
  User.hasMany(models.Order)
} 

User.findByUsername = async function (username) {
  try {
    return await this.findOne({ where: { username: username } });
  } catch (error) {
    throw new Error(`Error finding user by username: ${error.message}`);
  }
};

User.createUser = async function (username, password) {
  try {
    const hash = await bcrypt.hash(password, 10);
    const userDetails = await this.create({ username: username, password: hash });
    // await user.sync();
    return userDetails;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

User.comparePassword = async function(password, savedPassword){
  try {
    const result = await bcrypt.compare(password, savedPassword);
    return result;
  } catch (error) {
    console.log(error);
  };
};

module.exports = User;
