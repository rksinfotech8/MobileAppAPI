var config = require('../config/db');
var sql = require('mssql');

async function getContractors() {
    try {
        let pool = await sql.connect(config);
        let contractors = await pool.request().query("SELECT * FROM Contractor");
        return contractors.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching Contractors');
    }
}

async function getContractor(Id) {
    try {
        let pool = await sql.connect(config);
        let contractor = await pool.request()
            .input('Id', sql.Int, Id)
            .query("SELECT * FROM Contractor WHERE Id = @Id");
        return contractor.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching Contractor');
    }
}

async function addContractor(contractor) {
    try {
        let pool = await sql.connect(config);
        let insertContractor = await pool.request()
            .input('FirstName', sql.VarChar, contractor.FirstName)
            .input('LastName', sql.VarChar, contractor.LastName)
            .input('MobileNumber', sql.NVarChar, contractor.MobileNumber)
            .input('Password', sql.VarChar, contractor.Password)
            .input('ConfirmPassword', sql.VarChar, contractor.ConfirmPassword)
            .query("INSERT INTO Contractor (FirstName, LastName, MobileNumber, Password, ConfirmPassword) VALUES (@FirstName, @LastName, @MobileNumber, @Password, @ConfirmPassword)");
        return insertContractor.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error adding Contractor');
    }
}

async function updateContractor(Id, contractor) {
    try {
        let pool = await sql.connect(config);
        let updateContractor = await pool.request()
            .input('Id', sql.Int, Id)
            .input('FirstName', sql.VarChar, contractor.FirstName)
            .input('LastName', sql.VarChar, contractor.LastName)
            .input('MobileNumber', sql.NVarChar, contractor.MobileNumber)
            .input('Password', sql.VarChar, contractor.Password)
            .input('ConfirmPassword', sql.VarChar, contractor.ConfirmPassword)
            .query("UPDATE Contractor SET FirstName = @FirstName, LastName = @LastName, MobileNumber = @MobileNumber, Password = @Password, ConfirmPassword = @ConfirmPassword WHERE Id = @Id");
        return updateContractor.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error updating Contractor');
    }
}

async function deleteContractor(Id) {
    try {
        let pool = await sql.connect(config);
        let deleteContractor = await pool.request()
            .input('Id', sql.Int, Id)
            .query("DELETE FROM Contractor WHERE Id = @Id");
        return deleteContractor.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error deleting Contractor');
    }
}

module.exports = {
    getContractors,
    getContractor,
    addContractor,
    updateContractor,
    deleteContractor
};