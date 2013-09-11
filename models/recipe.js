var Recipe;

function make(Schema, mongoose) {
    var recipeSchema = new Schema({
        name: String,
        description: String,
        ingredients: [
            {
                _id: false,
                measurement: String,
                item: { type: Schema.Types.ObjectId, ref: 'Item' }
            }
        ]
    });

    if (!Recipe) {
        Recipe = mongoose.model('Recipe', recipeSchema);
    }
    return Recipe;
}

exports.make = make;
