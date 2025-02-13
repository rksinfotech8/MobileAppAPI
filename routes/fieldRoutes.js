const express = require('express');
const router = express.Router();
const Fields = require('../controller/fieldController');

// name change => field to facility 

router.route('/facility/all').get((request, response) => {
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

router.route('/facility/:id').get((request, response) => {
    Fields.getField(request.params.id)
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

 router.route('/facility/create').post((request, response) => {
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


router.route('/facility/update/:id').put((request, response) => {
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

router.route('/facility/delete/:id').delete((request, response) => {
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

module.exports = router;