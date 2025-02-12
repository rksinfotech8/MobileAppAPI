const config = require("../config/db");
const sql = require('mssql');

// Get all works
async function getWorks() {
    try {
        let pool = await sql.connect(config);
        let WorkRecords = await pool.request().query("SELECT * FROM Work");
        return WorkRecords.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching works');
    }
}

// Get a single work by Id
async function getWork(Id) {
    try {
        let pool = await sql.connect(config);
        let WorkRecords = await pool.request()
            .input('Id', sql.Int, Id)
            .query("SELECT * FROM Work WHERE Id = @Id");
        return WorkRecords.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching work');
    }
}

// Add a new work
async function addWork(work) {
    try {
        let pool = await sql.connect(config);
        let insertWork = await pool.request()
            .input('WorkType', sql.NVarChar, work.WorkType)
            .query("INSERT INTO Work (WorkType) VALUES (@WorkType)");
        return insertWork.recordset;
    } catch (err) {
        console.log(err);
        throw new Error('Error adding work');
    }
}

// Update an existing work
async function updateWork(Id, work) {
    try {
        let pool = await sql.connect(config);
        let updateWork = await pool.request()
            .input('Id', sql.Int, Id)
            .input('WorkType', sql.NVarChar, work.WorkType)
            .query("UPDATE Work SET WorkType = @WorkType WHERE Id = @Id");
        return updateWork.rowsAffected;
    } catch (err) {
        console.log(err);
        throw new Error('Error updating work');
    }
}

// Delete a work
async function deleteWork(Id) {
    try {
        let pool = await sql.connect(config);
        let deleteWork = await pool.request()
            .input('Id', sql.Int, Id)
            .query("DELETE FROM Work WHERE Id = @Id");
        return deleteWork.rowsAffected;
    } catch (err) {
        console.log(err);
        throw new Error('Error deleting work');
    }
}

module.exports = { getWorks, getWork, addWork, updateWork, deleteWork };
