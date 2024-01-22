const express = require("express");
const cors = require("cors");
const { Pool } = require('pg');
const jwtMiddleware = require('./routes/jwtMiddleware.js');

const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require("./config.js");

const pool = new Pool({
  connectionString: 'postgres://table_3l03_user:SRwluvD9p39Wyo7SsQgCWHQW04rFFtlG@dpg-cm23levqd2ns73d8fs1g-a.frankfurt-postgres.render.com/table_3l03',
  ssl: {
    rejectUnauthorized: false // Utilisé pour les environnements de développement
  }
});

const app  = express ();

var corsOptions = {
  origin: "*",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  headers: 'Content-Type, Authorization',
  exposedHeaders:'Authorization'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CNAM application." });
});

app.get("/api/vehicle",jwtMiddleware.checkJwt, async (req, res) => {

  try {
    const result = await pool.query('SELECT * FROM public.vehicle');
    //const rows = result.rows.map(row => Object.values(row));

    const vehicles = result.rows.map(row => {
      return {
        id: row.id,
        brand: row.brand,
        model: row.model,
        price: row.price,
        imageUrl: row.url
      };
    });

    res.json(vehicles);
}catch (err) {
    console.error(err);
    res.status(500).send('Server error vehicle');
}
});

app.get("/api/vehicle/:id",jwtMiddleware.checkJwt, async (req, res) => {
  const vehicleId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM public.vehicle WHERE id = $1', [vehicleId]);

    if (result.rows.length > 0) {
      const row = result.rows[0];
      const vehicle = {
        id: row.id,
        brand: row.brand,
        model: row.model,
        price: row.price,
        km: row.km,
        year: row.year,
        description: row.description,
        isSold: row.is_sold,
        isRented: row.is_rented,
        isDamaged: row.is_damaged,
        imageUrl: row.url,
      };
      res.json(vehicle); // Renvoie un objet unique
    } else {
      res.status(404).send('Vehicle not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error vehicle');
  }
});

app.get('/api/users', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM public.utilisateurs');
      const rows = result.rows.map(row => Object.values(row));
      res.json(rows);
      //console.log(rows);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error users');
  }
});

app.post('/api/users/login', async (req, res) => {
 
  const { username, password } = req.body; // Récupérer username et password du body de la requête

  try {
    console.log(username);
    console.log(password);

    const passwordEncoded = Buffer.from(password).toString('base64');
    const result = await pool.query('SELECT * FROM public.utilisateurs WHERE login = $1 AND password = $2', [username, passwordEncoded]);
    
    if (result.rows.length > 0) {

      const user = result.rows[0]; // Supposons que vous voulez renvoyer le premier utilisateur correspondant
      const token = generateAccessToken({ username: user.login });
      res.json({user: user,token :token});
    } else {
      res.status(404).send('Utilisateur non trouvé');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error users');
  }
});


app.post('/api/users/register', async (req, res) => {
  const id = Math.floor(Math.random() * 100) + 1; // Generate a random integer between 1 and 100
  const { nom, prenom, adresse, codepostal, ville, email, sexe, login, password, telephone } = req.body; // Récupérer username et password du body de la requête

  const passwordEncoded = Buffer.from(password).toString('base64');

  try {
    const result = await pool.query('INSERT INTO public.utilisateurs(id, nom, prenom, adresse, codepostal, ville, email, sexe, login, password, telephone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);', [id, nom, prenom, adresse, codepostal, ville, email, sexe, login, passwordEncoded, telephone]);

    console.log(result);

    if (result.rowCount > 0) {
      // Si rowCount est supérieur à 0, cela signifie qu'au moins une ligne a été insérée.
      res.status(200).json('Utilisateur créé avec succès');
    } else {
      // Aucune ligne insérée
      res.status(404).send('Utilisateur non créé');
    }
  } 
  catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur lors de la création de l’utilisateur');
  }
});
const db = require("./models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

require("./routes")(app);

// set port, listen for requests
const PORT =  443;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}
