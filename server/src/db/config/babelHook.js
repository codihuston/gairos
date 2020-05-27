/**
 * This file is used to enable ES6 in the sequelize-cli files in
 * the server/db directory
 */
require("@babel/register");

const { opts } = require("./config");
module.exports = opts;
