require('dotenv').config();
const basicAuth = require('basic-auth');


const authenticate = (req, res, next) => {
  
  const credentials = basicAuth(req);
    // console.log(credentials);
  if (!credentials || credentials.name !== process.env.USERNAME || credentials.pass !== process.env.PASSWORD) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Authentication required"');
    return res.status(401).send('Unauthorized');
  }

  // Authentication successful
  next();
};

module.exports = authenticate;
