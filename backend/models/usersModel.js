import { pool } from '../database/connection.js';

const createUser = async (email, passwordHash, role) => {
    const query = {
        text: `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *;`,
        values: [email, passwordHash, role],
    };

    const { rows } = await pool.query(query);
    return rows[0];
};

const getUserByEmail = async (email) => {
    const query = {
        text: `SELECT * FROM users WHERE email = $1;`,
        values: [email],
    };

    const { rows } = await pool.query(query);
    return rows[0];
};

const getAllUsers = async () => {
    const query = {
        text: `SELECT * FROM users ORDER BY id;`,
        values: [],
    };

    const { rows } = await pool.query(query);
    return rows;
};

export { createUser, getUserByEmail, getAllUsers };
