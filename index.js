const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

// criar view engine

app.set('view engine','ejs');

// configurando sessoes

app.use(session({
    secret: "qualquercoisa", cookie: {maxAge: 30000} // 30 segundos para expirar o tempo da sessao
}));
// arquivos estaticos de imagens e outros...

app.use(express.static('public'));


// body parser

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// database

connection
    .authenticate()
    .then(() => {
        console.log("Banco de dados, conectado com sucesso !");
    }).catch((error) => {
        console.log(error);
    })

    // rotas
    
    app.use("/",articlesController);
    app.use("/",categoriesController);
    app.use("/",usersController);


// mostra os artigos na home page
app.get("/", (req,res) => {
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit:4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });
        
    });
  
})

app.get("/:slug",(req,res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]    // realiza um join
    }).then(article=>{
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            })
        } else {
            res.redirect("/");
        }
    }).catch( err=> {
        res.redirect("/");
    })
})

app.get("/category/:slug",(req,res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined ) {

            Category.findAll().then(categories => {
                res.render("index",{articles: category.articles, categories: categories});   // so conseguimos acessar o category.articles, devido ao include acima
            })


        } else {
            res.redirect("/");
        }
    }).catch ( err => {
        res.redirect("/");
    })
})


app.listen(3001, () => {
    console.log("o servidor esta rodando !");
});


