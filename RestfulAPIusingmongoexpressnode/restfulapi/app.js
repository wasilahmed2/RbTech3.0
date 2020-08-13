if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
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
const flash = require('express-flash')
const session = require('express-session')
// const methodOverride = require('method-override') //not working for logout

const initializePassport = require("./passport-config");
const passport = require("passport");
initializePassport(passport, (email) =>
  users.find((user) => user.email === email),
  id => users.find(user => user.id === id)
);

const users = [];

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
// app.use(methodOverride('_method')) //not working for logout

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.pug");
});

app.get("/products", checkAuthenticated, (req, res) => {
  res.render("products.pug")
})

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.pug");
});

app.post("/login", checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

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
app.use(function (req, res, next) {
  next(createError(404));
});

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

/*app.delete('/logout', (req, res) => {
 req.logOut()
 res.redirect('/login')
}) */ //for logout not working

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

module.exports = app;
