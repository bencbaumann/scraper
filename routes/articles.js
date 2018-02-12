var express = require('express');
var router = express.Router();

const db = require('../models');

/* GET articles page. */
router.get('/', function(req, res, next) {
  db.Article.find({}, function (err, articles) {
    if (err) console.log(err);
    console.log(articles);
    const data = {};
    data.articles = articles;
    data.title = "Articles";
    res.render('index', data);
  });
});

router.post('/', function(req, res, next) {
  console.log("save article");
  const article = req.body;
  console.log(article);
  db.Article.create(article)
  .then(function(dbArticle) {
    // View the added result in the console
    console.log(dbArticle);
    res.json({msg: "Aticle Saved"});
  })
  .catch(function(err) {
    if(err.code === 11000){
      res.json({msg: "This article is already saved"})
    } 
    console.log(err.code);
    console.log(err.message);
  });
});

router.delete('/', function(req, res, next) {
  console.log("delete article");

  const id = req.body.id;
  db.Article.remove({ _id: id })
  .then(()=> res.json({msg: "Deleted"}))
  .catch(console.log)
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("notes")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      // console.log(dbArticle);
      console.log(JSON.stringify(dbArticle, null, 2));
      res.json(dbArticle);
      // res.json({msg: "got it"});
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
router.post("/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  console.log("saving it");
  console.log(req.body);
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      

      // return db.Article.findOneAndUpdate({ _id: req.params.id }, { notes: dbNote._id }, { new: true });
      return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: {notes: dbNote._id}}, {new: true});
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for Deleting a note attached to an article
router.delete("/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  console.log("Deleting it");
  console.log(req.body);
  db.Note.remove({ _id: req.params.id })
  .then(res.json({msg: "removed"}))
  .catch(console.log)
});

module.exports = router;
