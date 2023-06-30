const bcrypt = require("bcrypt");

// Encrypt password when user register
const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      } else {
        // encrypt password
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            reject(err);
          }
          // Return successfully hashed password
          resolve(hash);
        });
      }
    });
  });
};

// Compare password when user login
const comparePassword = (loginPassword, hashedPassword) => {
  return bcrypt.compare(loginPassword, hashedPassword); // true or false
};

module.exports = { hashPassword, comparePassword };
