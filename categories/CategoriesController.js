const express = require('express');
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

router.get("/admin/categories/new", (req,res) => {
    res.render("admin/categories/new.ejs");
});

router.post("/categories/save",(req,res) => {
    var title = req.body.title;
    if(title != undefined){

        // salvar no bd
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories");
        })

    } else {
        //alert("Não pode ter nome vazio !");
        res.redirect("/admin/categories/new");
    }
});

// rota para listar categorias
router.get("/admin/categories", (req,res) => {

    Category.findAll().then(categories => {
        res.render("admin/categories/index", { categories: categories});
    })

});

// rota para excluir-deletar

router.post("/admin/categories/delete", (req,res) => {

    var id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {

            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories")
            });

        } else {
            res.redirect("/admin/categories")
        }
    } else {
        res.redirect("/admin/categories")
    }

});

// rota editar

router.get("/admin/categories/edit/:id", (req,res) => {

    var id = req.params.id;
    if(isNaN(id)){
        res.redirect("/admin/categories");
    }
   
    Category.findByPk(id).then(category => {

        if (category != undefined) {
               res.render("admin/categories/edit",{category: category});
         } else {
            res.redirect("/admin/categories");
        }


    }).catch( erro => {
        res.redirect("/admin/categories");
    })

});


// salvando o editar

router.post("/categories/udpate", (req,res) => {
    var id = req.body.id;
    var title = req.body.title;
    Category.update({title: title,slug: slugify(title)}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories")
    })
})


module.exports = router;
