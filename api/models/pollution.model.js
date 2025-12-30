module.exports = (sequelize, Sequelize) => {
  const Pollution = sequelize.define("pollution", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    titre: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lieu: {
      type: Sequelize.STRING,
      allowNull: false
    },
    date_observation: {
      type: Sequelize.DATE,
      allowNull: false
    },
    type_pollution: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    latitude: {
      type: Sequelize.DECIMAL(9,6),
      allowNull: false
    },
    longitude: {
      type: Sequelize.DECIMAL(9,6),
      allowNull: false
    },
    photo_url: {
      type: Sequelize.STRING,
      allowNull: true
    }
  });

  return Pollution;
}; 