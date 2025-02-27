const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    avatar: { type: String },
    date: { type: Date, default: Date.now },
    token: { type: String }
});
module.exports = mongoose.model('User', UserSchema);
