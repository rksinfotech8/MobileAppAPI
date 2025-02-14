const express = require('express');
const router = express.Router();
const db = require('../controller/fieldStateController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// name change => fieldstate to facilities 
router.route('/facilities/all').get((request, response) => {
   db.getFieldStates()
       .then(result => {
           if (Object.keys(result) && Object.keys(result).length > 0) {
               response.json(result);
           } else {
               response.status(404).json({ message: 'No Fields found.' });
           }
       })
       .catch(error => {
           console.error(error);
           response.status(500).json({ message: 'Error fetching Fields.' });
       });
});

// Get a single fieldState by ID
router.route('/facilities/:id').get((request, response) => {
   const { id } = request.params;
   db.getFieldState(id)
       .then(result => {
           if (result && result.length > 0) {
               response.json(result[0]);
           } else {
               response.status(404).json({ message: `Field with ID ${id} not found.` });
           }
       })
       .catch(error => {
           console.error(error);
           response.status(500).json({ message: 'Error fetching Fields.' });
       });
});

// Add a new fieldState
router.route('/facilities/create').post((request, response) => {
   const field = { ...request.body };
   db.addFieldState(field)
       .then(result => {
           response.status(201).json(result);
       })
       .catch(error => {
           console.error(error);
           response.status(500).json({ message: 'Error adding Fields.' });
       });
});

// Update an existing fieldState
router.route('/facilities/update/:id').put((request, response) => {
   const { id } = request.params;
   const updatedFieldState = { ...request.body };
   db.updateFieldState(id, updatedFieldState)
       .then(result => {
           if (result && result.length > 0) {
               response.json(result[0]);
           } else {
               response.status(404).json({ message: `Field with ID ${id} not found for update.` });
           }
       })
       .catch(error => {
           console.error(error);
           response.status(500).json({ message: 'Error updating Fields.' });
       });
});

// Delete a fieldState
router.route('/facilities/delete/:id').delete((request, response) => {
   const { id } = request.params;
   db.deleteFieldState(id)
       .then(result => {
           if (result && result.length > 0) {
               response.json({ message: `Field with ID ${id} deleted successfully.` });
           } else {
               response.status(404).json({ message: `Field with ID ${id} not found for deletion.` });
           }
       })
       .catch(error => {
           console.error(error);
           response.status(500).json({ message: 'Error deleting Fields.' });
       });
});


// Define storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Create unique filename
  }
});

const upload = multer({ storage: storage });

// Make sure you create the 'uploads' directory manually or programmatically if not present
router.route('/facilities').post(upload.single('FieldImage'), (request, response) => {
   // Image file is now stored in 'uploads' folder and available in `request.file`
   const field = { 
       ...request.body, 
       FieldImage: request.file ? request.file.path : null // Save the file path in DB
   };

   db.addFieldState(field)
       .then(result => {
           response.status(201).json(result);
       })
       .catch(error => {
           console.error(error);
           response.status(500).json({ message: 'Error adding Fields' });
       });
});

// Define the path to the 'uploads' folder

module.exports = router;