const express = require('express');
const router = express.Router();
const contractor = require('../controller/contractorController');


router.get('/contractor/all', async (req, res) => {
    try {
        const data = await contractor.getContractors();
        if(data && data.length > 0)
        {
            res.json(data);
        }
        else{
            res.status(404).json({ message: 'No contractor found.' });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.get('/contractor/:id', async (req, res) => {
    try {
        const data = await contractor.getContractor(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/contractor/create', async (req, res) => {
    try {
        const data = await contractor.addContractor(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/contractor/update/:id', async (req, res) => {
    try {
        const data = await contractor.updateContractor(req.params.id, req.body);
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/contractor/delete/:id', async (req, res) => {
    try {
        await contractor.deleteContractor(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;