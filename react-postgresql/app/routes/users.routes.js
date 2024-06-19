module.exports = app => {
  const users = require("../controllers/users.controller.js");

  var router = require("express").Router();

  // Auth for login user
  router.get("/check-account/:email", users.findByEmail);

  // Create a new User
  router.post("/", users.create);

  // Retrieve all Users
  router.get("/", users.findAll);

  // Retrieve all published Users
  router.get("/published", users.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", users.findOne);

  // Update a User with id
  router.put("/:id", users.update);

  // Delete a User with id
  router.delete("/del/:id", users.delete);

  // Create a new User
  router.delete("/", users.deleteAll);

  app.use('/api/users', router);
};