const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/Resume", { useNewUrlParser: true });

const UserSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  pno: Number,
  website: String,
  github: String,
  linkedin: String,
  twitter: String,
  collegename: String,
  collegestartdate: Date,
  collegeenddate: Date,
  collegedegree: String,
  collegegpa: Number,
  collegelocation: String,
  sscschoolname: String,
  sscboard: String,
  ssccompletion: Date,
  sscpercentage: Number,
  sscschoollocation: String,
  hscschoolname: String,
  hscboard: String,
  hsccompletion: Date,
  hscpercentage: Number,
  hscschoollocation: String,
  companyname: String,
  jobtitle: String,
  state: String,
  city: String,
  startdate: Date,
  enddate: Date,
  jobdescription: String,
  skills1: String,
  skills2: String,
  skills3: String,
  skills4: String,
  skills5: String,
  skills6: String,
  projectname: String,
  project1description: String,
  link: String,
  toolsused: String,
  awardname: String,
  awarddate: Date,
  awarder: String,
  Awarddescription: String,
});

const Project = mongoose.model("Project", UserSchema);

app.get("/", function (req, res) {
    res.render("home");
  });

app.get("/download", function (req, res) {
    Project.find({}, function(err, posts){
        if(!err)
        {
            console.log(posts);
          res.render("template4",{arr:posts});
        }
      })
});

app.get("/profile", function (req, res) {
  res.render("Profile");
});

app.get("/education", function (req, res) {
  res.render("Education");
});

app.get("/work", function (req, res) {
  res.render("Work");
});

app.get("/skills", function (req, res) {
  res.render("Skills");
});

app.get("/projects", function (req, res) {
  res.render("Projects");
});

app.get("/awards", function (req, res) {
  res.render("Awards");
});

app.post("/profile", function (req, res) {
//   console.log(req.body);

  const data = new Project({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    pno: req.body.pno,
    website: req.body.website,
    github: req.body.github,
    linkedin: req.body.linkedin,
    twitter: req.body.twitter,
  });
  data.save();
  res.redirect("/education");
});
app.post("/education", function (req, res) {
//   console.log(req.body);
  const data = new Project({
    collegename: req.body.collegename,
    collegestartdate: req.body.collegestartdate,
    collegeenddate: req.body.collegeenddate,
    collegedegree: req.body.collegedegree,
    collegegpa: req.body.collegegpa,
    collegelocation: req.body.collegelocation,
    sscschoolname: req.body.sscschoolname,
    sscboard: req.body.sscboard,
    ssccompletion: req.body.ssccompletion,
    sscpercentage: req.body.sscpercentage,
    sscschoollocation: req.body.sscschoollocation,
    hscschoolname: req.body.hscschoolname,
    hscboard: req.body.hscboard,
    hsccompletion: req.body.hsccompletion,
    hscpercentage: req.body.hscpercentage,
    hscschoollocation: req.body.hscschoollocation,
  });
  data.save();
  res.redirect("/work");
});
app.post("/work", function (req, res) {
//   console.log(req.body);
  const data = new Project({
    companyname: req.body.companyname,
    jobtitle: req.body.jobtitle,
    state: req.body.state,
    city: req.body.city,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    jobdescription: req.body.jobdescription,
  });
  data.save();
  res.redirect("/skills");
});
app.post("/skills", function (req, res) {
//   console.log(req.body);
  const data = new Project({
    skills1: req.body.skills1,
    skills2: req.body.skills2,
    skills3: req.body.skills3,
    skills4: req.body.skills4,
    skills5: req.body.skills5,
    skills6: req.body.skills6,
  });
  data.save();
  res.redirect("/projects");
});
app.post("/projects", function (req, res) {
//   console.log(req.body);
  const data = new Project({
    projectname: req.body.projectname,
    project1description: req.body.project1description,
    link: req.body.link,
    toolsused: req.body.toolsused,
  });
  data.save();
  res.redirect("/awards");
});

app.post("/awards", function (req, res) {
//   console.log(req.body);
  const data = new Project({
    awardname: req.body.awardname,
    awarddate: req.body.awarddate,
    awarder: req.body.awarder,
    Awarddescription: req.body.Awarddescription,
  });
  data.save();
  res.redirect("/download")
});

app.listen("5000", function () {
  console.log("Server has been started at port 5000");
});
