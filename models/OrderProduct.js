const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderProduct = sequelize.define('OrderProduct', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},{
    timestamps: false,
    freezeTableName:true
});

module.exports = OrderProduct;
