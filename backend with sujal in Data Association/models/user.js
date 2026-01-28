//we can easily connect to mongoDB

const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/testinghthedatabase");

const userSchema = mongoose.Schema({
    //we can write this " username: String,"" to this "username:{ type: String},"
    // and it just like id so we can write like that
    //user: {
    // types : string,
    //},
    
    username:{
        type: String,
    },
    email: String,
    age: Number,

    //post is a array of id's
    posts: [
        {
            //this line means "type: mongoose.Schema.Types.ObjectId," it is ID
            type: mongoose.Schema.Types.ObjectId,
            //which id are coming it is refrence
            ref: 'post' 

        }
    ]
})

module.exports = mongoose.model('user', userSchema);