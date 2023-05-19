const path = require("path");
const express = require("express");
const flash = require("connect-flash");
const hbs = require("hbs");
const User = require("./public/src/users");
const app = express();
var session = require("express-session");
const e = require("connect-flash");

const publicPath = path.join(__dirname, "./public");
const viewpath = path.join(__dirname, "./templates/views");
const partials = path.join(__dirname, "./templates/partials");

var sess;
app.use(flash());
app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "2C44-4D44-WppQ38S",
    resave: true,
    saveUninitialized: true,
  })
);
app.set("view engine", "hbs");
app.set("views", viewpath);
hbs.registerPartials(partials);

app.get("", (req, res) => {
  // res.send('My Express')
  console.log("sess", req.session.email);
  if (req.session.email) {
    res.redirect("home");
  } else {
    res.render("login", {
      title: "Sample HBS page",
      name: "Athif",
    });
  }
});

app.post("/logincheck", (req, res) => {
  sess = req.session;
  const email = req.body.email;
  const password = req.body.password;
  sess.email = email;
  sess.password = password;
  console.log("sess", sess);
  if (sess.email) res.redirect("home");
  else
    res.render("index", {
      title: "Sample HBS page",
      name: "Athif",
    });
});

app.get("/home", (req, res) => {
  // res.send('My Express')
  res.render("index", {
    title: "Sample HBS page",
    name: "Athif",
  });
});
app.get("/users", (req, res) => {
  try {
    User.find({}, null, { limit: 10 }, function (err, docs) {
      if (err) {
        console.log(err);
      }
      res.render("userslist", { users: docs });
    })
      .sort({ createdAt: "desc" })
      .skip(0);
  } catch (e) {
    res.status(500).send();
  }
});
app.get("/addUser", (req, res) => {
  res.render("addUser", {
    title: "Add User Page",
    name: "Users",
  });
});
app.get("/editUser/:id", (req, res) => {
  const _id = req.params.id;
  User.findOne({ _id: _id }, null, { limit: 10 }, function (err, docs) {
    if (err) {
      console.log(err);
    }
    res.render("addUser", {
      title: "Edit User Page",
      name: "Users",
      email: docs.email,
      password: docs.password,
      _id: _id,
    });
  })
    .sort({ createdAt: "desc" })
    .skip(0);
});
app.get("/deleteUser/:id", (req, res) => {
  const _id = Object(req.params.id);
  const filter = { _id: _id };
  const deletes = User.findOneAndDelete(filter, function (err, docs) {});

  req.flash("message", "User Deleted Successfully");
  // console.log(deletes)
  res.redirect("/users");
});

app.post("/saveUser", (req, res) => {
  const _id = req.body._id ? req.body._id : "";
  if (_id != "") {
    // res.send('Invalid Userid'+_id)
    const filter = { _id: _id };
    const update = { email: req.body.email, password: req.body.password };
    const update_status = User.findOneAndUpdate(
      filter,
      update,
      null,
      function (err, docs) {
        const user = docs;
        console.log(user.email);
        res.render("addUser", {
          title: "Edit User Page",
          name: "Users",
          email: req.body.email,
          password: req.body.password,
          _id: _id,
          message: " User Updated is created Successfully",
        });
      }
    );
  } else {
    var user = new User({
      email: req.body.email,
      password: req.body.password,
      age: "18",
    });
    user.save();
    res.render("addUser", { message: " User is created Successfully" });
  }
});

app.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

app.listen(3001, () => {
  console.log("3001 server is active");
});
