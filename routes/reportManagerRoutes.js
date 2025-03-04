const express = require('express');
const router = express.Router();
const managerContoller = require('../controller/reportManagerController');
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

router.get('/reportmanager/all', async (req, res) => {
    try {
        const data = await managerContoller.getReportManagers();
        if(Object.keys(data) && Object.keys(data).length > 0)
        {
            res.json(data);
        }
        else{
            res.status(404).json({ message: 'No Fields found.' });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get a single SiteHead record by ID
router.get('/reportmanager/:id', async (req, res) => {
    try {
        const data = await managerContoller.getReportManager(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/reportmanager/create', upload.single("Image"), async (req, res) => {
    try {
        const data = await managerContoller.addReportManager(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/reportmanager/update/:id', upload.single("Image"), async (req, res) => {
    try {
        let reportData = req.body;
        if (req.file) {
            reportData.Image = req.file.path; // Store file path if an image is uploaded
        }
        const data = await managerContoller.updateReportManager(parseInt(req.params.id), reportData);
        res.json(data);
    } catch (error) {
        if (error.message === "No record found with the given Id") {
            res.status(404).send(error.message);
        } else {
            res.status(500).send(error.message);
        }
    }
});


router.delete('/reportmanager/delete/:id', async (req, res) => {
    try {
        const data = await managerContoller.deleteReportManager(req.params.id);
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