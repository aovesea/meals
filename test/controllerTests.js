describe('Controllers', function(){
    var app = require('../app');
    var request = require('supertest');
    var should = require('should');

    describe('Items', function() {
        var item;

        beforeEach(function(done) {
            var itemToCreate = {name: "Item"};
            request(app).post('/items').send(itemToCreate).end(function(error, res) {
                item = res.body;
                done();
            });
        });

        it ('should create an item', function() {
            item.should.have.property('_id');
            item.should.have.property('name');
        });

        it ('should update an item', function(done) {
            item.name = 'Other Item';
            request(app).put('/items/' + item._id).send(item).end(function(error, res) {
                var updatedItem = res.body;
                updatedItem.name.should.equal(item.name);
                done();
            });
        });

        it ('should delete an item', function(done) {
            var retrieveItem = function() {
                request(app).get('/items/' + item._id).end(function(error, res) {
                    res.status.should.equal(404);
                    done();
                });
            };

            request(app).del('/items/' + item._id).end(function(error, res) {
                retrieveItem();
            });
        });

        it ('should get an item', function(done) {
            request(app).get('/items/' + item._id).end(function(error, res) {
                res.body.name.should.equal(item.name);
                res.body._id.should.equal(item._id);
                done();
            });
        });

        afterEach(function() {
            request(app).del('/items/' + item._id);
        });

    });

    describe('Recipes', function() {
        describe('with out ingredients', function() {
            var recipe;
            beforeEach(function(done) {
                var recipeToCreate = {
                    name: 'My Recipe',
                    description: "Description",
                    items: []
                };
                request(app).post('/recipes').send(recipeToCreate).end(function(error, res) {
                    recipe = res.body;
                    done();
                });
            });

            afterEach(function(done) {
                request(app).del("/recipes/" + recipe._id);
                done();
            });

            it('should create recipe with fields', function() {
                recipe.name.should.equal('My Recipe');
                recipe.description.should.equal('Description');
            });

            it('should update recipe fields', function(done) {
                recipe.name = "Other Recipe";
                recipe.description = "Other description";
                request(app)
                    .put('/recipes/' + recipe._id)
                    .send(recipe)
                    .expect(200)
                    .end(function(error, res){
                        res.body.name.should.equal(recipe.name);
                        res.body.description.should.equal(recipe.description);
                        done();
                    });
            });

            it('should update recipe description', function(done) {
                recipe.description = "description";
                request(app)
                    .put('/recipes/' + recipe._id)
                    .send(recipe)
                    .expect(200)
                    .end(function(error, res) {
                        res.body.description.should.equal(recipe.description);
                        done();
                    });
            });

            it('should add an ingredient', function(done) {
                // TODO add helper to capture this
                var item = {name: 'Item'};

                var retrieveRecipe = function(recipeId) {
                    request(app).get('/recipes/' + recipeId).end(function(error, res) {
                        res.body.ingredients.should.have.length(1);
                        res.body.ingredients[0].should.have.property('measurement');
                        res.body.ingredients[0].item.name.should.equal(item.name);
                        done();
                    });
                }

                var addIngredientToRecipe = function(recipeId, itemId) {
                    var ingredient = {
                        measurement: "1/2 cup",
                        item: itemId
                    };
                    request(app).put('/recipes/' + recipeId + '/ingredients').send([ingredient]).end(function(error, res) {
                        retrieveRecipe(recipeId);
                    });
                };

                var onItemCreated = function(itemId) {
                    addIngredientToRecipe(recipe._id, itemId);
                };

                var createItem = function(callback) {
                    request(app).post('/items').send(item).end(function(error, res) {
                        callback(res.body._id);
                    })
                };

                createItem(onItemCreated);
            });

            it('should delete recipe', function(done) {
                var onRecipeReturned = function(error, res) {
                    Object.keys(res.body).length.should.equal(0);
                    done();
                };

                var checkRecipe = function() {
                    request(app).get('/recipes/' + recipe._id).expect(204).end(onRecipeReturned);
                };

                request(app).del('/recipes/' + recipe._id).expect(204).end(function(error, res) {
                    checkRecipe();
                });
            });
        });

        describe('with ingredients', function() {
            var recipe;

            beforeEach(function(done) {
                var recipeToCreate = {
                    name: 'My Recipe'
                };

                var retrieveRecipe = function(recipeId) {
                    request(app).get('/recipes/' + recipeId).end(function(error, res) {
                        recipe = res.body;
                        done();
                    });
                }

                var addItemToRecipe = function(recipeId, itemId) {
                    var ingredient = {
                        measurement: "1/2 cup",
                        item: itemId
                    };
                    request(app).put('/recipes/' + recipeId + '/ingredients').send([ingredient]).end(function(error, res) {
                        retrieveRecipe(recipeId);
                    });
                };

                var createItem = function(callback) {
                    var item = {name: 'Item 1'};
                    request(app).post('/items').send(item).end(function(error, res) {
                        callback(res.body._id);
                    })
                };

                var onItemCreated = function (itemId) {
                    addItemToRecipe(recipe._id, itemId);
                };

                request(app).post('/recipes').send(recipeToCreate).end(function(error, res) {
                    recipe = res.body;
                    createItem(onItemCreated);
                });
            });

            afterEach(function(done) {
                request(app).del("/recipes/" + recipe._id);
                done();
            });

            it('should return recipe and items', function(done) {
                recipe.should.have.property('name');
                recipe.ingredients.forEach(function(ingredient) {
                    ingredient.should.have.property('measurement');
                    ingredient.should.have.property('item');
                    ingredient.item.should.have.property('name');
                });
                done();
            });

            it('should add a new item', function(done) {
                var item = {name: 'Item'};

                var retrieveRecipe = function(recipeId) {
                    request(app).get('/recipes/' + recipeId).end(function(error, res) {
                        res.body.ingredients.should.have.length(2);
                        done();
                    });
                }

                var addIngredientToRecipe = function(recipeId, itemId) {
                    var ingredient = {
                        measurement: "1/2 cup",
                        item: itemId
                    };
                    var data = [ingredient, recipe.ingredients[0]];
                    request(app).put('/recipes/' + recipeId + '/ingredients').send(data).end(function(error, res) {
                        retrieveRecipe(recipeId);
                    });
                };

                var onItemCreated = function(itemId) {
                    addIngredientToRecipe(recipe._id, itemId);
                };

                var createItem = function(callback) {
                    request(app).post('/items').send(item).end(function(error, res) {
                        callback(res.body._id);
                    })
                };

                createItem(onItemCreated);
            });

            it('should remove an existing item', function(done) {
                var retrieveRecipe = function(recipeId) {
                    request(app).get('/recipes/' + recipeId).end(function(error, res) {
                        var recipeFromServer = res.body;
                        recipeFromServer.ingredients.length.should.equal(0);
                        done();
                    });
                };

                request(app).put('/recipes/' + recipe._id + '/ingredients').send([]).end(function(error, res) {
                    retrieveRecipe(recipe._id);
                });
            });

            describe("delete recipe", function() {
                beforeEach(function(done) {
                    request(app).del('/recipes/' + recipe._id).expect(204).end(function(error, res) {
                        done();
                    });
                });

                it('should delete recipe', function(done) {
                    var onRecipeReturned = function(error, res) {
                        Object.keys(res.body).length.should.equal(0);
                        done();
                    };

                    request(app).get('/recipes/' + recipe._id).expect(204).end(onRecipeReturned);
                });

                it('should not delete items', function(done) {
                    var ingredient = recipe.ingredients[0];

                    var containsItem = function(element) {
                        return element._id == ingredient.item._id;
                    };

                    var onItemsReturned = function(error, res) {
                        var items = res.body;
                        items.some(containsItem).should.equal(true);
                        done();
                    };

                    request(app).get('/items').expect(200).end(onItemsReturned);
                });
            });
        });

        it('should create a recipe', function(done) {
            var recipe = {name: 'My Recipe'};
            request(app)
                .post('/recipes')
                .send(recipe)
                .end(function(error, res){
                    res.body._id.should.not.equal(null);
                    res.body.name.should.equal(recipe.name);
                    done();
                });
        });
    });
});