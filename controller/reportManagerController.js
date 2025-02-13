var config = require('../config/db');
var sql = require('mssql');

async function getReportManagers() {
    try {
        let pool = await sql.connect(config);
        let reportManagers = await pool.request().query("SELECT * FROM ReportManager");
        return reportManagers.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching Report Managers');
    }
}

async function getReportManager(Id) {
    try {
        let pool = await sql.connect(config);
        let reportManager = await pool.request()
            .input('Id', sql.Int, Id)
            .query("SELECT * FROM ReportManager WHERE Id = @Id");
        return reportManager.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching Report Manager');
    }
}

async function addReportManager(manager) {
    try {
        let pool = await sql.connect(config);
        let insertManager = await pool.request()
            .input('FirstName', sql.VarChar, manager.FirstName)
            .input('LastName', sql.VarChar, manager.LastName)
            .input('MobileNumber', sql.NVarChar, manager.MobileNumber)
            .input('Password', sql.VarChar, manager.Password)
            .input('ConfirmPassword', sql.VarChar, manager.ConfirmPassword)
            .query("INSERT INTO ReportManager (FirstName, LastName, MobileNumber, Password, ConfirmPassword) VALUES (@FirstName, @LastName, @MobileNumber, @Password, @ConfirmPassword)");
        return insertManager.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error adding Report Manager');
    }
}

async function updateReportManager(Id, manager) {
    try {
        let pool = await sql.connect(config);
        let updateManager = await pool.request()
            .input('Id', sql.Int, Id)
            .input('FirstName', sql.VarChar, manager.FirstName)
            .input('LastName', sql.VarChar, manager.LastName)
            .input('MobileNumber', sql.NVarChar, manager.MobileNumber)
            .input('Password', sql.VarChar, manager.Password)
            .input('ConfirmPassword', sql.VarChar, manager.ConfirmPassword)
            .query("UPDATE ReportManager SET FirstName = @FirstName, LastName = @LastName, MobileNumber = @MobileNumber, Password = @Password, ConfirmPassword = @ConfirmPassword WHERE Id = @Id");
        return updateManager.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error updating Report Manager');
    }
}

async function deleteReportManager(Id) {
    try {
        let pool = await sql.connect(config);
        let deleteManager = await pool.request()
            .input('Id', sql.Int, Id)
            .query("DELETE FROM ReportManager WHERE Id = @Id");
        return deleteManager.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error deleting Report Manager');
    }
}

module.exports = {
    getReportManagers,
    getReportManager,
    addReportManager,
    updateReportManager,
    deleteReportManager
};