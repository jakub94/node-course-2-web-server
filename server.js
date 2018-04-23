const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

const port = process.env.PORT || 3000; // defaults to 3000 if PORT environment variable does not exist. (It does exist on Heroku machines)
var app = express();

hbs.registerPartials(__dirname + "/views/partials"); //Tells Handlebars where to find its partials

app.set("view engine", "hbs"); //TELL Express to use Handlebars as view engine

// app.use is used to register middleware
app.use((req, res, next) => {

  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile("server.log", log + "\n", (err) => {
    console.log("Unable to append to server.log");
  });

  next(); //Application continues to run. ALWAYS needs to be executed when middleware is done doing stuff.
});

// app.use((req, res, next) => {
//   res.render("maintenance.hbs"); //Next is never called. --> This is always shown!
// });


//This needs to be AFTER middleware, otherwise it will be accesible even when maintenance middleware is active
app.use(express.static(__dirname + "/public")); //__dirname stores the directory of THIS file (here server.js)


//HELPERS
hbs.registerHelper("getCurrentYear", () => { // Register a Helper Method that enables Handlebar to execute this method from the template code
  return new Date().getFullYear();
});

hbs.registerHelper("screamIt", (text) => { // Register a Helper Method that enables Handlebar to execute this method from the template code
  return text.toUpperCase();
});




app.get("/", (req, res) =>{

  //res.send("<h1>Hello Express!!!</h1>");
  // res.send({
  //   name: "Jakub",
  //   likes: [
  //     "Fitness",
  //     "Guitar",
  //     "Food"
  //   ]
  // });

    res.render("home.hbs", {
      pageTitle: "Home Page",
      welcomeText: "Welcome to this sweet Webpage"
    }); //Tells Express to render a page

});

app.get("/about", (req, res) => {

  res.render("about.hbs", {
    pageTitle: "About Page",
  }); //Tells Express to render a page

});

app.get("/bad", (req, res) => {
  res.send({
    errorMessage: "Error while trying to handle request!"
  });
});


app.listen(port, () => {
  console.log("Server is up on port: ", port);
});
