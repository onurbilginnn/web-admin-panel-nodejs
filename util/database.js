const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'userName',
     'root',
      '*****',
       {
           dialect: 'mysql',
            host: 'localhost'
        });

        module.exports = sequelize;