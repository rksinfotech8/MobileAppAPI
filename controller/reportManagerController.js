var config = require('../config/db');
var sql = require('mssql');

async function getReportManagers() {
    try {
        let pool = await sql.connect(config);
        let reportManagers = await pool.request().query("SELECT * FROM ReportManager");
        let report = reportManagers.recordset.reduce((acc, item) =>{
            let data = "ReportManagers";
            if (!acc[data]) {
                acc[data] = [];
            }
            acc[data].push(item);
            return acc;
        },{});
        return report; 
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
            .input('Image', sql.VarChar, manager.Image)
            .query("INSERT INTO ReportManager (FirstName, LastName, MobileNumber, Password, ConfirmPassword, Image) VALUES (@FirstName, @LastName, @MobileNumber, @Password, @ConfirmPassword, @Image)");
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
            .input('Image', sql.VarChar, manager.Image)
            .query("UPDATE ReportManager SET FirstName = @FirstName, LastName = @LastName, MobileNumber = @MobileNumber, Password = @Password, ConfirmPassword = @ConfirmPassword, Image = @Image WHERE Id = @Id");

        if (updateManager.rowsAffected[0] === 0) {
            throw new Error("No record found with the given Id");
        }

        return { message: "Report Manager updated successfully" };
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


async function deleteReportManager(Id) {
    try {
        let pool = await sql.connect(config);
        let deleteManager = await pool.request()
            .input('Id', sql.Int, Id)
            .query("DELETE FROM ReportManager WHERE Id = @Id");

        if (deleteManager.rowsAffected[0] === 0) {
            throw new Error("No record found with the given Id");
        }

        return { message: "Report Manager deleted successfully" };
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


module.exports = {
    getReportManagers,
    getReportManager,
    addReportManager,
    updateReportManager,
    deleteReportManager
};