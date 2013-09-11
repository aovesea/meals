module.exports = function(app, ItemController) {
    app.get("/items", function(req, res) {
        ItemController.read(req, res);
    });
    app.get("/items/:id", function(req, res) {
        ItemController.findById(req.params.id, res);
    });
    app.delete("/items/:id", function(req, res) {
        ItemController.remove(req.params.id, res);
    });
    app.post("/items", function(req, res) {
        ItemController.create(req, res);
    });
    app.put("/items/:id", function(req, res) {
        ItemController.update(req.params.id, req.body, res);
    });
}