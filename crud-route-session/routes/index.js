var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID
var assert = require('assert');
const { ObjectId } = require('mongodb');

var url = 'mongodb://localhost:27017/test1';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', success: req.session.success, errors: req.session.errors });
  req.session.errors = null;
  req.session.success = null;
});

router.get('/get-data', function(req, res, next){
  var resultArray = [];
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    var cursor = db.collection('user-data').find();
    cursor.forEach(function(entry, err){
      assert.equal(null, err);
      resultArray.push(entry);
    }, function(){
      db.close();
      console.log(resultArray)
      res.render('all_infos', { items: resultArray})
      
    })
  })
})

//bring update page
///show-updateone/{{this._id}}/{{this.name}}/{{this.age}}
// router.get('/show-updateone', function(req, resp){
 
//   let info = req.params.info;
//   console.log("update fields ", req.params.id)
//   let info;
//   let obj = {
//     id: req.params.id,
//     name: req.params.name,
//     age: req.params.age
//   };
  
//   resp.render('update_data');

//   let searchQuery = {
//     _id: req.params.id
//   }
//   let newValues = {
//     $set : {
//       name: req.params.name,
//       age: req.params.age
//     }
//   }

//   mongo.connect(url, function(err, db){
//     assert.equal(null, err);
//     db.collection('user-data').updateone(searchQuery, newValues, function(err, res){
//       assert.equal(null, err);
//       info = res;
//       console.log("info "+ info.name)
//       db.close();
//       resp.render('update_data', {obj: obj});
      
//     })
//   })
// })


router.get('/show-update-page/:id/:name/:age', function(req, resp){
  let info = {
    id: req.params.id,
    name:req.params.name,
    age: req.params.age
  }

  resp.render('update_data', {info:info});
  // first find the entry with id , then redirect
  // let id = req.params.id;
  // console.log(id)
  // let info;
  // mongo.connect(url, function(err, db){
  //   assert.equal(null, err);
  //   db.collection('user-data').findOne({"_id":ObjectId(id)}, function(err, res){
  //     assert.equal(null, err);
  //     info = res;
  //     console.log("info "+ info.name)
  //     db.close();
  //     resp.render('each_data', {infos:info} );
      
  //   })
  // })
})
router.post('/updateOne/:id', function(req, resp, next){
  var item = {
    name: req.body.name,
    age: req.body.age
  }

  let searchQuery = {
     _id: req.body.id
  }
  let newValues = {
    $set : {
      name: item.name,
      age: item.age
    }
  }
  console.log("searchQuery ", searchQuery)
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('user-data').update({"_id": ObjectId(req.params.id)}, {$set: { name: req.body.name, age: req.body.age}}, function(err, res){
      assert.equal(null, err);
      console.log("1 document updated ", res);
      db.close();
      resp.redirect('/get-data');
    })
  })
  //redirect to the get data
  
})

router.get('/show-each/:id', function(req, resp){
  //first find the entry with id , then redirect
  let id = req.params.id;
  console.log(id)
  let info;
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('user-data').findOne({"_id":ObjectId(id)}, function(err, res){
      assert.equal(null, err);
      info = res;
      console.log("info "+ info.name)
      db.close();
      resp.render('each_data', {infos:info} );
      
    })
  })
})

/* remove all entries from a collection */
router.post('/delete', function(req, res, next){
  var item = {
    name: req.body.name,
    age: req.body.age
  }
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    //remove all from  a collection
    db.collection('user-data').remove({}, function(err, result){
      assert.equal(null, err);
      console.log(res);
      db.close();
    })
    
  })
  //redirect to the get data
  res.redirect('/'); //go to another page
})

/* remove one entry from db */
/* https://stackoverflow.com/questions/7883871/remove-only-one-document-in-mongodb */
router.get('/deleteone/:id', function(req, resp){
  
  let id = req.params.id;
  //console.log(id)
  
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    let criteria = {_id:id}
    console.log("criteria "+criteria.id)
    db.collection('user-data').deleteOne({"_id": ObjectId(id)},  function(err, res){
      if(err) console.log(error)
      assert.equal(null, err);
      console.log(res)
      db.close();
      resp.redirect('/get-data');
    })
  })
}) 



router.post('/insert', function(req, res, next){
  var item = {
    name: req.body.name,
    age: req.body.age
  }
  //validate only alphabets & whitespaces
  req.check('name').matches(/^[A-Za-z\s]+$/).withMessage('WhiteSpaces & alphabets only')
  req.check('age').isNumeric().withMessage('Only Numeric values');

  var errors = req.validationErrors();
  if(errors){
    req.session.errors = errors;
    req.session.success = false;
    res.redirect('/');
  } else {
    mongo.connect(url, function(err, db){
      assert.equal(null, err);
      db.collection('user-data').insertOne(item, function(err, result){
        assert.equal(null, err);
        //console.log(res)
        db.close();
      })
    })
    //redirect to the get data
    res.redirect('/get-data'); //go to another page
  }//else

  
})

router.get('/list', function(req, res, next){
  res.render('all_infos', {title: 'helo'});
})


module.exports = router