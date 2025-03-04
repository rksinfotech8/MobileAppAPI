const express = require("express");
const router = express.Router();
const worker = require("../controller/workerController");
const multer = require("multer");
const path = require("path");

//Use Multer Storage Configuration from server.js
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// Get All Workers
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

// Create Worker (with Image Upload)
router.post("/worker/create", upload.single("Image"), async (req, res) => {
    try {
        console.log("Received Data:", req.body);
        console.log("Uploaded File:", req.file);

        const workerData = {
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            MobileNumber: req.body.MobileNumber,
            Work: req.body.Work,
            WorkType: req.body.WorkType,
            Image: req.file ? req.file.filename : null, // Save only the filename
        };

        const data = await worker.addWorker(workerData);
        res.status(201).json({ message: "Worker added successfully", data });
    } catch (error) {
        console.error("Error adding worker:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Update Worker (with Image Upload)
router.put("/worker/update/:id", upload.single("Image"), async (req, res) => {
    try {
        console.log("Updating Worker:", req.body);
        console.log("New Image:", req.file);

        const workerData = {
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            MobileNumber: req.body.MobileNumber,
            Work: req.body.Work,
            WorkType: req.body.WorkType,
            Image: req.file ? req.file.filename : req.body.Image, // Keep old image if not updated
        };

        const data = await worker.updateWorker(req.params.id, workerData);
        res.json({ message: "Worker updated successfully", data });
    } catch (error) {
        if (error.message === "No record found with the given Id") {
            res.status(404).send(error.message);
        } else {
            res.status(500).send(error.message);
        }
    }
});

// Delete Worker
router.delete("/worker/delete/:id", async (req, res) => {
    try {
        const result = await worker.deleteWorker(req.params.id);
        if (result) {
            res.status(200).json({ message: "Worker deleted successfully" });
        } else {
            res.status(404).json({ message: "Worker not found" });
        }
    } catch (error) {
        if (error.message === "No record found with the given Id") {
            res.status(404).send(error.message);
        } else {
            res.status(500).send(error.message);
        }
    }
});

module.exports = router;
