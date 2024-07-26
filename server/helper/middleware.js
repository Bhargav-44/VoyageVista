const jwt = require('jsonwebtoken');

let accessToken = null;

function setAccessToken(token) {
    accessToken = token;
}

function getAccessToken() {
    return accessToken;
}

function getNamefromToken(accessToken) {
    try {
      const decoded = jwt.decode(accessToken); 
      const name = decoded.aud; 
      return name;
    } catch (error) {
      console.error('Error decoding the token:', error);
      return null; 
    }
  }

module.exports = { setAccessToken, getAccessToken, getNamefromToken };