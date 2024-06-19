const db = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = db.users;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validation request
  if(!req.body.name) {
    res.status(400).send({
      message: "Name cannot be empty"
    });
    return;
  }

  if(!req.body.email) {
    res.status(400).send({
      message: "Email cannot be empty"
    });
    return;
  }

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.email)) {
    res.status(400).send({
      message: "Please enter a valid email"
    });
    return;
  }

  if ('' === req.body.password) {
    res.status(400).send({
      message: "Please enter a password"
    });
    return
  }

  if (req.body.password.length < 7) {
    res.status(400).send({
      message: "The password must be 8 characters or longer"
    });
    return
  }

  const email = req.body.email;
  var condition = email ? { email: { [Op.like]: `%${email}%`} } : null;

  // Create a Users
  const users = {
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    password: req.body.password,
    published: req.body.pulished ? req.body.published : false
  }

  Users.findOne({ where: condition })
    .then(data => {
      if(data) {
        
        res.send({
          message: "Email already exists."
        });
      
      } else {

        Users.create(users)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error accurred while creating the user."
          });
        });

      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error accurred while retrieving users."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%`} } : null;

  Users.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error accurred while retrieving users."
      });
    });
};

// Find a single Users with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Users.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
          message: "Error retrieving users with id=" + id
      });
    });
};

// Find a single Tutorial with an email (use for login auth)
exports.findByEmail = (req, res) => {
  const email = req.params.email;
  var condition = email ? { email: { [Op.like]: `%${email}%`} } : null;

  Users.findOne({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error accurred while retrieving users."
      });
    });
};

// Update a Users by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Users.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if(num == 1) {
        res.send({
          message: "Users was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Users with id=${id}. Maybe Users was not found or req.body is empty`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
          message: "Error udpate turorial with id=" + id
      });
    });
};

// Delete a Users with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Users.destroy({
    where: { id: id }
  })
    .then(num => {
      if(num == 1) {
        res.send({
          message: "Users was deleted successfully."
        });
      } else {
        res.send({
          message: `Cannot delete Users with id=${id}. Maybe Users was not found or req.body is empty`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
          message: "Could not delete turorial with id=" + id
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  Users.destroy({
    where: {},
    truncate: false
  })
  .then(num => {
    res.send({ message: `${num} Users were delete successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error accurred while removing all users."
    });
  });
};

// Find all published Users
exports.findAllPublished = (req, res) => {
  Users.findAll({ where: { published: true } })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error accurred while retrieving all users."
    });
  });
};