const localStrategy = require("passport-local").Strategy;
const User = require("../modles/user");
const config = require("../config/database");
const bcrypt = require("bcryptjs");

module.exports = passport => {
  //local strategy
  passport.use(
    new localStrategy((username, password, done) => {
      // User.findOne
    })
  );
};
