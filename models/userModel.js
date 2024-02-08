const { DataTypes } = require("sequelize");
const bcrypt = require('bcrypt')
const sequelize = require("../config/database");

const User = sequelize.define(
  "signin",
  {
    id: {
      type: DataTypes.INTEGER,
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

User.findByUsername = async function (username) {
  try {
    return await this.findOne({ where: { username: username } });
  } catch (error) {
    throw new Error(`Error finding user by username: ${error.message}`);
  }
};

User.createUser = async function (username, password) {
  try{
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username: username, password: hash });
    await sequelize.sync();
    return user;
  }catch(error){
    throw new Error(`Error creating user: ${error.message}`);
  }
};

User.comparePassword = async function(password, savedPassword){
  try{
    const result = await bcrypt.compare(password, savedPassword);
    return result;
  }catch(err) {
    console.log(err);
  };
};

module.exports = User;
