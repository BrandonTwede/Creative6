var express = require('express');
var router = express.Router();
var expressSession = require('express-session');
var mongoose = require('mongoose'),
    User = mongoose.model('User');

var users = require('../controllers/users_controller');
console.log("before / Route");
router.get('/', function(req, res){
    console.log("/ Route");
//    console.log(req);
    console.log(req.session);
    if (req.session.user) {
      console.log("/ Route if user");
      res.render('index', {username: req.session.username,
                           msg:req.session.msg,
                           quote:req.session.quote});
    } else {
      console.log("/ Route else user");
      req.session.msg = 'You must be logged in to see quotes.';
      res.redirect('/login');
    }
});
router.get('/user', function(req, res){
    console.log("/user Route");
    if (req.session.user) {
      res.render('user', {msg:req.session.msg});
    } else {
      req.session.msg = 'Access denied!';
      res.redirect('/login');
    }
});
router.get('/signup', function(req, res){
    console.log("/signup Route");
    if(req.session.user){
      res.redirect('/');
    }
    res.render('signup', {msg:req.session.msg});
});
router.get('/login',  function(req, res){
    console.log("/login Route");
    if(req.session.user){
      res.redirect('/');
    }
    res.render('login', {msg:req.session.msg});
});
router.get('/logout', function(req, res){
    console.log("/logout Route");
    req.session.destroy(function(){
      res.redirect('/login');
    });
  });
  
router.get('/quotes', function(req, res){
  console.log("fetching quotes");
    User.find({quote: {$exists: true, $ne: ""}})
    .exec(function(err, users) {
      if (err) return console.error(err); //If there's an error, print it out
      else {
        console.log("User quotes successfully retrieved");
        console.log(users);
        res.json(users); //Then send the comments
      }
    });
});
router.post('/signup', users.signup);
router.post('/user/update', users.updateUser);
router.post('/user/delete', users.deleteUser);
router.post('/login', users.login);
router.get('/user/profile', users.getUserProfile);


module.exports = router;