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
        let managerData = req.body;
        if (req.file) {
            managerData.Image = req.file.path; // Store file path if an image is uploaded
        }

        const updatedManager = await managerController.updateReportManager(parseInt(req.params.id), managerData);

        if (!updatedManager) {
            return res.status(404).json({ message: "Report Manager not found." }); // Return 404 if no rows were updated
        }

        res.json(updatedManager);
    } catch (error) {
        res.status(500).json({ message: "Error updating Report Manager" });
    }
});

// Delete Report Manager API
router.delete('/reportmanager/delete/:id', async (req, res) => {
    try {
        const deletedManager = await managerController.deleteReportManager(parseInt(req.params.id));

        if (!deletedManager) {
            return res.status(404).json({ message: "Report Manager not found." }); // Return 404 if no rows were deleted
        }

        res.json(deletedManager);
    } catch (error) {
        res.status(500).json({ message: "Error deleting Report Manager" });
    }
});


module.exports = router;