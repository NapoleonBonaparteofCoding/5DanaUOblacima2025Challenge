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
// GET /canteens/status - STATUS SVIH MENZI (dostupnost za period)
router.get('/canteens/status', (req, res) => {
    const { startDate, startTime, endDate, endTime, duration } = req.query;
    
    // Validacija parametara
    if (!startDate || !startTime || !endDate || !endTime || !duration) {
        return res.status(400).json({
            error: "Svi parametri su obavezni: startDate, startTime, endDate, endTime, duration"
        });
    }
    
    // Funkcija za određivanje obroka na osnovu vremena
    function getMealForTime(time, workingHours) {
        if (!workingHours || workingHours.length === 0) return null;
        
        const [hour, min] = time.split(':').map(Number);
        const timeInMinutes = hour * 60 + min;
        
        for (const wh of workingHours) {
            const [fromHour, fromMin] = wh.from.split(':').map(Number);
            const [toHour, toMin] = wh.to.split(':').map(Number);
            const fromMinutes = fromHour * 60 + fromMin;
            const toMinutes = toHour * 60 + toMin;
            
            if (timeInMinutes >= fromMinutes && timeInMinutes < toMinutes) {
                return wh.meal;
            }
        }
        
        return null;
    }
    
    // Funkcija za formatiranje minuta u HH:MM
    function formatTime(minutes) {
        const hour = Math.floor(minutes / 60);
        const min = minutes % 60;
        return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    }
    
    // Funkcija za generisanje vremenskih slotova
    function generateTimeSlots(start, end, duration, date, workingHours, capacity) {
        const slots = [];
        const [startHour, startMin] = start.split(':').map(Number);
        const [endHour, endMin] = end.split(':').map(Number);
        
        let currentMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        const durationNum = parseInt(duration);
        
        while (currentMinutes + durationNum <= endMinutes) {
            const startTimeStr = formatTime(currentMinutes);
            const endTimeStr = formatTime(currentMinutes + durationNum);
            
            const meal = getMealForTime(startTimeStr, workingHours);
            
            // Samo dodaj slot ako pripada nekom obroku
            if (meal) {
                slots.push({
                    date: date,
                    startTime: startTimeStr,
                    endTime: endTimeStr,
                    meal: meal,
                    available: true,
                    remainingCapacity: capacity  // DODATO
                });
            }
            
            currentMinutes += durationNum;
        }
        
        return slots;
    }
    
    // Vraćamo status za SVE menze kao NIZ
    const statusi = menze.map(menza => {
        const slots = generateTimeSlots(startTime, endTime, duration, startDate, menza.workingHours, menza.capacity);
        
        return {
            canteenId: menza.id,
            name: menza.name,
            date: startDate,
            slots: slots
        };
    });
    
    res.status(200).json(statusi);
});
// GET - STATUS SPECIFIČNE MENZE (dostupnost za period)
router.get('/canteens/:id/status', (req, res) => {
    const { startDate, startTime, endDate, endTime, duration } = req.query;
    const canteenId = req.params.id;
    
    // Validacija parametara
    if (!startDate || !startTime || !endDate || !endTime || !duration) {
        return res.status(400).json({
            error: "Svi parametri su obavezni: startDate, startTime, endDate, endTime, duration"
        });
    }
    
    // Pronađi menzu
    const menza = menze.find(m => m.id === canteenId);
    
    if (!menza) {
        return res.status(404).json({ error: "Menza nije pronađena" });
    }
    
    // Funkcija za određivanje obroka na osnovu vremena
    function getMealForTime(time, workingHours) {
        if (!workingHours || workingHours.length === 0) return null;
        
        const [hour, min] = time.split(':').map(Number);
        const timeInMinutes = hour * 60 + min;
        
        for (const wh of workingHours) {
            const [fromHour, fromMin] = wh.from.split(':').map(Number);
            const [toHour, toMin] = wh.to.split(':').map(Number);
            const fromMinutes = fromHour * 60 + fromMin;
            const toMinutes = toHour * 60 + toMin;
            
            if (timeInMinutes >= fromMinutes && timeInMinutes < toMinutes) {
                return wh.meal;
            }
        }
        
        return null;
    }
    
    // Funkcija za formatiranje minuta u HH:MM
    function formatTime(minutes) {
        const hour = Math.floor(minutes / 60);
        const min = minutes % 60;
        return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    }
    
    // Funkcija za prebrojavanje rezervacija u slotu
    function countReservationsInSlot(canteenId, date, slotStartTime, slotEndTime) {
        // Učitajte rezervacije iz reservations modula
        // Privremeno pretpostavljamo da imate pristup nizу rezervacija
        
        // POTREBNO: importujte rezervacije iz reservations.js
        // const { rezervacije } = require('./reservations');
        
        // Za sada vraćamo 0, ali morate implementirati brojanje
        let count = 0;
        
        // Ovde treba da proverite sve rezervacije za datu menzu i datum
        // i prebrojite one koje se poklapaju sa ovim slotom
        
        return count;
    }
    
    // Funkcija za generisanje vremenskih slotova
    function generateTimeSlots(start, end, duration, date, workingHours, capacity, canteenId) {
        const slots = [];
        const [startHour, startMin] = start.split(':').map(Number);
        const [endHour, endMin] = end.split(':').map(Number);
        
        let currentMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        const durationNum = parseInt(duration);
        
        while (currentMinutes + durationNum <= endMinutes) {
            const startTimeStr = formatTime(currentMinutes);
            const endTimeStr = formatTime(currentMinutes + durationNum);
            
            const meal = getMealForTime(startTimeStr, workingHours);
            
            // Samo dodaj slot ako pripada nekom obroku
            if (meal) {
                // Prebroj rezervacije za ovaj slot
                const reservationCount = countReservationsInSlot(canteenId, date, startTimeStr, endTimeStr);
                const remaining = capacity - reservationCount;
                
                slots.push({
                    date: date,
                    startTime: startTimeStr,
                    endTime: endTimeStr,
                    meal: meal,
                    available: remaining > 0,
                    remainingCapacity: remaining
                });
            }
            
            currentMinutes += durationNum;
        }
        
        return slots;
    }
    
    const slots = generateTimeSlots(startTime, endTime, duration, startDate, menza.workingHours, menza.capacity, canteenId);
    
    const status = {
        canteenId: menza.id,
        name: menza.name,
        date: startDate,
        slots: slots
    };
    
    res.status(200).json(status);
});
// GET /canteens/:id - JEDNA MENZA PO ID-u
router.get('/canteens/:id', (req, res) => {
    const trazeniId = req.params.id;
    const menza = menze.find(m => m.id === trazeniId);
    
    if (!menza) {
        return res.status(404).json({
            error: "Menza nije pronađena"
        });
    }
    
    res.status(200).json(menza);
});
// GET /canteens (sve menze)
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
    
    // Ažuriraj samo ona polja koja su poslata
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
