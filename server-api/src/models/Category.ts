import mongoose, { Schema } from 'mongoose';

// region Category Schema
const categorySchema = new Schema({
    name: {
        type: String,
        required: false,
        maxLength: 100
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
}, {
    timestamps: true
});

//  region Category Model
const Category = mongoose.model('Category', categorySchema);

export default Category;