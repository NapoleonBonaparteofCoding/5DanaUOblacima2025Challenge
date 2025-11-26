const express = require('express');
const router = express.Router();

let rezervacije = [];
let rezervacijaId = 1;

// RADNO VREME MENZI
const radnoVreme = {
    "1": { // Velika menza
        "breakfast": { start: "07:00", end: "10:00" },
        "lunch":     { start: "11:00", end: "15:00" },
        "dinner":    { start: "17:00", end: "20:00" }
    },
    "2": { // Mala menza
        "breakfast": { start: "07:30", end: "10:30" },
        "lunch":     { start: "11:00", end: "15:30" },
        "dinner":    { start: "17:00", end: "20:30" }
    }
};
// Pretvaranje "HH:MM" u minute
function toMinutes(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}

// Pretvori minute u string HH:MM
function toTimeString(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

// Određivanje obroka na osnovu vremena + trajanje
function odrediObrok(canteenId, startTime, duration) {
    const tStart = toMinutes(startTime);
    const tEnd = tStart + duration;

    for (const [meal, vreme] of Object.entries(radnoVreme[canteenId])) {
        const start = toMinutes(vreme.start);
        const end = toMinutes(vreme.end);

        if (tStart >= start && tEnd <= end) {
            return meal;
        }
    }

    return null;
}

// POST /reservations - KREIRANJE REZERVACIJE
router.post('/reservations', (req, res) => {
    const { studentId, canteenId, date, time, duration } = req.body;

    // Validacija obaveznih polja
    if (!studentId || !canteenId || !date || !time || !duration) {
        return res.status(400).json({
            error: "Sva polja su obavezna: studentId, canteenId, date, time, duration"
        });
    }

    if (!canteenId || isNaN(Number(canteenId))) {
  return res.status(400).json({
    error: "Neispravan canteenId"
  });
}


    // ODREDI OBROK na osnovu vremena + trajanje
    const meal = odrediObrok(canteenId, time, duration);

    if (!meal) {
        return res.status(400).json({
            error: "Termin ne staje u radno vrijeme ni jednog obroka.",
            workingHours: radnoVreme[canteenId]
        });
    }

    // PROVERA DA TERMIN SA TRAJANJEM STANE U OBROK
    const vremeObroka = radnoVreme[canteenId][meal];
    const startMin = toMinutes(vremeObroka.start);
    const endMin = toMinutes(vremeObroka.end);

    const rezStart = toMinutes(time);
    const rezEnd = rezStart + duration;

    if (rezStart < startMin || rezEnd > endMin) {
        return res.status(400).json({
            error: `Termin ne može da stane u vreme za ${meal}.`,
            allowed: `${vremeObroka.start} - ${vremeObroka.end}`,
            yourTerm: `${time} - ${toTimeString(rezEnd)}`
        });
    }

    // Provera da student već nema rezervaciju istovremeno
    const postojeca = rezervacije.find(r =>
        r.studentId === studentId &&
        r.date === date &&
        ((toMinutes(r.time) <= rezStart && toMinutes(r.time) + r.duration > rezStart) ||
         (rezStart <= toMinutes(r.time) && rezEnd > toMinutes(r.time)))
    );

    if (postojeca) {
        return res.status(400).json({
            error: "Student već ima rezervaciju koja se preklapa sa ovim terminom."
        });
    }

    // Kapacitet menzi
    const kapaciteti = {
        "1": 20,
        "2": 15
    };

    // Broj rezervacija u istoj menzi i terminu
    const brojUMenzi = rezervacije.filter(r =>
        r.canteenId === canteenId &&
        r.date === date &&
        r.time === time
    ).length;

    if (brojUMenzi >= kapaciteti[canteenId]) {
        return res.status(400).json({
            error: `Nema slobodnih mesta za ovaj termin.`,
            capacity: kapaciteti[canteenId]
        });
    }

    // Kreiranje rezervacije
    const nova = {
        id: rezervacijaId.toString(),
        studentId,
        canteenId,
        date,
        time,
        duration,
        meal,
    };

    rezervacije.push(nova);
    rezervacijaId++;

    res.status(201).json(nova);
});

// GET ALL REZERVACIJE
router.get('/reservations', (req, res) => {
    res.status(200).json(rezervacije);
});

// GET PO ID
router.get('/reservations/:id', (req, res) => {
    const r = rezervacije.find(x => x.id === req.params.id);
    if (!r) return res.status(404).json({ error: "Rezervacija nije pronađena" });
    res.json(r);
});

// REZERVACIJE PO STUDENTU
router.get('/reservations/student/:studentId', (req, res) => {
    res.json(rezervacije.filter(r => r.studentId === req.params.studentId));
});

// REZERVACIJE PO MENZI
router.get('/reservations/canteen/:canteenId', (req, res) => {
    res.json(rezervacije.filter(r => r.canteenId === req.params.canteenId));
});
// PUT - OTKAZIVANJE REZERVACIJE (cancel)
router.put('/reservations/:id/cancel', (req, res) => {
    const rezervacija = rezervacije.find(r => r.id === req.params.id);
    
    if (!rezervacija) {
        return res.status(404).json({ error: "Rezervacija nije pronađena" });
    }
    
    if (rezervacija.status === "Cancelled") {
        return res.status(400).json({ error: "Rezervacija je već otkazana" });
    }
    
    rezervacija.status = "Cancelled";
    
    res.status(200).json(rezervacija);
});
// DELETE - BRISANJE REZERVACIJE
router.delete('/reservations/:id', (req, res) => {
    const index = rezervacije.findIndex(r => r.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: "Rezervacija nije pronađena" });
    }
    
    const obrisanaRezervacija = rezervacije.splice(index, 1)[0];
    
    // Vrati samo 7 originalnih polja (bez status)
    const { status, ...rezervacijaBezStatusa } = obrisanaRezervacija;
    
    res.status(200).json(rezervacijaBezStatusa);
});
module.exports = router;
