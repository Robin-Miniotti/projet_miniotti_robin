const { checkJwt}  = require('./jwtMiddleware');

module.exports = app => {
    const pollution = require("../controllers/pollution.controllers.js");
  
    var router = require("express").Router();

    router.get("/", pollution.get);
    router.get("/:id", pollution.getById);
    router.post("/", checkJwt, pollution.create);
    router.delete("/:id", checkJwt, pollution.delete);
    router.put("/:id", checkJwt, pollution.update);


    app.use('/api/pollution', router);
  
  };
