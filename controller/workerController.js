var config = require('../config/db');
var sql = require('mssql');

async function getWorkers() {
    try {
        let pool = await sql.connect(config);
        let workers = await pool.request().query("SELECT * FROM Worker");
        let siteWorkers = workers.recordset.reduce((acc, item) =>{
            let data = item.Work;
            if (!acc[data]) {
                acc[data] = [];
            }
            acc[data].push(item);
            return acc;
        },{});
        return siteWorkers;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching Workers');
    }
}

async function getWorker(Id) {
    try {
        let pool = await sql.connect(config);
        let worker = await pool.request()
            .input('Id', sql.Int, Id)
            .query("SELECT * FROM Worker WHERE Id = @Id");
        return worker.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching Worker');
    }
}

async function addWorker(worker) {
    try {
        let pool = await sql.connect(config);

        let workerResult = await pool.request()
            .input('WorkType', sql.NVarChar, worker.WorkType) // Category should be passed
            .query('SELECT id FROM Work WHERE WorkType = @WorkType');

        if (workerResult.recordset.length === 0) {
            throw new Error('Worker not found');
        }

        let WorkId = workerResult.recordset[0].id;
        

        let insertWorker = await pool.request()
            .input('WorkID', sql.Int, WorkId)
            .input('FirstName', sql.VarChar, worker.FirstName)
            .input('LastName', sql.VarChar, worker.LastName)
            .input('MobileNumber', sql.NVarChar, worker.MobileNumber)
            .input('Work', sql.VarChar, worker.Work)
            .input('WorkType', sql.VarChar, worker.WorkType)
            .input('Image', sql.VarChar, worker.Image)
            .query(`
                DECLARE @InsertedIds TABLE (Id INT);
                INSERT INTO Worker (WorkID, FirstName, LastName, MobileNumber, Work, WorkType, Image)
                OUTPUT INSERTED.Id INTO @InsertedIds
                VALUES (@WorkID, @FirstName, @LastName, @MobileNumber, @Work, @WorkType, @Image)
                SELECT Id FROM @InsertedIds;`);
        return insertWorker.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error adding Worker');
    }
}

async function updateWorker(Id, worker) {
    try {
        let pool = await sql.connect(config);

        let workerResult = await pool.request()
            .input('WorkType', sql.NVarChar, worker.WorkType) // Category should be passed
            .query('SELECT id FROM Work WHERE WorkType = @WorkType');

        if (workerResult.recordset.length === 0) {
            throw new Error('Worker not found');
        }

        let WorkId = workerResult.recordset[0].id;

        let updateWorker = await pool.request()
            .input('Id', sql.Int, Id)
            .input('WorkID', sql.Int, WorkId)
            .input('FirstName', sql.VarChar, worker.FirstName)
            .input('LastName', sql.VarChar, worker.LastName)
            .input('MobileNumber', sql.NVarChar, worker.MobileNumber)
            .input('Work', sql.VarChar, worker.Work)
            .input('WorkType', sql.VarChar, worker.WorkType)
            .input('Image', sql.VarChar, worker.Image)
            .query(`
                DECLARE @InsertedIds TABLE (Id INT);
                UPDATE Worker SET WorkID = @WorkID,
                FirstName = @FirstName, 
                LastName = @LastName, 
                MobileNumber = @MobileNumber, 
                Work = @Work, 
                WorkType = @WorkType,
                Image = @Image
                WHERE Id = @Id
                SELECT Id FROM @InsertedIds;`);
        return updateWorker.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error updating Worker');
    }
}

async function deleteWorker(Id) {
    try {
        let pool = await sql.connect(config);
        let deleteWorker = await pool.request()
            .input('Id', sql.Int, Id)
            .query("DELETE FROM Worker WHERE Id = @Id");
        return deleteWorker.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error deleting Worker');
    }
}

module.exports = {
    getWorkers,
    getWorker,
    addWorker,
    updateWorker,
    deleteWorker
};