const express = require('express');
const router = express.Router();
const siteHeadController = require('../controller/siteHeadController');
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


router.get('/sitehead/all', async (req, res) => {
    try {
        const data = await siteHeadController.getSiteHeadDetails();
        if(Object.keys(data) && Object.keys(data).length > 0){
            res.json(data);
        }
        else{
            res.status(404).json({ message: 'No Site Head found.'})
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get a single SiteHead record by ID
router.get('/sitehead/:id', async (req, res) => {
    try {
        const data = await siteHeadController.getSiteHeadDetail(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Add a new SiteHead record
router.post('/sitehead/create', upload.single("Image"), async (req, res) => {
    try {
        const data = await siteHeadController.addSiteHead(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update a SiteHead record
router.put('/sitehead/update/:id', upload.single("Image"), async (req, res) => {
    try {
        const data = await siteHeadController.updateSiteHead(req.params.id, req.body);
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete a SiteHead record
router.delete('/sitehead/delete/:id', async (req, res) => {
    try {
        await siteHeadController.deleteSiteHead(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;