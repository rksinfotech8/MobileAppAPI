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
        if(Object.keys(data) && Object.keys(data).length > 0)
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
        let workerData = req.body;
        if (req.file) {
            workerData.Image = req.file.path; // Store file path if an image is uploaded
        }
        const data = await worker.updateWorker(parseInt(req.params.id), workerData);
        res.json(data);
    } catch (error) {
        if (error.message === "No record found with the given Id") {
            res.status(404).send(error.message);
        } else {
            res.status(500).send(error.message);
        }
    }
});


router.delete('/worker/delete/:id', async (req, res) => {
    try {
        const data = await worker.deleteWorker(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        if (error.message === "No record found with the given Id") {
            res.status(404).send(error.message);
        } else {
            res.status(500).send(error.message);
        }
    }
});


module.exports = router;