const jwt = require('jsonwebtoken');

function checkTokenSetUser(req, res, next) {
  const authHeader = req.get('authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          console.log(err);
        } 
        req.user = user;
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
}

module.exports = {
  checkTokenSetUser,
};

// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDYyNGVmMGY5MjYyZDAxYWM5YjIwMTIiLCJ1c2VybmFtZSI6ImdyZWVuYnJpYXJ5ZW9tYW4iLCJpYXQiOjE2MTcwNTU0NzIsImV4cCI6MTYxNzE0MTg3Mn0.HtcxCqvoxfdI7G-PUK38pqHFYV8B3LFT8a6-ZIPwpyo