const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const product = require('./product');

const order = sequelize.define(
  "order",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    timestamps: false,
  }
);

order.hasOne(product, {
    foreignKey: 'productId',
    targetKey: 'id',
})

module.exports = order;