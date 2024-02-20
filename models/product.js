const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    taxPercentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    warrantyPeriod: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shippingCharges: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    soldBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sellerAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Product.associate = function (models) {
  Product.belongsToMany(models.Order, {through: models.OrderProduct})
}

module.exports = Product;
