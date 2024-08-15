require("dotenv").config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const port = process.env.PORT || 8080;
const blogRoutes = require("./routes/blogRoutes");
const connectDB = require("./database/db");

// connect to Mnggo DB
connectDB()
  .then(app.listen(port, () => {
    console.log(`server up & running on port ${port}`);
  }))
  .catch((err) => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
  });

// register view engine
app.set("view engine", "ejs");


// middleware and static files
app.use(express.static('public')); //set up Express to serve static files from public directory
app.use(express.urlencoded({ extended: true })); //Parses incoming URL-encoded request bodies, populating req.body.<to be able to use req.body in post method>
app.use(morgan('dev')); //// use morgan pakage as a logger

app.get("/", (req, res) => {
  res.redirect("/blogs")
})

app.get("/about", (req, res) => {
  res.render("about", { title: "About" })
})

// blog routes
app.use("/blogs", blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: "404" })
})