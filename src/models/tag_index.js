const { DataTypes } = require('sequelize');
const { connection } = require('../database/connection');

const tag_index = connection.define('tag_index', {
    tagname: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'tag_index'
});





module.exports = tag_index;