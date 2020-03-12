const express = require("express");
const router = express.Router();

//bringing modules
let Article = require("../modles/article");

//add article
router.get("/add", (req, res) => {
  console.log("add/", req.params);
  res.render("addarticle", {
    title: "Add Article"
  });

  //get single item
  //parasm vayeko route, jahilea last ma
  router.get("/:id", (req, res) => {
    Article.findById(req.params.id, (err, articles) => {
      //   console.log(req.params);
      //   if (err) throw err;
      res.render("viewArticle", {
        articles: articles
      });
    });
  });
});

//add articles using submit
router.post("/add", (req, res) => {
  req.checkBody("title", "Title is required").notEmpty();
  req.checkBody("author", "author is required").notEmpty();
  req.checkBody("body", "body is required").notEmpty();

  //get errors
  let errors = req.validationErrors();

  if (errors) {
    res.render("addarticle", {
      title: "Add Article",
      errors: errors
    });
  } else {
    let article = new Article();
    article.title = req.body.Title;
    article.author = req.body.author;
    article.body = req.body.Body;

    article.save(err => {
      if (err) {
        throw err;
        return;
      } else {
        req.flash("success", "Article added");
        res.redirect("/");
      }
    });
  }
});

//edit articles using submit
router.post("/edit/:id", (req, res) => {
  let article = {};
  article.title = req.body.Title;
  article.author = req.body.author;
  article.body = req.body.Body;

  let query = {
    _id: req.params.id
  };

  Article.update(query, article, err => {
    if (err) {
      throw err;
      return;
    } else {
      req.flash("success", "Article updated");
      res.redirect("/");
    }
  });
});

router.delete("/:id", (req, res) => {
  let query = {
    _id: req.params.id
  };
  Article.remove(query, err => {
    if (err) {
      console.log("error while deleting", err);
    }
    req.flash("info", "Article Deleted");
    res.send("Success");
  });
});

//load edit form
router.get("/edit/:id", (req, res) => {
  Article.findById(req.params.id, (err, articles) => {
    console.log("edit/", req.params);
    res.render("editArticle", {
      title: "Edit Article",
      articles: articles
    });
  });
});

module.exports = router;
