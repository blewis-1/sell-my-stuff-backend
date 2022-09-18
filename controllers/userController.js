const bcrypt = require('bcrypt');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

exports.signUp = ((req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'User created.' }))
                .catch((error) => res.status(500).json({ error: error }));
        });
});

exports.login = ((req, res) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: new Error("User not found.") });
            }
            bcrypt.compare(req.body.password, user.password)
                .then((isValid) => {
                    if (!isValid) {
                        return res.status(401).json({ error: new Error('Incorrect Password') });
                    }
                    // Token Key
                    const jwtToken = jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' },
                    );

                    res.status(200).json({
                        userId: user._id,
                        token: jwtToken,
                    });
                }).catch((error) => {
                    res.status(500).json({ error: error.message });
                });
        }).catch((error) => {
            res.status(500).json({ error: error.message });
        });
});

