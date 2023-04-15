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
  "preflightContinue": false,
}));

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
      res.status(401).send(email_user, password);
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
  connection.query('SELECT IND.id_indicador,IND.cod_contable, IND.descripcion FROM cod_cont_categoria CAT JOIN cod_cont_subcategoria SC ON CAT.id_categoria = SC.id_categoria JOIN cod_cont_indicador IND ON SC.id_subcategoria = IND.id_subcategoria WHERE CAT.id_categoria = 1;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/subindicadores/activos', (req, res) => {
  connection.query('SELECT SIND.id_subindicador, SIND.cod_contable, SIND.descripcion FROM cod_cont_categoria CAT JOIN cod_cont_subcategoria SC ON CAT.id_categoria = SC.id_categoria JOIN cod_cont_indicador IND ON SC.id_subcategoria = IND.id_subcategoria JOIN cod_cont_subindicador SIND ON IND.id_indicador = SIND.id_indicador WHERE CAT.id_categoria = 1;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

/* **************************************************************************************************************************************************************** */
/* Activos SEARCH  AUN NO LO PRUEBO.*/
app.get('/categorias/activos/search', (req, res) => {
  const { id_categoria, cod_contable, descripcion } = req.body;
  connection.query('SELECT * FROM `cod_cont_categoria` WHERE id_categoria = 1 AND cod_contable LIKE ? AND descripcion LIKE ?', [id_categoria, cod_contable, descripcion], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* Activos SUBCATEGORIA */
app.post('/subcategorias/activos/agregar', (req, res) => {
  const { id_subcategoria, cod_contable, descripcion, id_categoria } = req.body;
  connection.query('INSERT INTO cod_cont_subcategoria (id_subcategoria, cod_contable, descripcion, id_categoria) VALUES (?, ?, ?, ?)', [id_subcategoria, cod_contable, descripcion, id_categoria], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* Activos SUBCATEGORIA DELETE */
app.delete('/subcategorias/activos/eliminar/:id_subcategoria', (req, res) => {
  const { id_subcategoria } = req.params;
  connection.query('DELETE FROM `cod_cont_subcategoria` WHERE id_subcategoria = ?', [id_subcategoria], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* Activos SUBCATEGORIA UPDATE */
app.put('/subcategorias/activos/editar/:id_subcategoria', (req, res) => {
  const { id_subcategoria, cod_contable, descripcion, id_categoria } = req.body;
  connection.query('UPDATE cod_cont_subcategoria SET id_subcategoria= ?, cod_contable= ?, descripcion=?, id_categoria= ? WHERE id_subcategoria = ?', [id_subcategoria, cod_contable, descripcion, id_categoria, id_subcategoria], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* Activos INDICADORES agregar*/
app.post('/indicadores/activos/agregar', (req, res) => {
  const { id_indicador, cod_contable, descripcion, id_subcategoria } = req.body;
  connection.query('INSERT INTO cod_cont_indicador (id_indicador, cod_contable, descripcion, id_subcategoria) VALUES (?, ?, ?, ?)', [id_indicador, cod_contable, descripcion, id_subcategoria], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* Activos INDICADORES DELETE */
app.delete('/indicadores/activos/eliminar/:id_indicador', (req, res) => {
  const { id_indicador } = req.params;
  connection.query('DELETE FROM `cod_cont_indicador` WHERE id_indicador = ?', [id_indicador], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* Activos SUBINDICADORES AGREGAR */
app.post('/subindicadores/activos/agregar', (req, res) => {
  const { id_subindicador, cod_contable, descripcion, id_indicador } = req.body;
  connection.query('INSERT INTO cod_cont_subindicador (id_subindicador, cod_contable, descripcion, id_indicador) VALUES (?, ?, ?, ?)', [id_subindicador, cod_contable, descripcion, id_indicador], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* Activos SUBINDICADORES DELETE */
app.delete('/subindicadores/activos/eliminar/:id_subindicador', (req, res) => {
  const { id_subindicador } = req.params;
  connection.query('DELETE FROM `cod_cont_subindicador` WHERE id_subindicador = ?', [id_subindicador], (err, results) => {
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
  connection.query('SELECT IND.cod_contable, IND.descripcion FROM cod_cont_categoria CAT JOIN cod_cont_subcategoria SC ON CAT.id_categoria = SC.id_categoria JOIN cod_cont_indicador IND ON SC.id_subcategoria = IND.id_subcategoria WHERE CAT.id_categoria = 2;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/subindicadores/pasivos', (req, res) => {
  connection.query('SELECT SIND.cod_contable, SIND.descripcion FROM cod_cont_categoria CAT JOIN cod_cont_subcategoria SC ON CAT.id_categoria = SC.id_categoria JOIN cod_cont_indicador IND ON SC.id_subcategoria = IND.id_subcategoria JOIN cod_cont_subindicador SIND ON IND.id_indicador = SIND.id_indicador WHERE CAT.id_categoria = 2;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* **************************************************************************************************************************************************************** */
/* 
/* **************************************************************************************************************************************************************** */
/* Patrimonio */
app.get('/categorias/patrimonio', (req, res) => {
  connection.query('SELECT * FROM `cod_cont_categoria` WHERE id_categoria = 3;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/subcategorias/patrimonio', (req, res) => {
  connection.query('SELECT * FROM cod_cont_subcategoria WHERE id_categoria = 3;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/indicadores/patrimonio', (req, res) => {
  connection.query('SELECT IND.cod_contable, IND.descripcion FROM cod_cont_categoria CAT JOIN cod_cont_subcategoria SC ON CAT.id_categoria = SC.id_categoria JOIN cod_cont_indicador IND ON SC.id_subcategoria = IND.id_subcategoria WHERE CAT.id_categoria = 3;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/subindicadores/patrimonio', (req, res) => {
  connection.query('SELECT SIND.cod_contable, SIND.descripcion FROM cod_cont_categoria CAT JOIN cod_cont_subcategoria SC ON CAT.id_categoria = SC.id_categoria JOIN cod_cont_indicador IND ON SC.id_subcategoria = IND.id_subcategoria JOIN cod_cont_subindicador SIND ON IND.id_indicador = SIND.id_indicador WHERE CAT.id_categoria = 3;', (err, results) => {
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
app.get('/subcategorias/ingresos', (req, res) => {
  connection.query('SELECT * FROM cod_cont_subcategoria WHERE id_categoria = 4;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/indicadores/ingresos', (req, res) => {
  connection.query('SELECT IND.cod_contable, IND.descripcion FROM cod_cont_categoria CAT JOIN cod_cont_subcategoria SC ON CAT.id_categoria = SC.id_categoria JOIN cod_cont_indicador IND ON SC.id_subcategoria = IND.id_subcategoria WHERE CAT.id_categoria = 4;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/subindicadores/ingresos', (req, res) => {
  connection.query('SELECT SIND.cod_contable, SIND.descripcion FROM cod_cont_categoria CAT JOIN cod_cont_subcategoria SC ON CAT.id_categoria = SC.id_categoria JOIN cod_cont_indicador IND ON SC.id_subcategoria = IND.id_subcategoria JOIN cod_cont_subindicador SIND ON IND.id_indicador = SIND.id_indicador WHERE CAT.id_categoria = 4;', (err, results) => {
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
app.get('/subcategorias/egresos', (req, res) => {
  connection.query('SELECT * FROM cod_cont_subcategoria WHERE id_categoria = 5;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/indicadores/egresos', (req, res) => {
  connection.query('SELECT IND.cod_contable, IND.descripcion FROM cod_cont_categoria CAT JOIN cod_cont_subcategoria SC ON CAT.id_categoria = SC.id_categoria JOIN cod_cont_indicador IND ON SC.id_subcategoria = IND.id_subcategoria WHERE CAT.id_categoria = 5;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
app.get('/subindicadores/egresos', (req, res) => {
  connection.query('SELECT SIND.cod_contable, SIND.descripcion FROM cod_cont_categoria CAT JOIN cod_cont_subcategoria SC ON CAT.id_categoria = SC.id_categoria JOIN cod_cont_indicador IND ON SC.id_subcategoria = IND.id_subcategoria JOIN cod_cont_subindicador SIND ON IND.id_indicador = SIND.id_indicador WHERE CAT.id_categoria = 5;', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
/* **************************************************************************************************************************************************************** */

/* LIBRO DE BANCO INSERT */
app.post('/libro_banco/agregar', (req, res) => {
  const { id_mov, fecha_mov, cod_contable, id_transaccion, descripcion, salidas_libro, entradas_libro, saldo_libro, id_categoria, id_subcategoria, id_indicador, id_subindicador } = req.body;
  connection.query('INSERT INTO libro_banco (id_mov, fecha_mov, cod_contable, id_transaccion, descripcion, salidas_libro, entradas_libro, saldo_libro, id_categoria, id_subcategoria, id_indicador, id_subindicador) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id_mov, fecha_mov, cod_contable, id_transaccion, descripcion, salidas_libro, entradas_libro, saldo_libro, id_categoria, id_subcategoria, id_indicador, id_subindicador], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});



app.listen(3001, () => console.log('Server started on port 3001'));
