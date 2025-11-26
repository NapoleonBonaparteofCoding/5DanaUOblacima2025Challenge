const express = require('express');
const router = express.Router();

let studentId = 0;
let studenti = [];

router.post('/students', (req, res) => {
    const { name, email, isAdmin } = req.body;

    if (!name || !email || isAdmin === undefined) {
        return res.status(400).json({
            error: "Sva polja su obavezna: name, email, isAdmin"
        });
    }

    const postojeciStudent = studenti.find(s => s.email === email);
    if (postojeciStudent) {
        return res.status(400).json({
            error: "Student sa ovim email-om već postoji"
        });
    }

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
    
    if (!student) {
        return res.status(404).json({
            error: "Student nije pronađen"
        });
    }
  
    res.status(200).json(student);
});

router.post('/add-students', (req, res) => {
    const { name, email, isAdmin } = req.body;

    if (!name || !email || isAdmin === undefined) {
        return res.status(400).json({
            error: "Sva polja su obavezna: name, email, isAdmin"
        });
    }

    const postojeciStudent = studenti.find(s => s.email === email);
    if (postojeciStudent) {
        return res.status(400).json({
            error: "Student sa ovim email-om već postoji"
        });
    }

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
