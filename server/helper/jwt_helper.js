const JWT = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = {
  signAccessToken: (name) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = "8e65b3f6d1c83e12385d1821a00b3d05a23f12d0d5061ac240278ea3778c812d";
      const options = {
        expiresIn: "1h",
        issuer: "brodypage.com",
        audience: name,
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  },

  verifyAccessToken: (token) => {
    return new Promise((resolve, reject) => {
      const secret = "8e65b3f6d1c83e12385d1821a00b3d05a23f12d0d5061ac240278ea3778c812d"
      JWT.verify(token, secret, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded)
      })
    })
  } 
};