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
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const loading = multer({ dest: "public/uploads/" });

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
  profile: { type: String, default: null },
  email: { type: String, default: null },
  pno: { type: Number, default: null },
  website: { type: String, default: null },
  github: { type: String, default: null },
  linkedin: { type: String, default: null },
  twitter: { type: String, default: null },
  country: { type: String, default: null },
  state: { type: String, default: null },
  city: { type: String, default: null },
  pin: { type: String, default: null },
  address: { type: String, default: null },
  currentposition: { type: String, default: null },

  img: { type: String, default: null },

  school: [
    {
      name: [{ type: String, default: null }],
      startdate: [{ type: Date, default: Date.now }],
      enddate: [{ type: Date, default: Date.now }],
      degree: [{ type: String, default: null }],
      gpa: [{ type: Number, default: null }],
      location: [{ type: String, default: null }],
    },
  ],

  work: [
    {
      companyname: [{ type: String, default: null }],
      jobtitle: [{ type: String, default: null }],
      state: [{ type: String, default: null }],
      city: [{ type: String, default: null }],
      startdate: [{ type: Date, default: null }],
      enddate: [{ type: Date, default: null }],
      jobdescription: [{ type: String, default: null }],
    },
  ],

  skills: [
    {
      skillsname: [{ type: String, default: null }],
      skillsdetails: [{ type: Number, default: 0 }],
    },
  ],

  project: [
    {
      projectname: [{ type: String, default: null }],
      project1description: [{ type: String, default: null }],
      link: [{ type: String, default: null }],
      toolsused: [{ type: String, default: null }],
    },
  ],

  awards: [
    {
      awardname: [{ type: String, default: null }],
      awarddate: [{ type: Date, default: null }],
      awarder: [{ type: String, default: null }],
      Awarddescription: [{ type: String, default: null }],
    },
  ],

  extra: [
    {
      hobbie: [{ type: String, default: null }],
      strength: [{ type: String, default: null }],
      language: [{ type: String, default: null }],
      goals: [{ type: String, default: null }],
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


   noOfeducation: { type: Number, default: 1 },
   noOfProjects: { type: Number, default: 1 },
   noOfSkills: { type: Number, default: 1 },
   noOfWorkExperience: { type: Number, default: 1 },
   noOfAwards: { type: Number, default: 1 },
   filepresentornot: { type: Number, default: 0 },
   noOfhobbies: { type: Number, default: 1 },
   noOfStrengths: { type: Number, default: 1 },
   noOfLanguage: { type: Number, default: 1 },
   noOfGoals: { type: Number, default: 1 },



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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/uploads/${req.user.id}/`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

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
  console.log(req.user);
  res.render("front", { currentUser: req.user });
});

app.get("/templates", function (req, res) {
  if (!req.user) res.render("login");
  else res.render("availabletemplates", { currentUser: req.user });
});

app.get("/home", function (req, res) {
  if (!req.user) res.render("login");
  else res.render("home", { currentUser: req.user });
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("signup");
});


app.get("/logout", function (req, res) {
 

  req.logout();
  res.redirect("/");
});



let templateno = 1;

app.get("/download", function (req, res) {
  Project.find({ _id: req.user.id }, function (err, posts) {
    if (!err) {
      res.render("template" + templateno, { found: posts });
    }
  });
});

let noOfeducation = 1;
let noOfProjects = 1;
let noOfSkills = 1;
let noOfWorkExperience = 1;
let noOfAwards = 1;

let filepresentornot = 0;

let noOfhobbies = 1;

let noOfStrengths = 1;

let noOfLanguage = 1;

let noOfGoals = 1;

app.get("/:customName", function (req, res) {
  let customListName = req.params.customName;

  const loader = multer({ dest: `public/uploads/${req.user.id}/` });

  Project.find({ _id: req.user.id }, function (err, found) {
    if (!err) {
      res.render(customListName, {
        current: customListName,
        found: found,
      });
    }
  });
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
         
          filepresentornot = 0;count = 1;noOfProjects = 1;noOfSkills = 1;
          noOfWorkExperience = 1;noOfAwards = 1;noOfhobbies = 1;
          noOfStrengths = 1;noOfLanguage = 1;noOfGoals = 1;
          res.redirect("/");
        });
      }
    }
  );
});

app.post("/profile", function (req, res) {
  console.log(req.body);
  var myquery = { _id: req.user.id };
  var newvalues = {
    $set: {
      firstname: req.body.firstname,
      profile: req.body.profile,
      email: req.body.email,
      pno: req.body.pno,
      website: req.body.website,
      github: req.body.github,
      linkedin: req.body.linkedin,
      twitter: req.body.twitter,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      pin: req.body.pin,
      address: req.body.address,
      currentposition: req.body.currentposition,
    },
  };
  Project.updateMany(myquery, newvalues, function (err, res) {
    if (!err) console.log("Documents updated successfully");
  });
  res.redirect("/education");
});

app.post("/education", function (req, res) {
  let value = req.body.btn;
  if (value === "1") {
    noOfeducation++;
  } else {
    if (value === "2" && noOfProjects > 1) {
      noOfeducation--;
    }
  }

  var myquery = { _id: req.user.id };


  Project.updateOne(myquery, { $set: { noOfeducation:noOfeducation} }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });

  Project.updateMany(myquery, { $set: { school: [] } }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });

  var newvalue = {
    $push: {
      school: {
        name: req.body.name,
        startdate: req.body.startdate,
        enddate: req.body.enddate,
        degree: req.body.degree,
        gpa: req.body.gpa,
        location: req.body.location,
      },
    },
  };
  Project.updateMany(myquery, newvalue, function (err, res) {
    if (!err) console.log("Documents inserted successfully");
  });

  if (value === "3") {
    res.redirect("/work");
  } else {
    res.redirect("/education");
  }
});
app.post("/work", function (req, res) {
  let value = req.body.btn;
  if (value === "1") {
    noOfWorkExperience++;
  } else {
    if (value === "2" && noOfWorkExperience > 1) {
      noOfWorkExperience--;
    }
  }

  var myquery = { _id: req.user.id };


  Project.updateOne(myquery, { $set: { noOfWorkExperience:noOfWorkExperience} }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });


  Project.updateMany(myquery, newvalue, function (err, res) {
    if (!err) console.log("Documents inserted successfully");
  });

  let arr = req.body.companyname;
  Project.updateMany(myquery, { $set: { work: [] } }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });

  var newvalue = {
    $push: {
      work: {
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

  if (value === "3") {
    res.redirect("/skills");
  } else {
    res.redirect("/work");
  }
});

app.post("/skills", function (req, res) {
  console.log(req.body);

  let value = req.body.btn;
  if (value === "1") {
    noOfSkills++;
  } else if (value === "2" && noOfSkills > 1) {
    noOfSkills--;
  }

  var myquery = { _id: req.user.id };

  Project.updateOne(myquery, { $set: { noOfSkills:noOfSkills} }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });


  Project.updateMany(myquery, { $set: { skills: [] } }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });

  var newvalue = {
    $push: {
      skills: {
        skillsname: req.body.skillsname,
        skillsdetails: req.body.skillsdetails,
      },
    },
  };
  Project.updateMany(myquery, newvalue, function (err, res) {
    if (!err) console.log("Documents inserted successfully");
  });

  if (value === "3") {
    res.redirect("/projects");
  } else {
    res.redirect("/skills");
  }
});

app.post("/projects", function (req, res) {
  let value = req.body.btn;
  if (value === "1") {
    noOfProjects++;
  } else {
    if (value === "2" && count > 1) {
      noOfProjects--;
    }
  }

  var myquery = { _id: req.user.id };

  Project.updateOne(myquery, { $set: { noOfProjects:noOfProjects} }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });


  Project.updateMany(myquery, { $set: { project: [] } }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });

  var newvalue = {
    $push: {
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

  if (value === "3") {
    res.redirect("/awards");
  } else {
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
 var myquery = { _id: req.user.id };

  Project.updateOne(myquery, { $set: { noOfAwards:noOfAwards} }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });

 

  let arr = req.body.awardname;
  Project.updateMany(myquery, { $set: { awards: [] } }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });

  var newvalue = {
    $push: {
      awards: {
        awardname: req.body.awardname,
        awarddate: req.body.awarddate,
        awarder: req.body.awarder,
        Awarddescription: req.body.Awarddescription,
      },
    },
  };
  Project.updateMany(myquery, newvalue, function (err, res) {
    if (!err) console.log("Documents inserted successfully");
  });

  if (value === "3") {
    res.redirect("/personal");
  } else {
    res.redirect("/awards");
  }
});

app.post("/personal", upload.single("photo"), function (req, res) {
  let imagefile = req.file.originalname;
  //  console.log(req.file);
  //  console.log(imagefile);
  //  console.log(req.body);




  var myquery = { _id: req.user.id };
  var newvalues = {
    $set: {
      img: imagefile,
    },
  };
  Project.updateOne(myquery, newvalues, function (err, res) {
    if (!err) console.log("Document updated successfully");
  });

  filepresentornot = 1;

  Project.updateOne(myquery, { $set: {filepresentornot:filepresentornot} }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });

  fs.readdir(`./public/uploads/${req.user.id}/`, (err, files) => {
    if (err) {
      console.log(err);
    }

    files.forEach((file) => {
      const fileDir = path.join(`./public/uploads/${req.user.id}/`, file);

      if (file !== imagefile) {
        fs.unlinkSync(fileDir);
      }
    });
  });

  res.redirect("/personal");
});

app.post("/extra", function (req, res) {
  console.log(req.body);

  if (req.body.btn === "1") {
    noOfhobbies++;
  } else if (req.body.btn === "2" && noOfhobbies > 1) {
    noOfhobbies--;
  } else if (req.body.btn === "3") {
    noOfStrengths++;
  } else if (req.body.btn === "4" && noOfStrengths > 1) {
    noOfStrengths--;
  } else if (req.body.btn === "5") {
    noOfLanguage++;
  } else if (req.body.btn === "6" && noOfLanguage > 1) {
    noOfLanguage--;
  } else if (req.body.btn === "7") {
    noOfGoals++;
  } else if (req.body.btn === "8" && noOfGoals > 1) {
    noOfGoals--;
  }

  var myquery = { _id: req.user.id };

  Project.updateMany(myquery,
     { $set: { noOfGoals:noOfGoals,noOfLanguage:noOfLanguage,noOfhobbies:noOfhobbies,
      noOfStrengths:noOfStrengths,} },
     function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });

  Project.updateMany(myquery, { $set: { extra: [] } }, function (err, res) {
    if (!err) console.log("Documents deleted successfully");
  });

  var newvalue = {
    $push: {
      extra: {
        hobbie: req.body.hobbie,
        strength: req.body.strength,
        language: req.body.language,
        goals: req.body.goal,
      },
    },
  };
  Project.updateMany(myquery, newvalue, function (err, res) {
    if (!err) console.log("Documents inserted successfully");
  });

  res.redirect("/download");
});


app.post("/",function(req,res){
  console.log(req.body.btn);
let value=req.body.btn;
  if(value==="1"&&req.user){


    var myquery = { _id: req.user.id };

    Project.updateMany(myquery, { $set: 
      { 
        
        school:[],work:[],skills:[],project:[],awards:[],extra:[],
        img:null,currentposition:null,address:null,pin:null,
        city:null,state:null,country:null,twitter:null,linkedin:null,github:null,
        website:null,pno:null,email:null,profile:null,firstname:null,
        filepresentornot: 0,count: 1,noOfProjects:1,noOfSkills:1,
        noOfWorkExperience:1,noOfAwards:1,noOfhobbies:1,
        noOfStrengths:1,noOfLanguage:1,noOfGoals:1,
      
      } 
    
    
    }, function (err, res) {
      if (!err) console.log(" All Documents deleted successfully");
    });

        filepresentornot = 0;count = 1;noOfProjects = 1;noOfSkills = 1;
        noOfWorkExperience = 1;noOfAwards = 1;noOfhobbies = 1;
        noOfStrengths = 1;noOfLanguage = 1;noOfGoals = 1;

  }
  
  if(value==="3")
  {
    res.redirect("/templates");
  }
  else if(value==="2")
  {
    res.redirect("/templates")
  }
  else{
  res.redirect("/home")
  }
})


app.post("/home",function(req,res)
{
  res.render("availabletemplates", { currentUser: req.user });
})

app.listen("3000", function () {
  console.log("Server has been started at port 3000");
});
