const { Sequelize } = require('sequelize');

const sequelize = require('../util/database');

const TxtOnly = sequelize.define('textOnly', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    page:{
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    typeOrder:{
        type: Sequelize.STRING,
        allowNull: false
    },
    header:{
        type: Sequelize.STRING,
        allowNull: false
    },
    txt:{
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }  
});

module.exports = TxtOnly;