const oracledb = require('oracledb');

const userSchema = {
  email: {
    type: oracledb.STRING,
    required: true,
    unique: true,
    maxLength: 50,
  },
  likedMovies: {
    type: oracledb.DB_TYPE_ARRAY,
    elementType: oracledb.STRING,
    required: false,
  },
};
module.exports = {
  userSchema,
  createUserTable
};
