require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const FacebookStrategy= require('passport-facebook').Strategy;
const TwitterStrategy= require('passport-twitter').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const Schema = mongoose.Schema;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(session({
  secret:"Ourlittlesecret",
  resave:false,
  saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());

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
  username:String,
  password:String,
  googleId:String, 
  facebookId:String,
  twitterId:String,
  secret:String,
  username:String,
  password:String,
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);
const Project = mongoose.model("Project", UserSchema);

passport.use(Project.createStrategy());
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    Project.findById(id, function(err, user) {
      done(err, user);
    });
  }); 

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
      Project.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
  clientID: process.env.Facebook_CLIENT_ID,
  clientSecret: process.env.Facebook_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/key",
  
},
function(accessToken, refreshToken, profile, cb) {
  Project.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));


passport.use(new TwitterStrategy({
  consumerKey: process.env.Twitter_CLIENT_ID,
  consumerSecret: process.env.Twitter_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/twitter/importantkey"
},
function(token, tokenSecret, profile, cb) {
  Project.findOrCreate({ twitterId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'profile' ] }
));

app.get('/auth/google/secrets',
    passport.authenticate( 'google', {failureRedirect: '/auth/google/login'}),
    function(req,res)
    {
        res.redirect("/download");
    });

    app.get('/auth/facebook',
  passport.authenticate('facebook'

  ));
  
  app.get('/auth/facebook/key',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
     
      res.redirect('/');
    });

    app.get('/auth/twitter',
    passport.authenticate('twitter'));
  
  app.get('/auth/twitter/importantkey', 
    passport.authenticate('twitter', { failureRedirect: '/download' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });



app.get("/", function (req, res) {
   res.render("home");
  });


app.get("/templates",function(req,res)
{
  res.render("availabletemplates");
})

app.get("/login",function(req,res)
{
  res.render("Signin")
})  

app.get("/register",function(req,res)
{
  res.render("Register")
})  

app.get("/download", function (req, res) {
    Project.find({}, function(err, posts){
        if(!err)
        {
            console.log(posts);
          res.render("template5",{arr:posts});
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


app.post("/login",function(req,res)
{
    const user=new Project({
        username:req.body.username,
        password:req.body.password
    })

    req.login(user,function(err)
    {
        if(err)
        {
         console.log(err);
         res.redirect("/login")
        }
        else
        {
            passport.authenticate("local")(req,res,function()
            {
              res.redirect("/");
            })
            
        } 
    })
})

app.post("/register",function(req,res)
{
  Project.register({username:req.body.username},req.body.password,function(err,user)
    {
        if(err)
        {
            console.log(err);
             res.redirect("/register");
        }
        else
        {
          passport.authenticate("local")(req,res,function()
            {
              res.redirect("/");
            })
       
        }
    })

   
})


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

app.listen("3000", function () {
  console.log("Server has been started at port 3000");
});