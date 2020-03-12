var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
var expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const config = require("./config/database");

mongoose.connect(config.database);

let db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to mongoDb");
});

db.on("error", function() {
  console.log(err);
});

//bringing modules
let Article = require("./modles/article");

//body  parse middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//express session middleware
//app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
    // cookie: {
    //   secure: true
    // }
  })
);

//express message middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

//Express validator
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

//home route
app.get("/", (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log("error error");
      throw err;
    }
    res.render("index", {
      title: "Articles",
      articles: articles
    });
  });
});

//router files
let articles = require("./routes/articles");
let users = require("./routes/user");
app.use("/articles", articles);
app.use("/user", users);

app.listen(9090, () => {
  console.log("Server Started..");
});
