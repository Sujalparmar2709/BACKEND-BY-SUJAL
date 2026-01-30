const express = require('express');
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");
const post = require('./models/post');

app.get('/', function(req, res){
    res.send("hey");
})

app.get('/create', async function(req, res){
    let user = await userModel.create({
        username: "Sujal",
        age: 21,
        email: "parmarsujal2709@gmail.com"
    });

    res.send(user);   
})

app.get('/post/create', async function(req, res){
    let post = await postModel.create({
        postdate:"hey everyone",
        user: "6970d7c173553bf5f8b4c4fa"
    })
    let user = await userModel.findOne({_id: "6970d7c173553bf5f8b4c4fa"});
    user.posts.push(post._id);
    await user.save();
    res.send({post, user});
})

app.listen(3000);