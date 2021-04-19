const express = require('express')
const router = express.Router();

//Bring in model
let Article = require('../models/article');


//Edit Signle Article button
router.get('/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      title: 'Edit Article',
      article:article
    });
  });
});

// Add Articale Route
router.get('/add', function(req, res){
  res.render('add_articale', {
    title: 'Add Articale'
  });
});

// Add Article to Mongodb
router.post('/add', function(req, res){

  req.checkBody('title','Title is Required').notEmpty();
  req.checkBody('author','Author is Required').notEmpty();
  req.checkBody('body','Body is Required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_articale', {
      title: 'Add Article',
      errors:errors
    });
  }
  else{
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
  
    article.save(function(err){
      if(err)
      {
        console.log(err);
        return;
      }
      else
      {
        req.flash('success', 'Article Added')
        res.redirect('/')
      }
    });
  }

});


// Update existing Article in database
router.post('/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}
  Article.updateOne(query, article, function(err){
    if(err)
    {
      console.log(err);
      return;
    }
    else
    {
      req.flash('success', 'Artical Updated Successfuly')
      res.redirect('/')
    }
  });
});

//delete article
router.delete('/:id', function(req, res){
  let query = {_id:req.params.id}
  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    else{
      res.send('Success');
    }
  });
});


//Get single Article Route
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('article', {
      title: 'Add Article',
      article:article
    });
  });
});

module.exports = router;