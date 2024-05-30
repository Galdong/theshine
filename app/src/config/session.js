const express = require("express");
const app = express();
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const DBoptions = {
   host: process.env.DB_HOST,
   port: 3306,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE
};

const sessionStore = new MySQLStore(DBoptions);
const options = {
   key: 'session_cookie_name',
   secret: process.env.SECRET,
   store: sessionStore,
   resave: false,
   saveUninitialized: false
};

app.use(session(options));