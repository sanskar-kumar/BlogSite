//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');

const homeStartingContent = "Start your daily blog posts by clicking compose.Go and start your daily blog😎😎";
const app = express();
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/blogDB")
    .then(() => console.log("Successfull"))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogDB")
    .then(() => console.log("Successfull"))
    .catch((err) => console.log(err));


const postSchema = {
    heading: String,
    content: String
};
const Post = mongoose.model("Post", postSchema);





app.get("/", function(req, res) {
    Post.find({}, function(err, foundItems) {
        res.render('home', { homepara: homeStartingContent, contents: foundItems });
    });



});
app.get("/contact", function(req, res) {
    res.render('contact');
});
app.get("/compose", function(req, res) {
    res.render('compose');
});
app.get("/post/:title", function(req, res) {
    // console.log(req.params.title);
    // const requestedTitle = _.capitalize(req.params.title);

    var postTitle = req.params.title;

    Post.findOne({ heading: postTitle }, function(err, foundList) {
        if (!err) {
            if (!foundList) {
                console.log("No Such Posts");
            } else {
                res.render("post", { title: foundList.heading, content: foundList.content });
            }
        }
    });
});

app.post("/compose", function(req, res) {
    const post = new Post({
        heading: req.body.postTitle,
        content: req.body.postContent
    });
    post.save();
    res.redirect("/");

});









app.listen(3000, function() {
    console.log("Server started on port 3000");
});