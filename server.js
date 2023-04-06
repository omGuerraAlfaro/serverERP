require('dotenv').config();
const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(cors({  
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,}));

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

//login
app.post('/login', (req, res) => {
  const { email_user, password } = req.body;
  console.log(email_user, password);
  connection.query(process.env.SQL_USER_ROLES, [email_user, password], (err, results) => {
    if (err) {
      throw err;
    }
    if (results.length === 0) {      
      res.status(401).send(email_user,password);
    } else {
      res.send(results);
    }
  });
});

//data user
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.post('/users', (req, res) => {
  const { id_user, name_user, email_user, password } = req.body;
  connection.query('INSERT INTO users (id_user, name_user, email_user, password) VALUES (?, ?, ?, ?)', [id_user, name_user, email_user, password], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});



//Categorias
app.get('/categorias', (req, res) => {
  connection.query('SELECT * FROM cod_cont_categoria', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/subcategorias', (req, res) => {
  connection.query('SELECT * FROM cod_cont_subcategoria', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/indicadores', (req, res) => {
  connection.query('SELECT * FROM cod_cont_indicador', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/subindicadores', (req, res) => {
  connection.query('SELECT * FROM cod_cont_subindicador', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});



app.listen(3001, () => console.log('Server started on port 3001'));
