const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/authtestapp`);
//
const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    age: Number
});
//This line creates a MongoDB model named user using userSchema.  
module.exports = mongoose.model("user", userSchema);
