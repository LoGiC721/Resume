require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const findOrCreate = require("mongoose-findorcreate");


const Schema = mongoose.Schema;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(
  session({
    secret: "Ourlittlesecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/Resume", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new Schema({
  firstname: { type: String, default: null },
  lastname: { type: String, default: null },
  email: { type: String, default: null },
  pno: { type: Number, default: null },
  website: { type: String, default: null },
  github: { type: String, default: null },
  linkedin: { type: String, default: null },
  twitter: { type: String, default: null },
  school: [
    {
      name: { type: String, default: null },
      startdate: { type: Date, default: Date.now },
      enddate: { type: Date, default: Date.now },
      degree: { type: String, default: null },
      gpa: { type: Number, default: null },
      location: { type: String, default: null },
    },
  ],

  work: [
    {
      companyname: { type: String, default: null },
      jobtitle: { type: String, default: null },
      state: { type: String, default: null },
      city: { type: String, default: null },
      startdate: { type: Date, default: null },
      enddate: { type: Date, default: null },
      jobdescription: { type: String, default: null },
    },
  ],

  skills: [
    {
      skillsname: { type: String, default: null },
      skillsdetails:{ type: String, default: null },
    },
  ],


  project: [
    {
      projectname: { type: String, default: null },
      project1description: { type: String, default: null },
      link: { type: String, default: null },
      toolsused: { type: String, default: null },
    },
  ],

  awards: [
    {
      awardname: { type: String, default: null },
      awarddate: { type: Date, default: null },
      awarder: { type: String, default: null },
      Awarddescription: { type: String, default: null },
    },
  ],


 
  username: { type: String, default: null },
  password: { type: String, default: null },
  googleId: { type: String, default: null },
  facebookId: { type: String, default: null },
  twitterId: { type: String, default: null },
  secret: { type: String, default: null },
  username: { type: String, default: null },
  password: { type: String, default: null },
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);
const Project = mongoose.model("Project", UserSchema);

passport.use(Project.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  Project.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      Project.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.Facebook_CLIENT_ID,
      clientSecret: process.env.Facebook_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/key",
    },
    function (accessToken, refreshToken, profile, cb) {
      Project.findOrCreate({ facebookId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.Twitter_CLIENT_ID,
      consumerSecret: process.env.Twitter_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/twitter/importantkey",
    },
    function (token, tokenSecret, profile, cb) {
      Project.findOrCreate({ twitterId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/auth/google/login" }),
  function (req, res) {
    res.redirect("/download");
  }
);

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/key",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.

    res.redirect("/");
  }
);

app.get("/auth/twitter", passport.authenticate("twitter"));

app.get(
  "/auth/twitter/importantkey",
  passport.authenticate("twitter", { failureRedirect: "/download" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.get("/", function (req, res) {
  res.render("home", { currentUser: req.user });
});

app.get("/templates", function (req, res) {
  if (!req.user) res.render("SignIn");
  else res.render("availabletemplates", { currentUser: req.user });
});

app.get("/login", function (req, res) {
  res.render("Signin");
});

app.get("/register", function (req, res) {
  res.render("Register");
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

let templateno = 1;

app.get("/download", function (req, res) {
  Project.find({ _id: req.user.id }, function (err, posts) {
    if (!err) {
      res.render("template" + templateno, { arr: posts });
    }
  });
});

let count = 1;
let noOfProjects=1;
let noOfSkills=1;
let noOfWorkExperience=1;
let noOfAwards=1;
let flag = 0;
let flag1=0;
let flag2=0;
let flag3=0;
let flag4=0;

let important=1;
app.get("/:customName", function (req, res) {
  let customListName = req.params.customName;
  important:1;
  Project.find({ _id: req.user.id }, function (err, found) {
    if (!err) {
      res.render(customListName, {
        current: customListName,
        found: found,
        count: count,
        noOfProjects:noOfProjects,
        noOfSkills:noOfSkills,
        noOfWorkExperience:noOfWorkExperience,
        noOfAwards:noOfAwards,
        flag: flag,
        flag1:flag1,
        flag2:flag2,
        flag3:flag3,
        flag4:flag4,
      });
      //  console.log(found[0].project[0].projectname);
    }
  });
});

app.post("/", function (req, res) {
  res.redirect("/templates");
});

app.post("/templates", function (req, res) {
  templateno = req.body.template;
  res.redirect("/profile");
});

app.post("/login", function (req, res) {
  const user = new Project({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    }
  });
});

app.post("/register", function (req, res) {
  Project.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/");
        });
      }
    }
  );
});

app.post("/profile", function (req, res) {
  var myquery = { _id: req.user.id };
  var newvalues = {
    $set: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      pno: req.body.pno,
      website: req.body.website,
      github: req.body.github,
      linkedin: req.body.linkedin,
      twitter: req.body.twitter,
    },
  };
  Project.updateMany(myquery, newvalues, function (err, res) {
    if (!err) console.log("Documents updated successfully");
  });
  res.redirect("/education");
});
app.post("/education", function (req, res) {
    // console.log(req.body.startdate);
  let value = req.body.btn;
  if (value === "1") {
    noOfProjects++;
  } else {
    if (value === "2" && noOfProjects > 1) {
      noOfProjects--;
    }
  }

  
  //  console.log("noOfProjects="+noOfProjects);

  var myquery = { _id: req.user.id };

  let checkisarray = req.body.name;
  if (!Array.isArray(checkisarray)) {
    
    var newvalue = {
      $set: {
        school: 
          {
            name:req.body.name,
            startdate:req.body.startdate,
            enddate: req.body.enddate,
            degree:req.body.degree,
            gpa: req.body.gpa,
            location: req.body.location,
          },
      },
    };
    Project.updateMany(myquery, newvalue, function (err, res) {
      if (!err) console.log("Documents inserted successfully");
    });
  } else {
    let arr = req.body.name;
    Project.updateMany(myquery, { $set: { school: [] } }, function (err, res) {
      if (!err) console.log("Documents deleted successfully");
    });

    for (let i = 0; i < arr.length; i++) {
     
      var newvalue = {
        $push: {
          school: 
          {
            name:req.body.name[i],
            startdate:req.body.startdate[i],
            enddate: req.body.enddate[i],
            degree:req.body.degree[i],
            gpa: req.body.gpa[i],
            location: req.body.location[i],
          },
        },
      };
      Project.updateMany(myquery, newvalue, function (err, res) {
        if (!err) console.log("Documents inserted successfully");
      });
    }
  }

  if (value === "3") {
    flag1 = 1;
    res.redirect("/work");
  } else {
    if (value === "1") flag1 = 0;
    else flag1 = 1;
    res.redirect("/education");
  }
});
app.post("/work", function (req, res) {
  //   console.log(req.body);

  let value = req.body.btn;
  if (value === "1") {
    noOfWorkExperience++;
  } else {
    if (value === "2" && noOfWorkExperience > 1) {
      noOfWorkExperience--;
    }
  }

  
  //  console.log("noOfProjects="+noOfProjects);

  var myquery = { _id: req.user.id };

  let checkisarray = req.body.companyname;
  if (!Array.isArray(checkisarray)) {
    
    var newvalue = {
      $set: {
        work: 
          {
            companyname: req.body.companyname,
            jobtitle: req.body.jobtitle,
            state: req.body.state,
            city: req.body.city,
            startdate: req.body.startdate,
            enddate: req.body.enddate,
            jobdescription: req.body.jobdescription,
          },
      },
    };
    Project.updateMany(myquery, newvalue, function (err, res) {
      if (!err) console.log("Documents inserted successfully");
    });
  } else {
    let arr = req.body.companyname;
    Project.updateMany(myquery, { $set: { work: [] } }, function (err, res) {
      if (!err) console.log("Documents deleted successfully");
    });

    for (let i = 0; i < arr.length; i++) {
     
      var newvalue = {
        $push: {
          work: 
          {
            companyname: req.body.companyname[i],
            jobtitle: req.body.jobtitle[i],
            state: req.body.state[i],
            city: req.body.city[i],
            startdate: req.body.startdate[i],
            enddate: req.body.enddate[i],
            jobdescription: req.body.jobdescription[i],
          },
        },
      };
      Project.updateMany(myquery, newvalue, function (err, res) {
        if (!err) console.log("Documents inserted successfully");
      });
    }
  }

  if (value === "3") {
    flag3 = 1;
    res.redirect("/skills");
  } else {
    if (value === "1") flag3 = 0;
    else flag3 = 1;
    res.redirect("/work");
  }
});


app.post("/skills", function (req, res) {
     console.log(req.body);

     let value = req.body.btn;
     if (value === "1") {
       noOfSkills++;
     } 
     else if (value === "2" && noOfSkills > 1) {
        noOfSkills--;
     }
     else if(value!=="3")
     {
       important++;
     }
     




    var myquery = { _id: req.user.id };

    let checkisarray = req.body.skillsname;
    if (!Array.isArray(checkisarray)) {
      
      var newvalue = {
        $set: {
          skills: 
            {
              skillsname:req.body.skillsname,
              skillsdetails:req.body.skillsdetails,
              
            },
        },
      };
      Project.updateMany(myquery, newvalue, function (err, res) {
        if (!err) console.log("Documents inserted successfully");
      });
    } else {
      let arr = req.body.skillsname;
      Project.updateMany(myquery, { $set: { skills: [] } }, function (err, res) {
        if (!err) console.log("Documents deleted successfully");
      });
  
      for (let i = 0; i < arr.length; i++) {
       
        var newvalue = {
          $push: {
            skills: 
            {
              skillsname:req.body.skillsname[i],
              skillsdetails:req.body.skillsdetails[i],

            },
          },
        };
        Project.updateMany(myquery, newvalue, function (err, res) {
          if (!err) console.log("Documents inserted successfully");
        });
      }
    }
  
    if (value === "3") {
      flag2 = 1;
      res.redirect("/projects");
    } else {
      if (value === "1") flag2 = 0;
      else flag2 = 1;
      res.redirect("/skills");
    }

});

app.post("/projects", function (req, res) {
  let value = req.body.btn;
  if (value === "1") {
    count++;
  } else {
    if (value === "2" && count > 1) {
      count--;
    }
  }

  // console.log(req.body);
  //  console.log("count="+count);

  var myquery = { _id: req.user.id };

  let checkisarray = req.body.projectname;
  if (!Array.isArray(checkisarray)) {
    var newvalue = {
      $set: {
        project: {
          projectname: req.body.projectname,
          project1description: req.body.project1description,
          link: req.body.link,
          toolsused: req.body.toolsused,
        },
      },
    };
    Project.updateMany(myquery, newvalue, function (err, res) {
      if (!err) console.log("Documents inserted successfully");
    });
  } else {
    let arr = req.body.projectname;
    Project.updateMany(myquery, { $set: { project: [] } }, function (err, res) {
      if (!err) console.log("Documents deleted successfully");
    });

    for (let i = 0; i < arr.length; i++) {
      var newvalue = {
        $push: {
          project: {
            projectname: req.body.projectname[i],
            project1description: req.body.project1description[i],
            link: req.body.link[i],
            toolsused: req.body.toolsused[i],
          },
        },
      };
      Project.updateMany(myquery, newvalue, function (err, res) {
        if (!err) console.log("Documents inserted successfully");
      });
    }
  }

  if (value === "3") {
    flag = 1;
    res.redirect("/awards");
  } else {
    if (value === "1") flag = 0;
    else flag = 1;
    res.redirect("/projects");
  }
});

app.post("/awards", function (req, res) {

  let value = req.body.btn;
  if (value === "1") {
    noOfAwards++;
  } else {
    if (value === "2" && noOfAwards > 1) {
      noOfAwards--;
    }
  }

  // console.log(req.body);
  //  console.log("count="+count);

  var myquery = { _id: req.user.id };

  let checkisarray = req.body.awardname;
  if (!Array.isArray(checkisarray)) {
    var newvalue = {
      $set: {
        awards: {
          awardname: req.body.awardname,
          awarddate:  req.body.awarddate,
          awarder:  req.body.awarder,
          Awarddescription: req.body.Awarddescription,
        },
      },
    };
    Project.updateMany(myquery, newvalue, function (err, res) {
      if (!err) console.log("Documents inserted successfully");
    });
  } else {
    let arr = req.body.awardname;
    Project.updateMany(myquery, { $set: { awards: [] } }, function (err, res) {
      if (!err) console.log("Documents deleted successfully");
    });

    for (let i = 0; i < arr.length; i++) {
      var newvalue = {
        $push: {
          awards: {
            awardname: req.body.awardname[i],
          awarddate:  req.body.awarddate[i],
          awarder:  req.body.awarder[i],
          Awarddescription: req.body.Awarddescription[i],
          },
        },
      };
      Project.updateMany(myquery, newvalue, function (err, res) {
        if (!err) console.log("Documents inserted successfully");
      });
    }
  }

  if (value === "3") {
    flag4 = 1;
    res.redirect("/projects");
  } else {
    if (value === "1") flag4 = 0;
    else flag4 = 1;
    res.redirect("/awards");
  }
});

app.listen("3000", function () {
  console.log("Server has been started at port 3000");
});
