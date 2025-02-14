var config = require('../config/db');
var sql = require('mssql');


async function getUserDetails() {
    try {
        let pool = await sql.connect(config);
        let AddUserRecords = await pool.request().query("SELECT * from AddUser");
        return AddUserRecords.recordset; 
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching User');
    }
}

async function getUserDetail(Id) {
    try {
        let pool = await sql.connect(config);
        let AddUserRecords = await pool.request()
        .input('input_parameter', sql.Int, Id)
        .query("SELECT * from AddUser Where Id = @input_parameter");
        return AddUserRecords.recordset; 
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching User');
    }
}

async function addUserDetails(user) {
    try {
        let pool = await sql.connect(config);
        let insertUser = await pool.request()
        .input('FirstName', sql.VarChar, user.FirstName)
        .input('LastName', sql.VarChar, user.LastName)
        .input('MobileNumber', sql.NVarChar, user.MobileNumber)
        .input('Field', sql.VarChar, user.Field)
        .input('FieldSiteName', sql.VarChar, user.FieldSiteName)
        .input('Password', sql.VarChar, user.Password)
        .input('ConfirmPassword', sql.VarChar, user.ConfirmPassword)
        .query("INSERT INTO AddUser (FirstName, LastName, MobileNumber, Field, FieldSiteName, Password, ConfirmPassword) VALUES (@FirstName, @LastName, @MobileNumber, @Field, @FieldSiteName, @Password, @ConfirmPassword)");
        return insertUser.recordset; 
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching User');
    }
}

async function updateUserDetails(Id, user) {
    try {
        let pool = await sql.connect(config);
        let updateUser = await pool.request()
            .input('Id', sql.Int, Id)
            .input('FirstName', sql.VarChar, user.FirstName)
            .input('LastName', sql.VarChar, user.LastName)
            .input('MobileNumber', sql.NVarChar, user.MobileNumber)
            .input('Field', sql.VarChar, user.Field)
            .input('FieldSiteName', sql.VarChar, user.FieldSiteName)
            .input('Password', sql.VarChar, user.Password)
            .input('ConfirmPassword', sql.VarChar, user.ConfirmPassword)
            .execute('updateUser');
        return updateUser.recordset; 
    } catch (err) {
        console.log(err);
        throw new Error('Error updating Users');
    }
}

async function deleteUserDetails(Id) {
    try {
        let pool = await sql.connect(config);
        let deleteUser= await pool.request()
            .input('Id', sql.Int, Id)
            .query("DELETE FROM AddUser WHERE Id = @Id");
        return deleteUser.recordset; 
    } catch (err) {
        console.log(err);
        throw new Error('Error deleting User');
    }
}

module.exports = {
    getUserDetails, 
    getUserDetail, 
    addUserDetails, 
    updateUserDetails, 
    deleteUserDetails
}