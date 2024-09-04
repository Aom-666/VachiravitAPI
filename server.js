const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 3000 ;

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


db.connect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Insert a new Car
app.post('/add/car', (req, res) => {
    const { Brand, Model, Years , Color , Price , GearType , FuelType , NumberOfDoors , NumberOfSeats } = req.body

    if (!Brand || !Model || !Years || !Color || !Price || !GearType || !FuelType || !NumberOfDoors || !NumberOfSeats) {
        return res.status(400).send({'message':'All fields are required','status':false});
    }

    const query = `INSERT INTO CarInformation (Brand, Model, Years, Color, Price, GearType, FuelType, NumberOfDoors, NumberOfSeats, CarImage ) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '1')`;

    db.query(query, [Brand, Model, Years, Color, Price, GearType, FuelType, NumberOfDoors, NumberOfSeats], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send({'message':'Error inserting data','status':false});
        } else {
            res.status(201).send({'message':`Car added successfully`, 'status':true});
        }
    });
});

//Get a new Car
app.get('/get/car/:id', (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).send({"message":'Car ID is required','status':false});
    }

    const query = `SELECT * FROM CarInformation WHERE CarID  = ?`;
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send({"message":'Error fetching data',"status":false});
        } else {
            if (result.length === 0) {
                return res.status(404).send({"message":'Car not found',"status":false});
            }

            result[0]["message"] = "success";
            result[0]["status"] = true;
            res.send(result[0]); 
        }
    });
});


app.listen(port, () => {
    console.log(`Server running on Port ${port}`);
});
