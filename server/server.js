var express = require('express');
var mongoose = require('mongoose');
var Recipe = require('./db/models/recipe');
var User = require('./db/models/user');
var Group = require('./db/models/group');
var bodyParser = require('body-parser');
var app = express();
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017';
var dummyData = require('./dummy.js');

mongoose.Promise = Promise;
mongoose.connect(mongoUri);
// dummy data loading
Recipe.find({}).then(function(recipes) {
  if (recipes.length < 20) {
    dummyData.addDummyRecipes();
  }
});
User.find({}).then(function(users) {
  if (users.length < 3) {
    dummyData.addUsers();
  }
});
Group.find({}).then(function(groups) {
  if (groups.length < 3) {
    dummyData.addDummyGroups();
  }
})
app.use('/', express.static(__dirname + '/../public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.render('index');
});


// grab all /api requests and send them to the
// api router
var apiRoutes = express.Router();
app.use('/api', apiRoutes);
require('./lib/apiRoutes.js')(apiRoutes);

module.exports = app;