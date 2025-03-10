var config = require('../config/db');
const sql = require('mssql');

// name change => fieldstate to facilities 
async function getFieldStates() {
    try {
        let pool = await sql.connect(config);
        let FieldNameRecords = await pool.request().query("SELECT * from FieldName");
        let facilities = FieldNameRecords.recordset.reduce((acc, item) =>{
            let data = "facilities";
            if (!acc[data]) {
                acc[data] = [];
            }
            acc[data].push(item);
            return acc;
        },{});
        return facilities;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching Fields');
    }
}

async function getFieldState(Id) {
    try {
        let pool = await sql.connect(config);
        let FieldNameRecords = await pool.request()
            .input('input_parameter', sql.Int, Id)
            .query("SELECT * from FieldName WHERE Id = @input_parameter");
        return FieldNameRecords.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching Fields');
    }
}

async function addFieldState(field) {
    try {
        let pool = await sql.connect(config);

        // Get FieldID based on the category (e.g., Hospital, School, Auditorium)
        let fieldResult = await pool.request()
            .input('FieldName', sql.NVarChar, field.Category) // Category should be passed
            .query('SELECT id FROM Fields WHERE FieldName = @FieldName');

        if (fieldResult.recordset.length === 0) {
            throw new Error('Field category not found');
        }

        let fieldID = fieldResult.recordset[0].id; // Extract ID

        // Insert into FieldName table
        let insertFieldName = await pool.request()
            .input('FieldID', sql.Int, fieldID) // Foreign key
            .input('FieldName', sql.NVarChar, field.FieldName)
            .input('Latitude', sql.Decimal(10, 8), field.Latitude)
            .input('Longitude', sql.Decimal(11, 8), field.Longitude)
            .input('Proximity', sql.Float, field.Proximity)
            .input('HeadName', sql.NVarChar, field.HeadName)
            .input('MobileNumber', sql.VarChar(15), field.MobileNumber)
            .input('FieldImage', sql.VarChar, field.FieldImage)
            .execute('insertFieldName');

        return insertFieldName.recordset;
    } catch (err) {
        console.error(err);
        throw new Error('Error adding Fields');
    }
}


async function updateFieldState(Id, field) {
    try {
        let pool = await sql.connect(config);

        // Get FieldID based on the category (e.g., Hospital, School, Auditorium)
        let fieldResult = await pool.request()
            .input('FieldName', sql.NVarChar, field.Category) // Category should be passed
            .query('SELECT id FROM Fields WHERE FieldName = @FieldName');

        if (fieldResult.recordset.length === 0) {
            throw new Error('Field category not found');
        }

        let fieldID = fieldResult.recordset[0].id; // Extract ID

        // Update the FieldName table
        let updateFieldName = await pool.request()
            .input('Id', sql.Int, Id)
            .input('FieldID', sql.Int, fieldID) // Foreign key
            .input('FieldName', sql.NVarChar, field.FieldName)
            .input('Latitude', sql.Decimal(10, 8), field.Latitude)
            .input('Longitude', sql.Decimal(11, 8), field.Longitude)
            .input('Proximity', sql.Float, field.Proximity)
            .input('HeadName', sql.NVarChar, field.HeadName)
            .input('MobileNumber', sql.VarChar(15), field.MobileNumber)
            .input('FieldImage', sql.VarChar, field.FieldImage)
            .execute('updateFieldName');

        return updateFieldName.recordset;
    } catch (err) {
        console.error(err);
        throw new Error('Error updating Fields');
    }
}


async function deleteFieldState(Id) {
    try {
        let pool = await sql.connect(config);
        let deleteFieldName= await pool.request()
            .input('Id', sql.Int, Id)
            .execute('deleteFieldName');
        return deleteFieldName.recordset; 
    } catch (err) {
        console.log(err);
        throw new Error('Error deleting Fields');
    }
}

module.exports = {
    getFieldStates,
    getFieldState,
    addFieldState,
    updateFieldState,
    deleteFieldState
};
