const mongoose = require('mongoose');
const express = require('express');
const expressLayouts = require('express-ejs-layouts'); 
const bodyParser = require('body-parser');
const Url = require('./models/Url');
require('dotenv/config')
var validUrl = require('valid-url');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");
app.set('layout', 'layouts/layout');

//Middleware
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}));
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));

mongoose.connect(
    process.env.DB_CON,
    { useNewUrlParser: true,  useUnifiedTopology: true },
    () => {
    console.log("Connected");
});

const _CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/:slug",async (req, res) => {

    try {
        const url = await Url.findOne({slug: req.params.slug});
        const urlToRedirect = url.url;
        res.redirect(urlToRedirect);
    }
    catch(e) {
        console.log(e);
    }
});

app.post("/", async (req, res) => {
    
    let reqUrl = req.body.url;

    if(!validateUrl(reqUrl)) {
        console.log("Invalid url");
        res.render("index", {
            errorMessage: "Please enter a valid url"
        });
        return;
    }

    let newSlug = randomString(10, _CHARS);

    try {

        while(await Url.findOne({slug: newSlug}).exec()) {
            console.log("Already exists");
            newSlug = randomString(10, _CHARS);
        };

        const url = new Url({
            url: reqUrl,
            slug: newSlug,
            dateMade: Date.now()
        });

        await url.save();
        res.render("index", {
            shortenedUrl: req.get('host') + "/" + newSlug
        });
    }
    catch(e) {
        console.log(e);
    }
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});

function validateUrl(url) {
    if (validUrl.isUri(url)){
        return true
    } 
   
    return false;
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}