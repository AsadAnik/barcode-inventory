import mongoose, { Schema } from 'mongoose';

// region User Schema
const userSchema = new Schema({
    name: { type: String, required: false, maxLength: 100 },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, minLength: 7 },
    refreshToken: { type: String },
}, {
    timestamps: true
});

//  region User Model
const User = mongoose.model('User', userSchema);

export default User;
