const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
// const order = require('./order')

const product = sequelize.define(
  "product",
  {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    warrantyPeriod: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    classMethods: {
        test: function(){ console.log('smth') }
    }
  }
);

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
      type: DataTypes.INTEGER,
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

order.belongsTo(product, {
  foreignKey: "productId",
  sourceKey: "productId",
});

// product.hasOne(order, {
//   foreignKey: "productId",
//   sourceKey: "productId",
// });

product.test()

module.exports = product;
