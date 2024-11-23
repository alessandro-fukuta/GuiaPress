const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define('articles',{
    title: {
        type: Sequelize.STRING,
        allowNull:false 
    },slug: {
        type: Sequelize.STRING,
        allowNull:false
    },body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

// relacionamentos
Category.hasMany(Article);    // 1 categoria tem muitos artigos
Article.belongsTo(Category);  // relacionamento entre 1 artigo e a 1 categoria

//Article.sync({force: true});

module.exports = Article;