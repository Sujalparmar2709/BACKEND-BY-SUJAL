const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/minproject");

const userSchema = mongoose.Schema({
    name: String,
    username: String,
    password: String,
    age: Number,
    email: String,
    profilepic:{
        type: String,
        default: "default.jpg"
    },
    post: [
        //it is arrays of id's
        { type: mongoose.Schema.Types.ObjectId, ref: "post" }
    ],
})

module.exports = mongoose.model('user', userSchema);