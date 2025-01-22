import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../types';

// region Product Schema
const productSchema = new Schema<IProduct>({
    name: { 
        type: String, 
        required: false, 
        maxLength: 100 
    },
    barcode: { 
        type: String, 
        required: false, 
        maxLength: 100 
    },
    description: { 
        type: String, 
        required: false, 
        maxLength: 100 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        default: null 
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
}, {
    timestamps: true
});

//  region Product Model
const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
