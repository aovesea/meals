'use strict';

/* Controllers */

angular.module('myApp.controllers', ['myApp.services'])
    .controller('RecipeCtrl', ['$scope', '$http', '$routeParams', 'Recipe', function($scope, $http, $routeParams, Recipe) {
        var newIngredient = function() {
            return {name:''};
        };

        $scope.addIngredient = function() {
            if (!$scope.recipe.ingredients) {
                $scope.recipe.ingredients = [];
            }
            $scope.recipe.ingredients.push(newIngredient());
        };

        $scope.removeIngredient = function(ingredient) {
            var ingredients = $scope.recipe.ingredients;
            if (ingredients.length > 1) {
                for (var i = 0, length = ingredients.length; i < length; i++) {
                    if (ingredient === ingredients[i]) {
                        ingredients.splice(i, 1);
                    }
                }
            }
        };

        $scope.canRemoveIngredient = function() {
            return $scope.recipe.ingredients.length > 1;
        }
    }])
    .controller('EditRecipeCtrl', ['$scope', '$http', '$q', '$routeParams', 'Recipe', 'recipeService', function($scope, $http, $q, $routeParams, Recipe, recipeService) {
        $scope.recipe = Recipe.get({id: $routeParams.recipeId});

        $scope.save = function() {
            var ingredients = recipeService.prepareIngredients(angular.copy($scope.recipe.ingredients));

            recipeService.addIngredientsToRecipe($scope.recipe, ingredients).then(function() {
                $scope.recipe.$update();
            });
        };
    }])
    .controller('CreateRecipeCtrl', ['$scope', '$q', '$http', '$location', 'recipeService', function($scope, $q, $http, $location, recipeService) {
        $scope.recipe = {
            name: "My Recipe",
            ingredients: [{item:{name:""}}]
        };
        $scope.save = function() {
            // TODO create new items before adding to recipe

            var ingredients = recipeService.prepareIngredients(angular.copy($scope.recipe.ingredients));
            recipeService.createRecipe($scope.recipe).then(function(result) {
                var recipe = result.data;
                recipeService.addIngredientsToRecipe(recipe, ingredients).then(function(result) {
                    $location.path("/recipes/" + recipe._id + "/edit");
                });
            });
        };
    }])
    .controller('ShowRecipeCtrl', ['$scope', '$location', '$routeParams', 'Recipe', function($scope, $location, $routeParams, Recipe) {
        $scope.delete = function() {
            $scope.recipe.$delete(function() {
                $location.path("/recipes");
            });
        };
        Recipe.get({id: $routeParams.recipeId}, function(recipe) {
            $scope.recipe = recipe;
        });
    }])
    .controller('ShowRecipesCtrl', ['$scope', '$http', function($scope, $http) {
        $http.get('http://localhost:3000/recipes').
            success(function(data, status, headers, config) {
                $scope.recipes = data;
            }).
            error(function(data, status, headers, config) {
                // TODO
            });
    }])
    .controller('ShowIngredientsCtrl', ['$scope', '$http', function($scope, $http) {
        $http.get('http://localhost:3000/items').
            success(function(ingredients, status, headers, config) {
                $scope.ingredients = ingredients;
            }).
            error(function(data, status, headers, config) {

            });
    }])
    .controller('ShowIngredientCtrl', ['$scope', '$routeParams', '$location', 'Ingredient', function($scope, $routeParams, $location, Ingredient) {
        Ingredient.get({id: $routeParams.ingredientId}, function(ingredient) {
            $scope.ingredient = ingredient;
        });

        $scope.delete = function() {
            Ingredient.delete({id: $scope.ingredient._id}, function() {
                $location.path("/ingredients")
            },
            function() {
                // TODO err
            });
        }
    }])
;