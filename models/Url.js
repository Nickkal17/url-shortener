const mongoose = require('mongoose');

const UrlSchema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    dateMade: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Urls', UrlSchema);