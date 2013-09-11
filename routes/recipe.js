module.exports = function(app, RecipeController) {
    app.get("/recipes", function(req, res) {
        RecipeController.read(req, res);
    });
    app.get("/recipes/:id", function(req, res) {
        RecipeController.findById(req.params.id, res);
    });
    app.get("/recipes/:id/ingredients", function(req, res) {
        res.send(404);
    });
    app.put("/recipes/:id/ingredients", function(req, res) {
        var recipeId = req.params.id;
        var items = req.body;
        RecipeController.setIngredients(recipeId, items, res);
    });
    app.post("/recipes", function(req, res) {
        RecipeController.create(req, res);
    });
    app.del("/recipes/:id", function(req, res) {
        RecipeController.del(req.params.id, res);
    });
    app.put("/recipes/:id", function(req, res) {
        RecipeController.update(req.params.id, req.body, res);
    });
}