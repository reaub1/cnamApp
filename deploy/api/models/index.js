const { Sequelize } = require ("sequelize");
const { BDD }  = require ('../config');
//const sequelize = new Sequelize(`postgres://table_3l03_user:SRwluvD9p39Wyo7SsQgCWHQW04rFFtlG@dpg-cm23levqd2ns73d8fs1g-a.frankfurt-postgres.render.com/table_3l03`
const sequelize = new Sequelize(`postgres://${BDD.user}:${BDD.password}@${BDD.host}/${BDD.bdname}`
,{
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: true,
      native:true
    },
    define:  {
    	timestamps:false
    }
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.utilisateur = require("./utilisateur.model.js")(sequelize, Sequelize);

module.exports = db;
