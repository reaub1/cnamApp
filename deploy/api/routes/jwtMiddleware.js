const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require("../config.js");

module.exports = {
     checkJwt : (req, res, next) => {
    const token = req.headers['authorization'];
    let jwtPayload;
    
    if (!token) {
      return res.status(401).send({ message: 'Missing or invalid token' });
    }
  
    try {
        let jwtBearer = token.split(' ')[1];
        jwtPayload = jwt.verify(jwtBearer, ACCESS_TOKEN_SECRET ,
        {
          complete: true,
          algorithms: ['HS256'],
          clockTolerance: 0,
          ignoreExpiration: false,
          ignoreNotBefore: false
      }
        );
        req.token = jwtPayload;
    } catch (error) {
       console.log (error);
        res.status(401)
            .type('json')
            .send(JSON.stringify({ message: 'Missing or invalid token' }));
        return;
    }

    next();
  }
}