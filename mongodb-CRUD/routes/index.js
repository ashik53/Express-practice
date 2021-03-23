var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID; // we need to access the id of every entry
var assert = require('assert'); // this used for comparing, when we connect to mongo then we will use it 

var url = 'mongodb://localhost:27017/test'; // url points to database, 27017 is mongodb port, test is the database

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index'); // just render index.html
});



router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('user-data').find(); 
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() { // after finishing reading, we call a callback function
      db.close();
      res.render('index', {items: resultArray});
    });
  });
});

//
router.post('/insert', function(req, res, next) { 
  var item = {
    title: req.body.title, // from form, we acccess through req.body.
    content: req.body.content,
    author: req.body.author
  };

  mongo.connect(url, function(err, db) { // connect to the database
    assert.equal(null, err); // asset checks error or not
    // in mongodb there is no table, they use collections
    db.collection('user-data').insertOne(item, function(err, result) { 
      assert.equal(null, err);
      console.log('Item inserted');
      db.close(); // close the db collection
    });
  });

  res.redirect('/'); // after inserting redirect to home page 
});

router.post('/update', function(req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    /*
        id is casted into object, as mongodb has it in object form, so type is important
        { $set: item } is for updating specific entry,
        updateOne function takes two arguments
    */
    db.collection('user-data').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });
});

module.exports = router;
