const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const Localize = require('localize');
const localization = new Localize('translations/', 'mylocale', 'mylocale');
let mysql = require('mysql');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const mailer = require('./mailer');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/../public'));


app.listen(3333);

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "myDB"
});


con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    // con.query("CREATE TABLE requests(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL, comments VARCHAR(255) NULL, status BOOL NOT NULL)", function (err, result) {
    //     if (err) throw err;
    //     console.log("Database created");
    // });
});

app.get('/', function (req, res, next) {
    const lang = req.cookies.lang;
    language=lang;
    if (lang === 'en' || lang === 'ua') {
        localization.setLocale(lang);
    } else {
        localization.setLocale('en');
    }
    res.render('main_view', {
        domainName: config.domain,
        l: localization,
        image: config.image,
        toolbarColor: config.toolbarColor,
        navbarTheme: config.navbarTheme,
    });
});


app.get('/about', function (req, res, next) {
    const lang = req.cookies.lang;
    language=lang;
    if (lang === 'en' || lang === 'ua') {
        localization.setLocale(lang);
    } else {
        localization.setLocale('en');
    }
    res.render('about_view', {
        domainName: config.domain,
        l: localization,
        toolbarColor: config.toolbarColor,
        navbarTheme: config.navbarTheme,
    });
});

app.post('/createRequest', (req, res) => {
    console.log("createRequest!!!!!!!!!!!!");
    const {name, email, comment} = req.body;
    const link = "http://localhost:3333/confirmation/" + email;
    const mailText = `Dear, ${name}. Request for books has been successfully sent! Confirm it with this link. ${link}`;
    mailer.send(email, "CoolSite", mailText);
    console.log("mail" + mailText);
    let sql = ("INSERT INTO requests (name, email, comments, status) VALUES (?,?,?, false )");
    con.query(sql, [name, email, comment], function (err, result) {
        if (err) console.log(err);
        else
            console.log("successfully added request.");
    });

    res.redirect('../');
});

app.get('/confirmation/(:email)', function (req, res) {
    let email = req.params.email;
    console.log("email - " + email);
    updateUser(email);
    res.redirect('../');
});

function updateUser(email) {
    let sql = ("UPDATE requests SET status = true WHERE email = ?");
    con.query(sql, [email], function (err, result) {
        if (err) console.log(err);
        else
            console.log("successfully updated status.");
    });

}

app.get("/books", function (req, res) {
    const lang = req.cookies.lang;
    language=lang;
    if (lang === 'en' || lang === 'ua') {
        localization.setLocale(lang);
    } else {
        localization.setLocale('en');
    }

    res.render('books_view', {
        domainName: config.domain,
        l: localization,
        toolbarColor: config.toolbarColor,
        navbarTheme: config.navbarTheme,
    });
});

app.get("/admin", function (req, res) {
    const lang = req.cookies.lang;
    language=lang;
    if (lang === 'en' || lang === 'ua') {
        localization.setLocale(lang);
    } else {
        localization.setLocale('en');
    }

    res.render('admin', {
        domainName: config.domain,
        l: localization,
        toolbarColor: config.toolbarColor,
        navbarTheme: config.navbarTheme,
    });
});

var language;

app.get("/book_list", function (request, response) {
    console.log("/booklist - lang - "+language);
    if(language==='ua') {
        con.query("SELECT bookNameua, authorua, descriptionua FROM `books`;", function (err, result) {
            response.json({"books": result});
        });
    }
    else{
        con.query("SELECT bookNameen, authoren, descriptionen FROM `books`;", function (err, result) {
            response.json({"books": result});
        });
    }

});
app.get("/requests_list", function (request, response) {
    con.query("SELECT * FROM `requests`;", function (err, result) {
        console.log("result-");
        console.log(result);
        response.json({"requests": result});
    });
});