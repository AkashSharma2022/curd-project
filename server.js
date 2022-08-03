const mysql = require('mysql');
const express = require('express');
let app = express();
const bodyParser = require('body-parser');

app.use(
      bodyParser.urlencoded({
            extended: false,
      })
);

app.use(bodyParser.json());

let con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "mydb"
});

con.connect(function (err) {
      if (err) throw err;
      console.log("Connected to database");
});


app.post('/insert', function (req, res) {
      let user = req.body;
      console.log(user.userName);
      if (!user) {
            return res.status(400).send({ error: true, message: 'Please provide user' });
      }
      con.query("INSERT INTO loginUser SET ? ", [{ userName: user.userName, userPass: user.userPass }], function (error, results, fields) {
            if (error) throw error;
            return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
      });
});

app.get('/users', function (req, res) {
      con.query('SELECT * FROM loginUser', function (error, results) {
            if (error) throw error;
            return res.send({ error: false, data: results, message: 'users list.' });
      });
});

app.listen(3000, function () {
      console.log('Node app is running on port 3000');
});


app.delete('/delete', function (req, res) {
      let user = req.body;
      let id = user.userId;
      if (!user) {
            return res.status(400).send({ error: true, message: 'user does not exists' });
      }
      con.query(`DELETE FROM loginUser WHERE userName = ? AND userId = ${id}`, user.userName, (error, results) => {
            if (error) throw error;
            return res.send({ error: false, data: results, message: 'Data deleted' });
      });
});


app.put('/edit', (req, res) => {
      let user = req.body;
      console.log(user.userName);
      let id = user.userId;
      if (!user) {
            return res.status(400).send({ error: true, message: 'enter user for edit' });
      }
      con.query(`UPDATE loginUser SET userName = ?, userPass = ? WHERE userId = ${id}`, [user.userName, user.userPass], (error, results) => {
            if (error) throw error;
            return res.send({ error: false, data: results, message: 'Data edited' });
      });
});




