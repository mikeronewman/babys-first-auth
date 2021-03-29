const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../db/connection');
const users = db.get('users');
users.createIndex('username', { unique: true });

const router = express.Router();

const schema = Joi.object().keys({
  username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(30).required(),
  password: Joi.string().trim().min(8).required()
});

// any route in here is prepended with /auth
router.get('/', (req, res) => {
  res.json({
    message: "whattup ya'll"
  });
});

router.post('/signup', (req, res, next) => {
  // validate the request
  const result = Joi.validate(req.body, schema);
  // if there are no validation errors
  if(result.error === null) {
    // make sure username is unique
    users.findOne({
      username: req.body.username
    }).then(user => {
      // if this user is already found
      if(user) {
        const error = new Error('Sorry, that username is already taken.');
        res.status(409);
        next(error);
      } else {
        // hash the password
        bcrypt.hash(req.body.password.trim(), 12).then(hashedPassword => {
          // create a user with the hashed password
          const newUser = {
            username: req.body.username,
            password: hashedPassword
          }
          // insert the user with the hashed password
          users.insert(newUser).then(insertedUser => {
            delete insertedUser.password;
            res.json(insertedUser);
          });
        }).catch(err => console.log(err));
      }
    });
  } else {
    res.status(422);
    next(result.error);
  }
});

const respondError422 = (res, next) => {
  res.status(422);
  const error = new Error('Unable to login.');
  next(error);
}

router.post('/login', (req, res, next) => {
  const result = schema.validate(req.body);
  if (result.error === null) {
    users.findOne({
      username: req.body.username,
    }).then((user) => {
      if (user) {
        // compare hashed passwords
        bcrypt.compare(req.body.password, user.password)
        .then((result) => {
          if (result) {
            //they sent the right password!
            const payload = {
              _id: user._id,
              username: user.username,
            };
            jwt.sign(payload, process.env.TOKEN_SECRET, { 
              expiresIn: '1d', 
            }, (err, token) => {
              if (err) {
                respondError422(res, next);
              } else {
                res.json({ token });
              }
            });
          } else {
            respondError422(res, next);
          }
        });
      } else {
        respondError422(res, next);
      }
    });
  } else {
    respondError422(res, next);
  }
});

module.exports = router;