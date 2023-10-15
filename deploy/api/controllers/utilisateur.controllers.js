const { v4: uuidv4 } = require ("uuid");
const { ACCESS_TOKEN_SECRET }  = require ("../config.js");

const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '365d' });
  }

// Find a single Utilisateur with an login
exports.login = (req, res) => {
  const utilisateur = {
    login: req.body.login,
    password: req.body.password
  };

  // Test
  let pattern = /^[A-Za-z0-9]{1,20}$/;
  if (pattern.test(utilisateur.login) && pattern.test(utilisateur.password)) {

        const uuid = uuidv4 ();
        const utilisateur = {
          nom: "martin",
          prenom: "jean",
          login: "martin",
          email : "martin.jean@gmail.com",
          password : "toto",
          id : uuid
        };

        const user = {
          id: utilisateur.id,
          name: utilisateur.nom,
          email: utilisateur.email
        };
      
        
        let accessToken = generateAccessToken(user);
        res.setHeader('Authorization', `Bearer ${accessToken}`);

        console.log (accessToken);

      
        res.send(utilisateur);
    };    
};

exports.create = (req, res) => {
    // Validate request
    if (!req.body.nom) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    const uuid = uuidv4 ();
    // Create a Utilisateur
    const utilisateur = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      login: req.body.login,
      email : req.body.email,
      password : req.body.password,
      id : uuid
    };
   
    const user = {
      id: utilisateur.id,
      name: utilisateur.nom,
      email: utilisateur.email
    };

    const accessToken = generateAccessToken(user);
          
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.send(utilisateur);     
  };

// Retrieve all Utilisateurs from the database.
exports.findAll = (req, res) => {
    const nom = req.query.nom;
    
    console.log ("findAll")

    const uuid = uuidv4 ();
    const utilisateurs = [{
      nom: "martin",
      prenom: "jean",
      login: "martin",
      email : "martin.jean@gmail.com",
      password : "toto",
      id : uuid
    }];

    const user = {
      id: utilisateurs[0].id,
      name: utilisateurs[0].nom,
      email: utilisateurs[0].email
    };
   
    const accessToken = generateAccessToken(user);
          
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.send(utilisateurs);     

  };

// Find a single Utilisateur with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  const uuid = uuidv4 ();
  const utilisateur = {
    nom: "martin",
    prenom: "jean",
    login: "martin",
    email : "martin.jean@gmail.com",
    password : "toto",
    id : uuid
  };

  const user = {
    id: utilisateur.id,
    name: utilisateur.nom,
    email: utilisateur.email
  };
 
  const accessToken = generateAccessToken(user);
        
  res.setHeader('Authorization', `Bearer ${accessToken}`);
  res.send(utilisateur);     
};

// Update a Utilisateur by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  const utilisateur = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    login: req.body.login,
    email : req.body.email,
    password : req.body.password,
    id : id
  };
  const user = {
    id: utilisateur.id,
    name: utilisateur.nom,
    email: utilisateur.email
  };
  const accessToken = generateAccessToken(user);
        
  res.setHeader('Authorization', `Bearer ${accessToken}`);
  res.send(utilisateur);     
};

// Delete a Utilisateur with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  res.send({
    message: "Utilisateur was deleted successfully!"
  });
};

// Delete all Utilisateur from the database.
exports.deleteAll = (req, res) => {
  res.send({
    message: "Utilisateur was deleted successfully!"
  });
};

