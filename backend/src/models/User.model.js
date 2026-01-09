const mongose = require('mongoose');


mongose.model('User', new mongose.Schema({
    firstname: { type: String, required: true, },
    lastname: { type: String, required: true, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}));


const User = mongose.model('User');
module.exports = User;