module.exports = () => {
  require('dotenv').config(); 
  require("dotenv").config({ path: `.env.${process.env.NODE_ENV}`, override: true });
};
