require("dotenv").config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require("mongoose");
const port = process.env.PORT || 8080
const Blog = require("./models/blog");

//connect to Mnggo DB
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true); // improve data validation and potential error handling
    const connect = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected Successfully ${connect.connection.host}`);
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
connectDB()
  .then(app.listen(port, () => {
    console.log(`server up & running on port ${port}`);
  }))


//register view engine
app.set("view engine", "ejs");


//middleware and static files
app.use(express.static('public')); ////set up Express to serve static files from public directory
app.use(express.urlencoded({extended: true})); //Parses incoming URL-encoded request bodies, populating req.body.<to be able to use req.body in post method>
app.use(morgan('dev')); //// use morgan pakage as a logger

app.get("/", (req, res) => {
  res.redirect("/blogs")
})

app.get("/blogs", (req, res) => {
  Blog.find().sort({createdAt: -1})
  .then((result) => {
    res.render("index", {title: "All Blogs", blogs: result})
  })
  .catch((err) => {
    console.log(err);
  })
})

app.post("/blogs", (req, res, next)=> {
  console.log(req.body)
  const blog = new Blog(req.body);
  blog.save()
  .then(()=> {
    res.redirect("/blogs")
  })
  .catch((err)=>{
    console.log(err)
  })
})

app.get('/blogs/create', (req, res) => {
  res.render("create", { title: "Add a new blog" })
})

app.get('/blogs/:id', (req, res) => {
  const id  = req.params.id
  // console.log(id);
  Blog.findById(id)
  .then(result => {
    res.render("details", {blog: result, title: "Blog details"})
  })
  .catch(err => {
    console.log(err)
  })
})

app.delete('/blogs/:id', (req, res) => {
  const id  = req.params.id
  Blog.findByIdAndDelete(id)
  .then(result => {
    res.json({redirect: '/blogs'})
  })
  .catch(err=>{
    console.log(err)
  })
})

app.get("/about", (req, res) => {
  res.render("about", { title: "About" })
})



//404 page
app.use((req, res) => {
  res.status(404).render('404', { title: "404" })
})