const { checkJwt}  = require('./jwtMiddleware');

module.exports = app => {
    const utilisateur = require("../controllers/utilisateur.controllers.js");
  
    var router = require("express").Router();
  

    // login utilisateur
    router.post("/login", utilisateur.login);
    router.get("/", checkJwt, utilisateur.get);
    router.post("/", utilisateur.create);
    router.delete("/:id",checkJwt, utilisateur.delete);    
  
    app.use('/api/utilisateur', router);
  };
