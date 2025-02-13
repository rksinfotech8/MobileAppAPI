const express = require('express');
const router = express.Router();
const shift =require('../controller/shiftController');


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
    const { id } = request.params;
    shift.getShift(id)
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


module.exports = router;