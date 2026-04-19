const pool = require("./db.js");

async function findOrCreateUser(userId) {
    let result = await pool.query(
        'SELECT * FROM users WHERE user_id = $1',
        [userId]
    );
    
    if (result.rows.length > 0) {
        return result.rows[0];
    }
    
    result = await pool.query(
        'INSERT INTO users (user_id) VALUES ($1) RETURNING *',
        [userId]
    );
    
    return result.rows[0];
}

module.exports = {
    findOrCreateUser
}