'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource'])
    .value('version', '0.1')
    .factory('Recipe', function($resource) {
        return $resource('http://localhost\\:3000/recipes/:id', {id: '@_id'},
            {
                update: { method:'PUT' }
            });
    })
    .factory('Ingredient', function($resource) {
        return $resource('http://localhost\\:3000/ingredients/:id', {});
    })
    .service('recipeService', ['$http', function($http) {
        return {
            addIngredientsToRecipe: function(recipe, ingredients) {
                return $http.put('http://localhost:3000/recipes/' + recipe._id + '/ingredients', ingredients);
            },
            prepareIngredients: function(ingredients) {
                angular.forEach(ingredients, function(ingredient) {
                    ingredient.item = ingredient.item._id;
                });
                return ingredients;
            },
            createRecipe: function(recipe) {
                return $http.post('http://localhost:3000/recipes', recipe);
            }
        }
    }]);
;
