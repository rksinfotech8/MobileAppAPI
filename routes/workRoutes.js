const express = require('express');
const router = express.Router();
const Work = require('../controller/workController');


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
    const { id } = request.params;
    Work.getWork(id)
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

module.exports = router;
