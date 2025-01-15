const express = require("express");
const app = express();
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const path = require("path");
const cookieParser = require("cookie-parser");
const user = require("./models/user");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/create", async (req, res) => {
  let { username, email, password, age } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({
        username,
        email,
        password: hash,
        age,
      });
      let token = jwt.sign({ email }, "shuuuuuuuuu");
      res.cookie("token", token);

      res.send(createdUser);
    });
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/profile",async(req,res)=>{
    let user=await userModel.findOne({username: req.body.usrname})
    res.render("profile",{user});
    
})

app.post("/login", async (req, res) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    res.render("err");
  }

  bcrypt.compair(req.body.password, user.password, (err, result) => {
    if (result) {
      let token = jwt.sign({ email:user.email }, "shuuuuuuuuu");
      res.cookie("token", token);
      res.render("profile");
    } else res.render("err");
  });
});

app.listen(3000);