const express = require('express');
const router = express.Router();
const worker = require('../controller/workerController');
const multer = require("multer");
const path = require("path");


// Multer Configuration
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });


router.get('/worker/all', async (req, res) => {
    try {
        const data = await worker.getWorkers();
        if(data && data.length > 0)
        {
            res.json(data);
        }
        else{
            res.status(404).json({ message: 'No worker found.' });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.get('/worker/:id', async (req, res) => {
    try {
        const data = await worker.getWorker(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/worker/create', upload.single("Image"), async (req, res) => {
    try {
        const data = await worker.addWorker(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/worker/update/:id', upload.single("Image"), async (req, res) => {
    try {
        const data = await worker.updateWorker(req.params.id, req.body);
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/worker/delete/:id', async (req, res) => {
    try {
        await worker.deleteWorker(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;