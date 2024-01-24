const { checkJwt}  = require('./jwtMiddleware');

module.exports = app => {
    const utilisateur = require("../controllers/utilisateur.controllers.js");
  
    var router = require("express").Router();
    
    router.post("/login", checkJwt,utilisateur.login);
  
    app.use('/api/utilisateur', router);
  };
