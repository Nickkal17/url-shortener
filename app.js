const mongoose = require('mongoose');
const express = require('express');
const expressLayouts = require('express-ejs-layouts'); 
const bodyParser = require('body-parser');
const { url } = require('inspector');
const Url = require('./models/Url');
require('dotenv/config')
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

app.post("/", async (req, res) => {
    
    newSlug = randomString(10, _CHARS);
    
    const url = new Url({
        url: req.body.url,
        slug: newSlug,
        dateMade: Date.now()
    });

    try {
        await url.save();
        res.redirect("/");
    }
    catch(e) {
        console.log(e);
    }
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}