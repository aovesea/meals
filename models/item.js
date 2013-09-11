var Item;

function make(Schema, mongoose) {
    var itemSchema = new Schema({
        name: String
    });
    if (!Item) {
        Item = mongoose.model('Item', itemSchema);
    }
    return Item;
}

exports.make = make;
