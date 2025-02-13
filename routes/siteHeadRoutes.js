const express = require('express');
const router = express.Router();
const siteHeadController = require('../controller/siteHeadController');


router.get('/sitehead/all', async (req, res) => {
    try {
        const data = await siteHeadController.getSiteHeadDetails();
        res.json(data);
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
router.post('/sitehead/create', async (req, res) => {
    try {
        const data = await siteHeadController.addSiteHead(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update a SiteHead record
router.put('/sitehead/update/:id', async (req, res) => {
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