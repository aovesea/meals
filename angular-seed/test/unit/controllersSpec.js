'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
    beforeEach(module('myApp.controllers'));
    var ctrl, scope, $httpBackend, location;

    describe('CreateRecipeController', function() {
        var recipe;
        var ingredient;
        beforeEach(inject(function ($location, $rootScope, $controller, $injector) {
            location = $location;
            $httpBackend = $injector.get('$httpBackend');
            recipe = {
                _id: '1234',
                name: 'New Recipe Name'
            };
            ingredient = {
                _id: '1234',
                name: 'Ingredient'
            };
            $httpBackend.when('POST', 'http://localhost:3000/recipes').respond(recipe);
            $httpBackend.when('POST', 'http://localhost:3000/ingredients').respond(ingredient);
            $httpBackend.when('PUT', 'http://localhost:3000/recipes/' + recipe._id + '/ingredients').respond([ingredient]);
            scope = $rootScope.$new();
            ctrl = $controller('CreateRecipeCtrl', {$scope: scope});

            scope.recipe = {name: "New Recipe Name"};
            scope.recipe.ingredients = [{name: 'Ingredient'}];
            scope.save();
        }));

        it('should save recipe', inject(function() {
            $httpBackend.expectPOST('http://localhost:3000/recipes', scope.recipe);

            $httpBackend.flush();
        }));

        it('should redirect to newly created recipe', inject(function() {
            $httpBackend.flush();

            expect(location.path()).toBe("/recipes/" + recipe._id + "/edit");
        }));
    });

    describe('EditRecipeCtrl', function() {
        var recipe;
        var ingredient;
        beforeEach(inject(function ($location, $rootScope, $controller, $injector) {
            this.addMatchers({
                // we need to use toEqualData because the Resource has extra properties
                // which make simple .toEqual not work.
                toEqualData: function(expect) {
                    return angular.equals(expect, this.actual);
                }
            });

            location = $location;
            $httpBackend = $injector.get('$httpBackend');
            recipe = {
                _id: '1234',
                name: 'New Recipe Name',
                ingredients: [{
                    _id: '1234',
                    name: 'Ingredient'
                }]
            };

            $httpBackend.when('GET', 'http://localhost:3000/recipes/' + recipe._id).respond(recipe);

            scope = $rootScope.$new();
            ctrl = $controller('EditRecipeCtrl', {
                $scope: scope,
                $routeParams: {
                    recipeId: recipe._id
                }
            });

            $httpBackend.flush();
        }));

        it('should load recipe', inject(function() {
            expect(scope.recipe).toEqualData(recipe);
        }));

        it('should save recipe when not updating anything', inject(function() {
            $httpBackend.when('PUT', 'http://localhost:3000/recipes/' + recipe._id + '/ingredients').respond(recipe.ingredients);
            $httpBackend.expect('PUT', 'http://localhost:3000/recipes/' + recipe._id, recipe);

            scope.save();

            $httpBackend.flush();
        }));
    });

    describe('ShowRecipeCtrl', function() {
        var recipe;
        beforeEach(inject(function($rootScope, $controller, $injector) {
            $httpBackend = $injector.get('$httpBackend');
            recipe = {
                _id: '1234',
                name: 'New Recipe Name'
            };
        }));
    });

    describe('Recipes', function() {
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            ctrl = $controller('RecipeCtrl', {$scope: scope});

            scope.recipe = {
                name: "My Recipe"
            };
            scope.addIngredient();
        }));

        it('should add ingredient', inject(function() {
            expect(scope.recipe.ingredients.length).toEqual(1);
        }));

        it('should add multiple ingredients', inject(function() {
            scope.addIngredient();
            expect(scope.recipe.ingredients.length).toEqual(2);
        }));

        it('should remove ingredient', inject(function() {
            scope.addIngredient();
            scope.removeIngredient(scope.recipe.ingredients[0]);
            expect(scope.recipe.ingredients.length).toEqual(1);
        }));

        it('should not remove last ingredient', inject(function() {
            scope.removeIngredient(scope.recipe.ingredients[0]);
            expect(scope.recipe.ingredients.length).toEqual(1);
        }));

        it('should only show remove button more than one ingredients', inject(function() {
            expect(scope.canRemoveIngredient()).toEqual(false);
        }));

        it('should hide remove button if only one ingredient', inject(function() {
            scope.addIngredient();
            expect(scope.canRemoveIngredient()).toEqual(true);
        }));
    });

    describe('Ingredients', function() {
        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            ctrl = $controller('ShowIngredientsCtrl', {$scope: scope});
        }));
    });
});
