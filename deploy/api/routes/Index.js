module.exports = app => {
   require("./routes/catalogue.routes")(app);
   require("./routes/utilisateur.routes")(app);
}
