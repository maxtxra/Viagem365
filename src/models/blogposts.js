const { DataTypes } = require('sequelize');
const { connection } = require('../database/connection');

const Blogposts = connection.define('blogposts', {
    title: {
        type: DataTypes.STRING
    },
    linkurl: {
        type: DataTypes.STRING
    },
    content_text: {
        type: DataTypes.STRING
    },
    tags: {
        type: DataTypes.STRING
    },
}, {
    tableName: 'blogposts'
});





module.exports = Blogposts;