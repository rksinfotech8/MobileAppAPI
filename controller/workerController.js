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
        let insertWorker = await pool.request()
            .input('FirstName', sql.VarChar, worker.FirstName)
            .input('LastName', sql.VarChar, worker.LastName)
            .input('MobileNumber', sql.NVarChar, worker.MobileNumber)
            .input('Work', sql.VarChar, worker.Work)
            .input('WorkType', sql.VarChar, worker.WorkType)
            .input('Image', sql.VarChar, worker.Image)
            .query("INSERT INTO Worker (FirstName, LastName, MobileNumber, Work, WorkType, Image) VALUES (@FirstName, @LastName, @MobileNumber, @Work, @WorkType, @Image)");
        return insertWorker.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error adding Worker');
    }
}

async function updateWorker(Id, worker) {
    try {
        let pool = await sql.connect(config);
        let updateWorker = await pool.request()
            .input('Id', sql.Int, Id)
            .input('FirstName', sql.VarChar, worker.FirstName)
            .input('LastName', sql.VarChar, worker.LastName)
            .input('MobileNumber', sql.NVarChar, worker.MobileNumber)
            .input('Work', sql.VarChar, worker.Work)
            .input('WorkType', sql.VarChar, worker.WorkType)
            .input('Image', sql.VarChar, worker.Image)
            .query("UPDATE Worker SET FirstName = @FirstName, LastName = @LastName, MobileNumber = @MobileNumber, Work = @Work, WorkType = @WorkType, Image = @Image WHERE Id = @Id");

        if (updateWorker.rowsAffected[0] === 0) {
            throw new Error("No record found with the given Id");
        }

        return { message: "Worker updated successfully" };
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

async function deleteWorker(Id) {
    try {
        let pool = await sql.connect(config);
        let deleteWorker = await pool.request()
            .input('Id', sql.Int, Id)
            .query("DELETE FROM Worker WHERE Id = @Id");

        if (deleteWorker.rowsAffected[0] === 0) {
            throw new Error("No record found with the given Id");
        }

        return { message: "Worker deleted successfully" };
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


module.exports = {
    getWorkers,
    getWorker,
    addWorker,
    updateWorker,
    deleteWorker
};