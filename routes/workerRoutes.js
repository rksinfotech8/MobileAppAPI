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

// Update Worker API
router.put('/worker/update/:id', upload.single("Image"), async (req, res) => {
    try {
        let workerData = req.body;
        if (req.file) {
            workerData.Image = req.file.path; // Store file path if an image is uploaded
        }

        const updatedRows = await updateWorker(parseInt(req.params.id), workerData);

        if (!updatedRows) {
            return res.status(404).json({ message: 'Worker not found.' }); // Return 404 if no rows were updated
        }

        res.json({ message: 'Worker updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating worker.' });
    }
});

// Delete Worker API
router.delete('/worker/delete/:id', async (req, res) => {
    try {
        const deletedRows = await deleteWorker(parseInt(req.params.id));

        if (!deletedRows) {
            return res.status(404).json({ message: 'Worker not found.' }); // Return 404 if no rows were deleted
        }

        res.json({ message: 'Worker deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting worker.' });
    }
});

module.exports = router;