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

app.post('/subindicador/agregar', (req, res) => {
  const { id_subindicador, cod_contable, descripcion, id_indicador } = req.body;
  connection.query('INSERT INTO cod_cont_subindicador (id_subindicador, cod_contable, descripcion, id_indicador) VALUES (?, ?, ?, ?)', [id_subindicador, cod_contable, descripcion, id_indicador], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* **************************************************************************************************************************************************************** */

/* **************************************************************************************************************************************************************** */
//SELECT
//Categorias
app.get('/categorias', (req, res) => {
  connection.query('SELECT * FROM cod_cont_categoria', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
//Subcategorias
app.get('/subcategorias', (req, res) => {
  connection.query('SELECT * FROM cod_cont_subcategoria', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
//Indicadores
app.get('/indicadores', (req, res) => {
  connection.query('SELECT * FROM cod_cont_indicador', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
//Subindicadores
app.get('/subindicadores', (req, res) => {
  connection.query('SELECT * FROM cod_cont_subindicador', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* **************************************************************************************************************************************************************** */

/* **************************************************************************************************************************************************************** */
/* Activos GET*/
app.get('/categorias/activos', (req, res) => {
  connection.query('SELECT * FROM `cod_cont_categoria` WHERE id_categoria = 1;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/subcategorias/activos', (req, res) => {
  connection.query('SELECT * FROM cod_cont_subcategoria WHERE id_categoria = 1;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/indicadores/activos', (req, res) => {
  connection.query('SELECT * FROM `cod_cont_indicador` WHERE id_subcategoria = 1;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/subindicadores/activos', (req, res) => {
  connection.query('SELECT SIND.cod_contable, SIND.descripcion FROM cod_cont_subcategoria SC JOIN cod_cont_indicador IND ON SC.id_subcategoria = IND.id_subcategoria JOIN cod_cont_subindicador SIND ON IND.id_indicador = SIND.id_indicador WHERE SC.id_subcategoria = 1;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

/* Activos POST */
app.post('/categorias/activos/agregar', (req, res) => {
  const { id_categoria, cod_contable, descripcion } = req.body;
  connection.query('INSERT INTO cod_cont_categoria (id_categoria, cod_contable, descripcion) VALUES (?, ?, ?)', [id_categoria, cod_contable, descripcion], (err, results) => {
    if (err) throw err;
    res.send(results);/*  */
  });
});
/* Activos SEARCH */
app.get('/categorias/activos/search', (req, res) => {
  const { id_categoria, cod_contable, descripcion } = req.body;
  connection.query('SELECT * FROM `cod_cont_categoria` WHERE id_categoria = 1 AND cod_contable LIKE ? AND descripcion LIKE ?', [id_categoria, cod_contable, descripcion], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* Activos DELETE */
app.delete('/categorias/activos/delete', (req, res) => {
  const { id_categoria, cod_contable, descripcion } = req.body;
  connection.query('DELETE FROM `cod_cont_categoria` WHERE id_categoria = 1 AND cod_contable LIKE ? AND descripcion LIKE ?', [id_categoria, cod_contable, descripcion], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* Activos UPDATE */
app.put('/categorias/activos/update', (req, res) => {
  const { id_categoria, cod_contable, descripcion } = req.body;
  connection.query('UPDATE `cod_cont_categoria` SET cod_contable = ?, descripcion = ? WHERE id_categoria = 1 AND cod_contable LIKE ? AND descripcion LIKE ?', [cod_contable, descripcion, id_categoria, cod_contable, descripcion], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* **************************************************************************************************************************************************************** */

/* **************************************************************************************************************************************************************** */
/* Pasivos */
app.get('/categorias/pasivos', (req, res) => {
  connection.query('SELECT * FROM `cod_cont_categoria` WHERE id_categoria = 2;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/subcategorias/pasivos', (req, res) => {
  connection.query('SELECT * FROM cod_cont_subcategoria WHERE id_categoria = 2;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/indicadores/pasivos', (req, res) => {
  connection.query('SELECT * FROM `cod_cont_indicador` WHERE id_subcategoria = 2;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/subindicadores/pasivos', (req, res) => {
  connection.query('SELECT SIND.cod_contable, SIND.descripcion FROM cod_cont_subcategoria SC JOIN cod_cont_indicador IND ON SC.id_subcategoria = IND.id_subcategoria JOIN cod_cont_subindicador SIND ON IND.id_indicador = SIND.id_indicador WHERE SC.id_subcategoria = 2;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* **************************************************************************************************************************************************************** */

/* **************************************************************************************************************************************************************** */
/* Patrimonio */
app.get('/categorias/patrimonio', (req, res) => {
  connection.query('SELECT * FROM `cod_cont_categoria` WHERE id_categoria = 3;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* **************************************************************************************************************************************************************** */

/* **************************************************************************************************************************************************************** */
/* Ingresos */
app.get('/categorias/ingresos', (req, res) => {
  connection.query('SELECT * FROM `cod_cont_categoria` WHERE id_categoria = 4;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* **************************************************************************************************************************************************************** */

/* **************************************************************************************************************************************************************** */
/* Egresos */
app.get('/categorias/egresos', (req, res) => {
  connection.query('SELECT * FROM `cod_cont_categoria` WHERE id_categoria = 5;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});





app.listen(3001, () => console.log('Server started on port 3001'));
