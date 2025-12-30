const { v4: uuidv4 } = require ("uuid");


const db = require("../models");
const Pollution = db.Pollutions;
const Op = db.Sequelize.Op;

// Get all pollutions
exports.get = async (req, res) => {

     try {
         const data = await Pollution.findAll();
         res.send(data);
     } catch (err) {
         res.status(400).send({
             message: err.message
         });
     }
};


// Get one pollution by id
exports.getById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Pollution.findByPk(id);
    if (!data) return res.status(404).send({ message: 'Not found' });
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Create a pollution
exports.create = async (req, res) => {

    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const validationError = validatePollution(req.body);
    if (validationError) {
        return res.status(400).send(validationError);
    }

    const pollution = {
        id: await getNewId(),
        titre: req.body.titre,
        lieu: req.body.lieu,
        date_observation: req.body.date_observation,
        type_pollution: req.body.type_pollution,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        photo_url: req.body.photo_url ?? null,
    };

    Pollution.create(pollution)
    .then(data => {res.send(data);})
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};


exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const numDeleted = await Pollution.destroy({ where: { id: id } });
        if (numDeleted === 0) {
            return res.status(404).send({ message: 'Not found' });
        }
        res.send({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;

    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!" });
    }

    let pollution = await Pollution.findByPk(id);
    if (!pollution) {
        return res.status(404).send({ message: 'Not found' });
    }

    // add the updated fields to the existing
    pollution = { ...pollution.dataValues, ...req.body };

    const validationError = validatePollution(pollution);
    if (validationError) {
        return res.status(400).send(validationError);
    }

    try {
        const [numUpdated] = await Pollution.update(pollution, { where: { id: id } });
        if (numUpdated === 0) {
            return res.status(404).send({ message: 'Not found' });
        }
        res.send({ message: 'Updated successfully' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};



async function getNewId() {
    return Pollution.max('id')
        .then(maxId => (maxId || 0) + 1)
        .catch(() => 1);
}


function validatePollution(data) {
  if(!data){
    return { message: 'Le contenu ne peut pas être vide.' };
  }

  if (!data.titre) {
    return { message: 'Le champ "titre" est requis.' };
  }

  if (!data.lieu) {
    return { message: 'Le champ "lieu" est requis.' } ;
  }

  if (!data.date_observation) {
    return { message: 'Le champ "date_observation" est requis.' };
  }

  if (!data.type_pollution) {
    return { message: 'Le champ "type_pollution" est requis.' };
  }

  if (!data.description) {
    return { message: 'Le champ "description" est requis.' };
  }

  if (!data.latitude) {
    return { message: 'Le champ "latitude" est requis.' };
  }

  if (!data.longitude) {
    return { message: 'Le champ "longitude" est requis.' };
  }

  return null;
}