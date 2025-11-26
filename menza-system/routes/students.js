const express = require('express');
const router = express.Router();

let studentId = 0;
let studenti = [];

router.post('/students', (req, res) => {
    const { name, email, isAdmin } = req.body;

    const noviStudent = {
        id: studentId.toString(),
        name,
        email,
        isAdmin: isAdmin || false
    };

    studenti.push(noviStudent);
    studentId++;
    res.status(201).json(noviStudent);
});

router.get('/students/:id', (req, res) => {
    const trazeniId = req.params.id;
    const student = studenti.find(s => s.id === trazeniId);
  
    res.status(200).json(student);
});


router.post('/add-students', (req, res) => {
    const { name, email, isAdmin } = req.body;

    const noviStudent = {
        id: studentId.toString(),
        name,
        email,
        isAdmin: isAdmin || false
    };

    studenti.push(noviStudent);
    studentId++;
    res.status(201).json(noviStudent);
});

module.exports = router;