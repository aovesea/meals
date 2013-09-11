module.exports = function(Item) {
    return {
        create: function(req, res) {
            var item = req.body;
            Item.create(item, function(err, item) {
                res.send(item);
            });
        },
        read: function(req, res, next) {
            Item.find().exec(function(err, items) {
                res.send(items);
            })
        },
        update: function(id, itemToUpdate, res) {
            Item.findById(id).exec(function(err, item) {
                item.name = itemToUpdate.name;
                item.save(function(err, item) {
                    res.send(item);
                });
            });
        },
        findById: function(id, res) {
            Item.findById(id, function(err, item) {
                if (!item) {
                    res.send(404);
                }
                res.send(item);
            });
        },
        remove: function(id, res) {
            Item.findById(id).remove(function(err, item) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(204);
                }
            });
        }
    }
}