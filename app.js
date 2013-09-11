var express = require('express');
var mongoose = require('./models/mongoose.js');

var app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);
app.use(express.bodyParser());

var Schema = mongoose.Schema;
// Models
var Recipe = require('./models/recipe.js').make(Schema, mongoose);
var Item = require('./models/item.js').make(Schema, mongoose);

// Controllers
var RecipeController = require("./controllers/RecipeController.js");
var ItemController = require('./controllers/ItemController.js');

// Routes
require("./routes/recipe.js")(app, new RecipeController(Recipe, Item));
require("./routes/item.js")(app, new ItemController(Item));

// create sample items
Item.create({name : "Spinach"}, function(err, item) {
});
Item.create({name : "Banana"}, function(err, item) {
});

// remove if causing issues
module.exports = app;

app.listen(3000);
console.log('Listening on port 3000');