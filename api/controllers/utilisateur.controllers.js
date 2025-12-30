const db = require('../models');
const Utilisateurs = db.Utilisateurs;
const Op = db.Sequelize.Op;
  
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET }  = require ("../config.js");

function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
  }

// Find a single Utilisateur with an login
exports.login = (req, res) => {
  // Check if body exists and has required fields
  if (!req.body || !req.body.login || !req.body.pass) {
    return res.status(400).send({ 
      message: 'Login et password sont requis',
      received: req.body 
    });
  }

  const utilisateur = {
    login: req.body.login,
    pass: req.body.pass,
  };

  const pattern = /^[A-Za-z0-9]{1,20}$/;

  // Check input format
  if (!pattern.test(utilisateur.login) || !pattern.test(utilisateur.pass)) {
    return res.status(400).send({ message: 'Login ou password incorrect (format invalide)' });
  }

  Utilisateurs.findOne({ where: { login: utilisateur.login } })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Utilisateur avec le login "${utilisateur.login}" introuvable.`,
        });
      }

      // Compare the provided password with the stored one
      if (data.pass === utilisateur.pass) {
        const user = {
          id: data.id,
          login: data.login,
          nom: data.nom,
          prenom: data.prenom,
        };
        
        // Générer le token JWT
        const accessToken = generateAccessToken(user);
        
        // Retourner le token dans le header Authorization
        res.setHeader('Authorization', `Bearer ${accessToken}`);
        return res.status(200).send(user);
      } else {
        return res.status(401).send({ message: 'Mot de passe incorrect' });
      }
    })
    .catch((err) => {
      return res.status(400).send({
        message: 'Erreur lors de la récupération de l’utilisateur : ' + err.message,
      });
    });
};


exports.get = (req, res) => {
  Utilisateurs.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message,
      });
    });
};

exports.create = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Le contenu ne peut pas être vide',
    });
    return;
  }

  const validationError = validateUtilisateur(req.body);
  if (validationError) {
    return res.status(400).send(validationError);
  }

  // Check if login already exists
  try {
    const existingUser = await Utilisateurs.findOne({ where: { login: req.body.login } });
    if (existingUser) {
      return res.status(409).send({
        message: 'Ce nom d\'utilisateur existe déjà. Veuillez en choisir un autre.'
      });
    }
  } catch (err) {
    return res.status(500).send({
      message: 'Erreur lors de la vérification de l\'utilisateur : ' + err.message,
    });
  }

  const utilisateur = {
    id: await getNewId(),
    nom: req.body.nom,
    prenom: req.body.prenom,
    login: req.body.login,
    pass: req.body.pass,
  };

  Utilisateurs.create(utilisateur)
    .then((data) => {
      res.status(201).send({
        message: 'Compte créé avec succès',
        user: data
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Erreur lors de la création du compte : ' + err.message,
      });
    });
};

function validateUtilisateur(utilisateur) {
  let patternLogin = /^[A-Za-z0-9]{3,20}$/;
  // Mot de passe: minimum 8 caractères, au moins 1 chiffre, alphanumeric
  let patternPass = /^(?=.*\d)[A-Za-z0-9]{8,20}$/;

  if (!utilisateur.login || !patternLogin.test(utilisateur.login)) {
    return { message: 'L\'identifiant doit contenir entre 3 et 20 caractères alphanumériques.' };
  }

  if (!utilisateur.pass) {
    return { message: 'Le mot de passe est requis.' };
  }

  if (!patternPass.test(utilisateur.pass)) {
    return { message: 'Le mot de passe doit contenir au minimum 8 caractères dont au moins 1 chiffre.' };
  }

  if (!utilisateur.nom || utilisateur.nom.length > 50) {
    return { message: 'Le nom est requis et doit contenir maximum 50 caractères.' };
  }

  if (!utilisateur.prenom || utilisateur.prenom.length > 50) {
    return { message: 'Le prénom est requis et doit contenir maximum 50 caractères.' };
  }

  return null;
}

async function getNewId() {
  return Utilisateurs.max('id')
    .then((maxId) => (maxId || 0) + 1);
}

exports.delete = (req, res) => {
  const id = req.params.id;

  Utilisateurs.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Utilisateur was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Utilisateur with id=${id}. Maybe Utilisateur was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Utilisateur with id=' + id,
      });
    });
}