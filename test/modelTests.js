describe('Models', function() {
    var mongoose = require('../models/mongoose.js');
    var Schema = mongoose.Schema;

    var Item = require('../models/item.js').make(Schema, mongoose);
    var Recipe = require('../models/recipe.js').make(Schema, mongoose);

    describe('Item', function() {
        var item = null;
        beforeEach(function(done) {
            Item.create({name : "Item"}, function(err, ing) {
                item = ing;
                done();
            });
        });

        // Tests
        it('creates a new item', function() {
            item.name.should.equal("Item");
        });

        afterEach(function(done){
            Item.remove({}, function() {
                done();
            });
        });
    });

    describe('Recipe', function() {

        describe('Recipe without items', function() {
            var currentRecipe = null;
            beforeEach(function(done) {
                Recipe.create({name : "My Recipe"}, function(err, recipe) {
                    currentRecipe = recipe;
                    done();
                });
            });

            // Tests
            it('creates a new recipe', function() {
                currentRecipe.name.should.equal("My Recipe");
            });

            afterEach(function(done){
                Recipe.remove({}, function() {
                    done();
                });
            });
        });

        describe('Recipe with item', function() {
            var currentRecipe = null;
            beforeEach(function(done) {
                var item = new Item;
                item.name = "Item";
                item.save(function(err) {
                    var recipe = new Recipe;
                    recipe.name = "My Recipe";
                    recipe.ingredients.push(item);
                    recipe.save(function(err) {
                        currentRecipe = recipe;
                        done();
                    });
                });
            });

            // Tests
            it ('creates a new recipe with an item', function() {
                currentRecipe.ingredients.length.should.equal(1);
            });

            afterEach(function(done){
                Recipe.remove({}, function() {
                    done();
                });
            });
        });

    });
});

