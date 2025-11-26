const express = require('express');
const router = express.Router();

let menzaId = 1;
let menze = [];

router.post('/canteens', (req, res) => {
    const { name, location, capacity, workingHours } = req.body;

    if (!name || !location || !capacity || !workingHours) {
        return res.status(400).json({
            error: "Sva polja su obavezna: name, location, capacity, workingHours"
        });
    }

    const novaMenza = {
        id: menzaId.toString(),
        name,
        location,
        capacity,
        workingHours
    };

    menze.push(novaMenza);
    menzaId++;
    res.status(201).json(novaMenza);
});


router.get('/canteens/:id/status', (req, res) => {
    const { startDate, startTime, endDate, endTime, duration } = req.query;
    const canteenId = req.params.id;
    
    
    if (!startDate || !startTime || !endDate || !endTime || !duration) {
        return res.status(400).json({
            error: "Svi parametri su obavezni: startDate, startTime, endDate, endTime, duration"
        });
    }
    
    
    const menza = menze.find(m => m.id === canteenId);
    
    if (!menza) {
        return res.status(404).json({ error: "Menza nije pronađena" });
    }
    
    
    const status = {
        canteenId: menza.id,
        name: menza.name,
        available: true,
        capacity: menza.capacity,
        freeSlots: menza.capacity,
        startDate,
        startTime,
        endDate,
        endTime,
        duration: parseInt(duration)
    };
    
    res.status(200).json(status);
});


router.get('/canteens', (req, res) => {
    res.status(200).json(menze);
});

router.post('/add-canteens', (req, res) => {
    const { name, location, capacity, workingHours } = req.body;

    if (!name || !location || !capacity || !workingHours) {
        return res.status(400).json({
            error: "Sva polja su obavezna: name, location, capacity, workingHours"
        });
    }

    const novaMenza = {
        id: menzaId.toString(),
        name,
        location,
        capacity,
        workingHours
    };

    menze.push(novaMenza);
    menzaId++;
    res.status(201).json(novaMenza);
});

router.put('/canteens/:id', (req, res) => {
    const menza = menze.find(m => m.id === req.params.id);
    
    if (!menza) {
        return res.status(404).json({ error: "Menza nije pronađena" });
    }
    
    const { name, location, capacity, workingHours } = req.body;
    
    if (name !== undefined) menza.name = name;
    if (location !== undefined) menza.location = location;
    if (capacity !== undefined) menza.capacity = capacity;
    if (workingHours !== undefined) menza.workingHours = workingHours;
    
    res.status(200).json(menza);
});


router.delete('/canteens/:id', (req, res) => {
    const index = menze.findIndex(m => m.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: "Menza nije pronađena" });
    }
    
    menze.splice(index, 1);
    
    res.status(204).send(); 
});

module.exports = router;

module.exports = router;
