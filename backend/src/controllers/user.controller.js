const User = require('../models/User.model');
const userSchema = require('../middlewares/user.joi');

const createUser = async (req, res) => {
    try {
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const existingUser = await User.findOne({ email: value.email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }
        const newUser = new User(value);
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', userId: newUser._id });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = createUser;