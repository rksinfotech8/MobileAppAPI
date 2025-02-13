const express = require('express');
const router = express.Router();
const managerContoller = require('../controller/reportManagerController');


router.get('/reportmanager/all', async (req, res) => {
    try {
        const data = await managerContoller.getReportManagers();
        if(data && data.length > 0)
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

router.post('/reportmanager/create', async (req, res) => {
    try {
        const data = await managerContoller.addReportManager(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/reportmanager/update/:id', async (req, res) => {
    try {
        const data = await managerContoller.updateReportManager(req.params.id, req.body);
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/reportmanager/delete/:id', async (req, res) => {
    try {
        await managerContoller.deleteReportManager(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;