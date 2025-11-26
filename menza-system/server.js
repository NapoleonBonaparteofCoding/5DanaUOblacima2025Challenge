const express = require('express');
const app = express();

const studentRoutes = require('./routes/students.js');
const canteenRoutes = require('./routes/canteens.js');
const reservationRoutes = require('./routes/reservations.js');

app.use(express.json());

app.use(studentRoutes);
app.use(canteenRoutes);
app.use(reservationRoutes);

app.listen(8080, () => {
    console.log('Server radi na http://localhost:8080');
});