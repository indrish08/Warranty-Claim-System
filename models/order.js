const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dispatchDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    billingAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Order.associate = function (models) {
  Order.belongsTo(models.User)
  Order.belongsToMany(models.Product, {through: models.OrderProduct})
}

module.exports = Order;

