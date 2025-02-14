var config = require('../config/db');
var sql = require('mssql');


async function getSiteHeadDetails() {
    try {
        let pool = await sql.connect(config);
        let getSiteRecords = await pool.request().query("SELECT * from SiteHead");
        return getSiteRecords.recordset; 
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching SiteHead');
    }
}

async function getSiteHeadDetail(Id) {
    try {
        let pool = await sql.connect(config);
        let getSiteRecords = await pool.request()
        .input('input_parameter', sql.Int, Id)
        .query("SELECT * from SiteHead Where Id = @input_parameter");
        return getSiteRecords.recordset; 
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching SiteHead');
    }
}

async function addSiteHead(user) {
    try {
        let pool = await sql.connect(config);
        let insertSiteHead = await pool.request()
        .input('FirstName', sql.VarChar, user.FirstName)
        .input('LastName', sql.VarChar, user.LastName)
        .input('MobileNumber', sql.NVarChar, user.MobileNumber)
        .input('Field', sql.VarChar, user.Field)
        .input('FieldSiteName', sql.VarChar, user.FieldSiteName)
        .input('Password', sql.VarChar, user.Password)
        .input('ConfirmPassword', sql.VarChar, user.ConfirmPassword)
        .input('Image', sql.VarChar, user.Image)
        .query("INSERT INTO SiteHead (FirstName, LastName, MobileNumber, Field, FieldSiteName, Password, ConfirmPassword, Image) VALUES (@FirstName, @LastName, @MobileNumber, @Field, @FieldSiteName, @Password, @ConfirmPassword, @Image)");
        return insertSiteHead.recordset; 
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching SiteHead');
    }
}

async function updateSiteHead(Id, user) {
    try {
        let pool = await sql.connect(config);
        let updateSiteHead = await pool.request()
            .input('Id', sql.Int, Id)
            .input('FirstName', sql.VarChar, user.FirstName)
            .input('LastName', sql.VarChar, user.LastName)
            .input('MobileNumber', sql.NVarChar, user.MobileNumber)
            .input('Field', sql.VarChar, user.Field)
            .input('FieldSiteName', sql.VarChar, user.FieldSiteName)
            .input('Password', sql.VarChar, user.Password)
            .input('ConfirmPassword', sql.VarChar, user.ConfirmPassword)
            .input('Image', sql.VarChar, user.Image)
            .execute('updateSiteHead');
        return updateSiteHead.recordset; 
    } catch (err) {
        console.log(err);
        throw new Error('Error updating SiteHead');
    }
}

async function deleteSiteHead(Id) {
    try {
        let pool = await sql.connect(config);
        let deleteSiteHead= await pool.request()
            .input('Id', sql.Int, Id)
            .query("DELETE FROM SiteHead WHERE Id = @Id");
        return deleteSiteHead.recordset; 
    } catch (err) {
        console.log(err);
        throw new Error('Error deleting SiteHead');
    }
}

module.exports = {
   getSiteHeadDetails,
   getSiteHeadDetail,
   addSiteHead,
   updateSiteHead,
   deleteSiteHead
}