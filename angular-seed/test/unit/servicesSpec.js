'use strict';

/* jasmine specs for services go here */

describe('service', function() {
    beforeEach(module('myApp.services'));


    describe('version', function() {
        it('should return current version', inject(function(version) {
            expect(version).toEqual('0.1');
        }));
    });

    describe('recipeService', function() {
        var $httpBackend;
        var service;
        var baseRecipeUrl = 'http://localhost:3000/recipes';

        beforeEach(inject(function (recipeService, $injector) {
            $httpBackend = $injector.get('$httpBackend');
            service = recipeService;
        }));

        it ('should create recipe', inject(function() {
            var recipe = {
                name: 'Recipe'
            };

            $httpBackend.when('POST', baseRecipeUrl).respond(recipe);
            $httpBackend.expectPOST(baseRecipeUrl, recipe);

            service.createRecipe(recipe);

            $httpBackend.flush();
        }));

        it ('should add ingredients to recipe', inject(function() {
            // TODO pull this out into a helper for creating fake recipe/ingredients
            var recipe = {
                _id: '1234'
            };
            var ingredients = [
                {
                    measurement: '1/2 cup',
                    item: {
                        _id: '1234',
                        name: 'Spinach'
                    }
                }
            ];

            $httpBackend.when('PUT', baseRecipeUrl + '/' + recipe._id + '/ingredients').respond(ingredients);
            $httpBackend.expectPUT(baseRecipeUrl + '/' + recipe._id + '/ingredients', ingredients);

            service.addIngredientsToRecipe(recipe, ingredients);

            $httpBackend.flush();
        }));

        describe('prepareIngredients', function() {
            it ('should prepare single ingredient', function() {
                var ingredients = [
                    {
                        measurement: '1/2 cup',
                        item: {
                            _id: '1234',
                            name: 'Spinach'
                        }
                    }
                ];

                var preparedIngredients = service.prepareIngredients(ingredients);

                expect(preparedIngredients[0].item).toEqual(ingredients[0].item._id);
            });

            it ('should prepare multiple ingredients', function() {
                var ingredients = [
                    {
                        measurement: '1/2 cup',
                        item: {
                            _id: '1234',
                            name: 'Spinach'
                        }
                    },
                    {
                        measurement: '1/2 cup',
                        item: {
                            _id: '5678',
                            name: 'Banana'
                        }
                    }
                ];

                var preparedIngredients = service.prepareIngredients(ingredients);

                expect(preparedIngredients.length).toEqual(ingredients.length);
                for (var i = 0; i < preparedIngredients.length; i++) {
                    expect(preparedIngredients[i].item).toEqual(ingredients[i].item._id);
                }
            });

            it ('should return [] when ingredients are []', function() {
                var ingredients = [];
                var preparedIngredients = service.prepareIngredients(ingredients);

                expect(preparedIngredients).toEqual([]);
            });

            it ('should return null when ingredients are null', function() {
                var preparedIngredients = service.prepareIngredients(null);

                expect(preparedIngredients).toEqual(null);
            });
        });
    });
});
