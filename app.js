const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const multer = require('multer');
const path = require('path');
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/userRoutes");
const fs = require('fs');
const db = require('./controller/fieldStateController');
const Fields = require('./controller/fieldController');
const Work = require('./controller/workController');
const shift =require('./controller/shiftController');
var router = express.Router();
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use('/api', router);
app.use('/uploads', express.static('uploads'));



router.use((request,response,next)=>{
  console.log('middleware');
  next();
})


router.route('/field/all').get((request, response) => {
    Fields.getFields()
        .then(result => {
            if (result && result.length > 0) {
                response.json(result);
            } else {
                response.status(404).json({ message: 'No Fields found.' });
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ message: 'Error fetching fields.' });
        });
 });


router.route('/field/:id').get((request, response) => {
    Fields.getField()
        .then(result => {
            if (result && result.length > 0) {
                response.json(result[0]);
            } else {
                response.status(404).json({ message: 'No Fields found.' });
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ message: 'Error fetching fields.' });
        });
 });

 router.route('/field/create').post((request, response) => {
    const field = { ...request.body };
    Fields.addField(field)
        .then(result => {
            response.status(201).json(result);
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ message: 'Error adding fields.' });
        });
 });


 router.route('/field/update/:id').put((request, response) => {
    const field = { ...request.body };
    Fields.updateField(request.params.id, field)
        .then(result => {
            if (result > 0) {
                response.json({ message: 'Field updated successfully.' });
            } else {
                response.status(404).json({ message: 'Field not found.' });
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ message: 'Error updating field.' });
        });
});

router.route('/field/delete/:id').delete((request, response) => {
    Fields.deleteField(request.params.id)
        .then(result => {
            if (result > 0) {
                response.json({ message: 'Field deleted successfully.' });
            } else {
                response.status(404).json({ message: 'Field not found.' });
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ message: 'Error deleting field.' });
        });
});


router.route('/fieldName/all').get((request, response) => {
   db.getFieldStates()
       .then(result => {
           if (result && result.length > 0) {
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

// Get a single hospital by ID
router.route('/fieldName/:id').get((request, response) => {
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

// Add a new hospital
router.route('/fieldName/create').post((request, response) => {
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

// Update an existing hospital
router.route('/fieldName/update/:id').put((request, response) => {
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

// Delete a hospital
router.route('/fieldName/delete/:id').delete((request, response) => {
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
router.route('/fieldName').post(upload.single('FieldImage'), (request, response) => {
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
const uploadsDir = path.join(__dirname, 'uploads');

// Check if the 'uploads' folder exists
if (!fs.existsSync(uploadsDir)) {
    // If it doesn't exist, create the folder
    fs.mkdirSync(uploadsDir);
}


    



router.route('/work/all').get((request, response)=>{
    Work.getWorks()
        .then(result => {
            if (result && result.length > 0) {
                response.json(result);
            } else {
                response.status(404).json({ message: 'No Works found.' });
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ message: 'Error fetching Works.' });
        });
 });


router.route('/work/:id').get((request, response) => {
    Work.getWork()
        .then(result => {
            if (result && result.length > 0) {
                response.json(result[0]);
            } else {
                response.status(404).json({ message: 'No Works found.' });
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ message: 'Error fetching Works.' });
        });
 });

 router.route('/work/create').post((request, response) => {
    const work = { ...request.body };
    Work.addWork(work)
        .then(result => {
            response.status(201).json(result);
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ message: 'Error adding Works.' });
        });
 });


 router.route('/work/update/:id').put((request, response) => {
    const work = { ...request.body };
    Work.updateWork(request.params.id, work)
        .then(result => {
            if (result > 0) {
                response.json({ message: 'work updated successfully.' });
            } else {
                response.status(404).json({ message: 'work not found.' });
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ message: 'Error updating work.' });
        });
});

router.route('/work/delete/:id').delete((request, response) => {
    Work.deleteWork(request.params.id)
        .then(result => {
            if (result > 0) {
                response.json({ message: 'work deleted successfully.' });
            } else {
                response.status(404).json({ message: 'work not found.' });
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ message: 'Error deleting work.' });
        });
});



router.route('/shift/all').get((request, response)=>{
    shift.getShifts()
        .then(result => {
            if (result && result.length > 0) {
                response.json(result);
            } else {
                response.status(404).json({ message: 'No shifts found.' });
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ message: 'Error fetching shifts.' });
        });
 });


router.route('/shift/:id').get((request, response) => {
    shift.getShift()
        .then(result => {
            if (result && result.length > 0) {
                response.json(result[0]);
            } else {
                response.status(404).json({ message: 'No shifts found.' });
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ message: 'Error fetching shifts.' });
        });
 });

 router.route('/shift/create').post((request, response) => {
    const shifts = { ...request.body };
    shift.addShift(shifts)
        .then(result => {
            response.status(201).json(result);
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ message: 'Error adding shifts.' });
        });
 });


 router.route('/shift/update/:id').put((request, response) => {
    const shifts = { ...request.body };
    shift.updateShift(request.params.id, shifts)
        .then(result => {
            if (result > 0) {
                response.json({ message: 'shifts updated successfully.' });
            } else {
                response.status(404).json({ message: 'shifts not found.' });
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ message: 'Error updating shifts.' });
        });
});

router.route('/shift/delete/:id').delete((request, response) => {
    shift.deleteShift(request.params.id)
        .then(result => {
            if (result > 0) {
                response.json({ message: 'shifts deleted successfully.' });
            } else {
                response.status(404).json({ message: 'shifts not found.' });
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ message: 'Error deleting shifts.' });
        });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = router;