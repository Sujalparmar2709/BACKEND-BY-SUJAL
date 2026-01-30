const express = require('express');
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require("path");
const upload = require("../config/multerconfig");



//It connects Express with EJS so you can render dynamic web pages. 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/profile/upload', (req, res) => {
    res.render("profileupload");
});

app.post('/upload', isLoggedIn, upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    try {
        let user = await userModel.findOneAndUpdate(
            { email: req.user.email },
            { profilepic: req.file.filename },
            { new: true }
        );
        console.log('File uploaded:', req.file);
        res.redirect("/profile");
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).send("Error updating profile picture");
    }
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/profile', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("post");
    res.render("profile", { user });
});

app.get('/like/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate("user");
    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid);
    }
    else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }


    await post.save();
    res.redirect("/profile");
});

app.get('/edit/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate("user");
    res.render("edit", { post });
});

app.post('/update/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOneAndUpdate({ _id: req.params.id }, { content: req.body.content });
    res.redirect("/profile");
});

app.post('/post', isLoggedIn, async (req, res) => {
    //we can find who person are loggedin with the help of this line
    let user = await userModel.findOne({ email: req.user.email });
    let { content } = req.body;

    let post = await postModel.create({
        user: user._id,
        content
    });

    user.post.push(post._id);
    await user.save();
    res.redirect("/profile");

});


app.post('/register', async (req, res) => {
    let { email, password, username, name, age } = req.body;
    let user = await userModel.findOne({ email });
    if (user) return res.status(500).send("User already registered");


    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                name,
                username,
                password: hash,
                age,
                email
            });
            let token = jwt.sign({ email: email, userid: user._id }, "shhhhh");
            res.cookie("token", token, { httpOnly: true });
            return res.redirect("/profile");
        })
    });

});

app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) return res.status(500).send("Something went wrong");

    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, "shhhhh");
            res.cookie("token", token, { httpOnly: true });
            return res.redirect("/profile");
        }
        else return res.redirect("/login");
    })
});

app.get('/logout', (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});


// It is middleware
function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect("/login");

    try {
        let data = jwt.verify(token, "shhhhh");
        req.user = data;
        next();
    } catch (err) {
        return res.redirect("/login");
    }
}

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
