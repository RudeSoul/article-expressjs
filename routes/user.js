const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

//bringing user modules
let User = require("../modles/user");

//register form
router.get("/register", (req, res) => {
  res.render("register");
});

//register process
router.post("/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("email", "email is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("username", "username is required").notEmpty();
  req.checkBody("password", "password is required").notEmpty();
  req.checkBody("password2", "password do not match").equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render("register", {
      errors: errors
    });
  } else {
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(err => {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash("success", "You are now register and can login");
            res.redirect("/user/login");
          }
        });
      });
    });
  }
});

//login route
router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
