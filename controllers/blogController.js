const Blog = require("../models/blog");

// Get all blogs
const blog_index = (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then((result) => {
      res.render("blogs/index", { title: "All Blogs", blogs: result })
    })
    .catch((err) => {
      console.log(err);
    })
}

// Get a single blog by id
const blog_details = (req, res) => {
  const id = req.params.id
  Blog.findById(id)
    .then(result => {
      res.render("blogs/details", { blog: result, title: "Blog details" })
    })
    .catch(err => {
      res.status(404).render("404", {title: "blog not found"})
    })
}

// Render form
const blog_create_get = (req, res) => {
  res.render("blogs/create", { title: "Add a new blog" })
}

// Create blog
const blog_create_post = (req, res) => {
  const blog = new Blog(req.body);
  blog.save()
    .then(() => {
      res.redirect("/blogs")
    })
    .catch((err) => {
      console.log(err)
    })
}

// Delete blog
const blog_delete = (req, res) => {
  const id = req.params.id
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' })
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports = {
  blog_index,
  blog_details,
  blog_create_get,
  blog_create_post,
  blog_delete
}