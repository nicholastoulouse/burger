var express = require("express");
var app = express();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "helloMySQL",
  database: "burgers_db"
});

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + "/public"));

// Set Handlebars.
Handlebars = require('handlebars');
var exphbs = require("express-handlebars");

var hbs = exphbs.create({
    handlebars: Handlebars,
    defaultLayout: "main",
    // Specify helpers which are only registered on this instance.
    helpers: {
        foo: function (a) { return 'FOO!' + a; },
        bar: function (b) { return 'BAR!' + b; },
        breaklines: function(text) {
            text = Handlebars.Utils.escapeExpression(text);
            text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
            return new Handlebars.SafeString(text);
        }
    } 
});

app.engine("handlebars", hbs.engine); //setting up file extension
app.set("view engine", "handlebars"); 

//I can write routes here
app.get('/', function(req, res){
    connection.query('SELECT * FROM burgers', function (error, results, fields) {
        if (error) throw error;
        
        res.render('burgers', {
            data: results
        });
    });
})

//one way - works well with forms
//localhost:3000/insert-bird?nam=theburgernamegoeshere
app.get('/insert-burger', function(req, res){
    //res.json(req.query);
    connection.query('INSERT INTO burgers (burger_name) VALUES (?)', [req.query.nam], function (error, results, fields) {
      if (error) throw error;
        
      res.redirect('/');
    });
})

//another way - doesn't work well with forms
//localhost:3000/insert-bird/thebirdnamegoeshere
app.get('/checkoff-burger/:burgernam', function(req, res){
	connection.query('UPDATE burgers SET devoured=1 WHERE burger_name=(?)', [req.params.burgernam], function (error, results, fields) {
	  if (error) throw error;
        
	  res.redirect('/');
	});
})

//listen for port 


app.listen(3000, function(){
    console.log('running on 3000')
});