const express = require('express');
const router = express.Router();
const contractor = require('../controller/contractorController');
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


router.get('/contractor/all', async (req, res) => {
    try {
        const data = await contractor.getContractors();
        if(Object.keys(data) && Object.keys(data).length > 0)
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

router.post('/contractor/create',upload.single("Image"), async (req, res) => {
    try {
        const data = await contractor.addContractor(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update Contractor API
router.put('/contractor/update/:id', upload.single("Image"), async (req, res) => {
    try {
        let contractorData = req.body;
        if (req.file) {
            contractorData.Image = req.file.path; // Store file path if an image is uploaded
        }

        const updatedContractor = await contractor.updateContractor(parseInt(req.params.id), contractorData);

        if (!updatedContractor) {
            return res.status(404).json({ message: "Contractor not found." }); // Return 404 if no rows were updated
        }

        res.json(updatedContractor);
    } catch (error) {
        res.status(500).json({ message: "Error updating Contractor" });
    }
});

// Delete Contractor API
router.delete('/contractor/delete/:id', async (req, res) => {
    try {
        const deletedContractor = await contractor.deleteContractor(parseInt(req.params.id));

        if (!deletedContractor) {
            return res.status(404).json({ message: "Contractor not found." }); // Return 404 if no rows were deleted
        }

        res.json(deletedContractor);
    } catch (error) {
        res.status(500).json({ message: "Error deleting Contractor" });
    }
});

module.exports = router;