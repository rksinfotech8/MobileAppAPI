const config = require("../config/db");
const sql = require('mssql');

// Get all fields
async function getFields() {
    try {
        let pool = await sql.connect(config);
        let FieldRecords = await pool.request().query("SELECT * from Fields");
        return FieldRecords.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching fields');
    }
}

// Get a single field by Id
async function getField(Id) {
    try {
        let pool = await sql.connect(config);
        let FieldRecords = await pool.request()
            .input('input_parameter', sql.Int, Id)
            .query("SELECT * from Fields WHERE Id = @input_parameter");
        return FieldRecords.recordset;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching field');
    }
}

// Add a new field
async function addField(field) {
    try {
        let pool = await sql.connect(config);
        let insertField = await pool.request()
            .input('FieldName', sql.NVarChar, field.FieldName)
            .execute('insertField');
        return insertField.recordset;
    } catch (err) {
        console.log(err);
        throw new Error('Error adding field');
    }
}

// Update an existing field
async function updateField(Id, field) {
    try {
        let pool = await sql.connect(config);
        let updateField = await pool.request()
            .input('Id', sql.Int, Id)
            .input('FieldName', sql.NVarChar, field.FieldName)
            .query("UPDATE Fields SET FieldName = @FieldName WHERE Id = @Id");
        return updateField.rowsAffected; 
    } catch (err) {
        console.log(err);
        throw new Error('Error updating field');
    }
}

// Delete a field
async function deleteField(Id) {
    try {
        let pool = await sql.connect(config);
        let deleteField = await pool.request()
            .input('Id', sql.Int, Id)
            .query("DELETE FROM Fields WHERE Id = @Id");
        return deleteField.rowsAffected;
    } catch (err) {
        console.log(err);
        throw new Error('Error deleting field');
    }
}

module.exports = { getFields, getField, addField, updateField, deleteField };
