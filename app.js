if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/api/users");
var productsRouter = require("./routes/api/products");
var prodRouter = require("./routes/products/products");
var loginRouter = require("./routes/login/login");
var config = require("config");
const router = require("./routes/index");
const app = express();
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const session = require("express-session");
// const methodOverride = require('method-override') //not working for logout
const bodyParser = require("body-parser");

const initializePassport = require("./passport-config");
const passport = require("passport");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];
const db = require("./db");
const { result } = require("lodash");
const collection = "products";

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
// app.use(methodOverride('_method')) //not working for logout

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index.pug");
});

app.get("/products", (req, res) => {
  res.render("products.pug");
});
app.get("/crud", checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "crud.html"));
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.pug");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/crud",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.pug");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.use("/api/users", usersRouter);
// app.use("/products", prodRouter);
app.use("/api/products", productsRouter);
app.use("/login", loginRouter);

// catch 404 and forward to error handler
/* app.use(function (req, res, next) {
  next(createError(404));
}); */

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
mongoose
  .connect(config.get("db"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Mongo...."))
  .catch((error) => console.log(error.message));

db.connect((err) => {
  if (err) {
    console.log("unable to connect");
    process.exit(1);
  } else {
    console.log("Welcome");
  }
});

// read
app.get("/getProducts", (req, res) => {
  db.getDB()
    .collection(collection)
    .find({})
    .toArray((err, documents) => {
      if (err) console.log(err);
      else {
        res.json(documents);
        // console.log(documents);
      }
    });
});

// update
app.put("/:id", (req, res) => {
  const prodID = req.params.id;
  const userInput = req.body;
  db.getDB()
    .collection(collection)
    .findOneAndUpdate(
      { _id: db.getPrimaryKey(prodID) },
      {
        $set: {
          name: userInput.name,
          price: userInput.price,
          description: userInput.description,
        },
      },
      { returnOriginal: false },
      (err, result) => {
        if (err) console.log(err);
        else {
          res.json(result);
        }
      }
    );
});

//create
app.post("/", (req, res) => {
  const userInput = req.body;

  db.getDB()
    .collection(collection)
    .insert(userInput, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json({ result: result, document: result.ops[0] });
      }
    });
});

//delete
app.delete("/:id", (req, res) => {
  const prodID = req.params.id;
  db.getDB()
    .collection(collection)
    .findOneAndDelete({ _id: db.getPrimaryKey(prodID) }, (err, result) => {
      if (err) console.log(err);
      else res.json(result);
    });
});

// Middleware for handling Error
// Sends Error Response Back to User
app.use((err, req, res, next) => {
  res.status(err.status).json({
    error: {
      message: err.message,
    },
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/crud");
  }
  next();
}

module.exports = app;
