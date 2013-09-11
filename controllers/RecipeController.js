// TODO Controller should be completely independent, they should have a callback, handle error/result in the router
var express = require('underscore');

module.exports = function (Recipe, Item) {
    var controller = {};

    controller.del = function (id, res, next) {
        Recipe.findByIdAndRemove(id, function (err, recipe) {
            if (err) {
                console.log("error", err);
            }
            res.send(204);
        });
        // TODO what if it's not found?
    };

    controller.read = function (req, res, next) {
        Recipe.find().populate("ingredients.item").exec(function (err, recipes) {
            res.send(recipes);
        });
    };

    controller.findById = function (id, res) {
        Recipe.findById(id).populate("ingredients.item").exec(function (err, recipe) {
            res.send(recipe);
        });
    };

    controller.create = function (req, res, next) {
        var body = req.body;
        var recipeToSave = {
            name: body.name,
            description: body.description
        };

        var onRecipeCreated = function (err, recipe) {
            if (err) {
                console.log("error:", err);
            }
            recipeToSave.items = body.items;
            controller.update(recipe._id, recipeToSave, res);
        };

        Recipe.create(recipeToSave, onRecipeCreated);
    };

    controller.setIngredients = function (id, ingredients, res) {
        if (ingredients) {
            Recipe.findById(id).exec( function (err, recipe) {
                if (err) {
                    console.log("error", err);
                }

                recipe.ingredients = ingredients;
                recipe.save(function(err, recipe) {
                    res.send(ingredients);
                });
            });
        } else {
            res.send(204);
        }
    };

    // TODO provide callback
    controller.update = function (id, recipeToSave, res) {
        Recipe.findById(id).populate("ingredients.item").exec(function (err, recipe) {
            if (err) {
                console.log("error", err);
            }

            recipe.name = recipeToSave.name;
            recipe.description = recipeToSave.description;
            recipe.save(function(err, recipe) {
                res.send(recipe);
            });
        });
    };

    return controller;
};