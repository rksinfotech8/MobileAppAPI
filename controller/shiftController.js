const config = require("../config/db");
const sql = require('mssql');

// Get all shifts
async function getShifts() {
    try {
        let pool = await sql.connect(config);
        let shiftRecords = await pool.request().query("SELECT * FROM Shift");
        let shift = shiftRecords.recordset.reduce((acc, item) =>{
            let data = item.WorkType;
            if (!acc[data]) {
                acc[data] = [];
            }
            acc[data].push(item);
            return acc;
        },{});
        return shift; 
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching shifts');
    }
}

// Get a single shift by Id
async function getShift(Id) {
    try {
        let pool = await sql.connect(config);
        let shiftRecords = await pool.request()
            .input('Id', sql.Int, Id)
            .query("SELECT * FROM Shift WHERE Id = @Id");
        return shiftRecords.recordset;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching shift');
    }
}

// Add a new shift
async function addShift(shift) {
    try {
        console.log("Received Shift Data:", shift); 

        if (!/^\d{2}:\d{2}:\d{2}$/.test(shift.ShiftFrom) || !/^\d{2}:\d{2}:\d{2}$/.test(shift.ShiftTo)) {
            throw new Error("Invalid time format. Use 'HH:MM:SS'");
        }

        let pool = await sql.connect(config);
        let insertShift = await pool.request()
            .input('WorkType', sql.NVarChar, shift.WorkType)
            .input('Shift', sql.NVarChar, shift.Shift)
            .input('ShiftName', sql.NVarChar, shift.ShiftName)
            .input('ShiftFrom', sql.VarChar, shift.ShiftFrom) 
            .input('ShiftTo', sql.VarChar, shift.ShiftTo) 
            .query(`
                INSERT INTO Shift (WorkType, Shift, ShiftName, ShiftFrom, ShiftTo)
                VALUES (@WorkType, @Shift, @ShiftName, @ShiftFrom, @ShiftTo)
            `);

        return insertShift.recordset[0]; 
    } catch (err) {
        console.error("Database Error:", err);
        throw new Error('Error adding shift.');
    }
}

// Update an existing shift
async function updateShift(Id, shift) {
    try {
        console.log("Updating Shift Data:", shift); 

        if (!/^\d{2}:\d{2}:\d{2}$/.test(shift.ShiftFrom) || !/^\d{2}:\d{2}:\d{2}$/.test(shift.ShiftTo)) {
            throw new Error("Invalid time format. Use 'HH:MM:SS'");
        }

        let pool = await sql.connect(config);
        let updateShift = await pool.request()
            .input('Id', sql.Int, Id)
            .input('WorkType', sql.NVarChar, shift.WorkType)
            .input('Shift', sql.NVarChar, shift.Shift)
            .input('ShiftName', sql.NVarChar, shift.ShiftName)
            .input('ShiftFrom', sql.VarChar, shift.ShiftFrom)
            .input('ShiftTo', sql.VarChar, shift.ShiftTo)
            .query(`
                UPDATE Shift
                SET WorkType = @WorkType, Shift=@Shift, ShiftName = @ShiftName, ShiftFrom = @ShiftFrom, ShiftTo = @ShiftTo
                WHERE Id = @Id
            `);

        return updateShift.rowsAffected[0] > 0; 
    } catch (err) {
        console.error(err);
        throw new Error('Error updating shift');
    }
}

// Delete a shift
async function deleteShift(Id) {
    try {
        let pool = await sql.connect(config);
        let deleteShift = await pool.request()
            .input('Id', sql.Int, Id)
            .query("DELETE FROM Shift WHERE Id = @Id");
        return deleteShift.rowsAffected[0] > 0; 
    } catch (err) {
        console.error(err);
        throw new Error('Error deleting shift');
    }
}

module.exports = { getShifts, getShift, addShift, updateShift, deleteShift };
