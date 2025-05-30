const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModelUser = new Schema({
    fullname: { type: String, require },
    avatar: { type: String, default: '1' },
    email: { type: String, require },
    password: { type: String, require },
    isAdmin: { type: Boolean, default: false },
    phone: { type: Number, default: 0 },
    isEmployee: { type: Boolean, default: false },
});

module.exports = mongoose.model('user', ModelUser);
