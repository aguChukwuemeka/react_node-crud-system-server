require('dotenv/config');
const express = require("express");
const bodyParser = require("body-parser");
const mySQL = require("mysql");
// const cors = require("cors");
// const router = express.Router();

const app = express();
const PORT = process.env.PORT || 5000;

const db = mySQL.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

db.connect((err) => {
    if (err) throw err;
    console.log("MySQl connected...");
});


// app.use(cors());
app.use(express.json()) 
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/create_movie_tbl", (req, res) => {
    let sql = `CREATE TABLE movie_review_table(id INT AUTO_INCREMENT,
         movieName VARCHAR(255) NOT NULL, movieReview VARCHAR(255) NOT NULL, PRIMARY KEY(id))`;
    db.query(sql, (err, data) => {
        if (err) throw err;
        console.log(data);
        res.send("Movie Table created...");
    });
});

app.post("/api/insert", (req, res) => {
    const movieName = req.body.movieName;
    const movieReview = req.body.movieReview;
    let sql = `INSERT INTO movie_review_table (movieName, movieReview) VALUES(?,?)`;
    db.query(sql, [movieName, movieReview], (err, data) => {
        if (err) throw err;
        res.send("post made successful");
        console.log(data);
    });
});

app.get("/api/getAll/review", (req, res) => {
    let sql = `SELECT * FROM movie_review_table`;
    db.query(sql, (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

app.get("/api/get/single_movie/:movieName", (req, res) => {
    const movieName = req.params.movieName;
    let sql = `SELECT * FROM movie_review_table WHERE movieName = ?`;
    db.query(sql, movieName, (err, data) => {
      if (err) throw err;
      res.send(data);
    });
});

app.put("/api/update", (req, res) => {
    const movieName = req.body.movieName;
    const movieReview = req.body.movieReview;
    console.log({movieName, movieReview})
    // let sql = `UPDATE movie_review_table SET movieName = ?, movieReview = ? WHERE movieName = ?`;
    let sql = `UPDATE movie_review_table SET movieReview = ? WHERE movieName = ?`;
    db.query(sql, [ movieReview, movieName], (err, data) => {
      if (err) throw err;
        res.send(data);
    });
});

app.delete("/api/delete/:movieName", (req, res) => {
    const movie_name = req.params.movieName;
    let sql = `DELETE FROM movie_review_table WHERE movieName = ?`;
    db.query(sql, movie_name, (err, data) => {
        if (err) throw err;
        res.send(data)
    });
});

app.get("*", (req, res) => {
    res.send('404 This Page is not found <a href="/">Go to Home Page</a>');
});

app.listen(PORT, () => console.log(`Server running on POST ${PORT}`));