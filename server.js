var express = require("express")
var app = express()
var path = require('path')
var hbs = require('express-handlebars')
var Datastore = require('nedb')
const { query } = require("express")
const PORT = 3000;
app.use(express.json());

const coll1 = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});

app.get('/', function(req, res){
    let context = {}
    coll1.find({ }, function(err,docs){
        context.docs = docs
        res.render('formularz.hbs', context)
    })
})


app.get('/handle', function(req,res){
    let context = {};
    const qry = req.query
    const doc = {
        ubezpieczony: qry.ubezpieczony ? "TAK" : "NIE",
        benzyna: qry.benzyna ? "TAK" : "NIE",
        uszkodzony: qry.uszkodzony ? "TAK" : "NIE",
        naped4x4: qry.naped4x4 ? "TAK" : "NIE",
    }

    coll1.insert(doc)

    coll1.find({ }, function(err,docs){
        context.docs = docs
        res.render('formularz.hbs', context)
    })
})

app.get('/removeCar', function(req,res){
    let context = {};
    const qry = req.query
    coll1.remove({ "ubezpieczony":qry.ubezpieczony,"benzyna":qry.benzyna,"uszkodzony":qry.uszkodzony,"naped4x4":qry.naped4x4,"_id":qry._id }, {})
    coll1.find({ }, function(err,docs){
        context.docs = docs
        res.render('formularz.hbs', context)
    })
    
})

app.get('/editCar', function(req,res){
    let context = {};
    const qry = req.query
    coll1.find({ }, function(err,docs){
        context.docs = docs
        context._id = qry._id
        res.render('formularzEdit.hbs', context)
    })
})

app.get('/updateCar', function(req,res){
    const qry = req.query
    coll1.update({ _id: qry._id }, { $set: {ubezpieczony: qry.ubezpieczony, benzyna: qry.benzyna, uszkodzony: qry.uszkodzony, naped4x4: qry.naped4x4}}, {});
    
    let context = {}
    coll1.find({ }, function(err,docs){
        context.docs = docs
        res.render('formularz.hbs', context)
    })
})


app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    helpers: {
        checkId: function (id, elId){
            if(id == elId){
                return true
            }else{
                return false
            }
        }
    }
}));
app.set('view engine', 'hbs')
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT )
})