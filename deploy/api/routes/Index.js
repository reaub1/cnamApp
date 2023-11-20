exports.catalogue = app => {
   require("./catalogue.routes")(app);   
}

exports.utilisateur = app => {
   require("./utilisateur.routes")(app);
}


