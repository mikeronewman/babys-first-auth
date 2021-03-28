const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const db = require('../db/connection');
const users = db.get('users');
users.createIndex('username', { unique: true });

const router = express.Router();

const schema = Joi.object().keys({
  username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(30).required(),
  password: Joi.string().trim().min(8).required()
});

// any route in here is prepended with /auth/
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
        next(error);
      } else {
        // hash the password
        bcrypt.hash(req.body.password, 12).then(hashedPassword => {
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
    next(result.error);
  }
});

module.exports = router;