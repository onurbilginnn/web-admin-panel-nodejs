const { Sequelize } = require('sequelize');

const sequelize = require('../util/database');

const Article = sequelize.define('article', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    postedBy: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    category:{
        type: Sequelize.STRING,
        allowNull: false
    },
    readTime:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    imageUrl:{
        type: Sequelize.STRING,
        allowNull: true
    },
    tags: {
        type: Sequelize.STRING,
        allowNull: false
    },  
    article: {
        
        type: Sequelize.TEXT,
        allowNull: false
    }  
});

module.exports = Article;