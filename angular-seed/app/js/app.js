'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'ui.bootstrap']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/recipes/new', {templateUrl: 'partials/recipes/edit.html', controller: 'CreateRecipeCtrl'});
        $routeProvider.when('/recipes/:recipeId/edit', {templateUrl: 'partials/recipes/edit.html', controller: 'EditRecipeCtrl'});
        $routeProvider.when('/recipes/:recipeId', {templateUrl: 'partials/recipes/view.html', controller: 'ShowRecipeCtrl'});
        $routeProvider.when('/recipes', {templateUrl: 'partials/recipes/list.html', controller: 'ShowRecipesCtrl'});
        $routeProvider.when('/items', {templateUrl: 'partials/items/list.html', controller: 'ShowIngredientsCtrl'});
        $routeProvider.when('/items/:ingredientId', {templateUrl: 'partials/items/view.html', controller: 'ShowIngredientCtrl'});
        $routeProvider.otherwise({redirectTo: '/recipes'});
    }]);
