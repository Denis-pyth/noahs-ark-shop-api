import pool from "../db/db.js";

export async function registerUser({email, phone, password_hash}) {
    const query = `
    INSERT INTO users (email, phone, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, email, phone, password_hash, is_admin, created_at
    `;
    const values = [email, phone, password_hash]
    const { rows } = await pool.query(query, values);
    return rows[0];

}


export async function setAdmin( userid, is_admin = true) {
    const query = `
    UPDATE users
    set is_admin = $1
    where id = $2
    RETURNING id, email, is_admin
    `;
    const values = [userid, is_admin];
    const { rows } = await pool.query(query, values);
    return rows[0];

}


export async function findUserByEmail(email) {
    const query = `
    select  id, email, phone, is_admin, created_at, password_hash
    FROM users
    where email = $1
     `;
    const { rows } = await pool.query(query,[email]);
    return rows[0];
    
}



export async function findUserById(id) {
    const query = `
    select  id, email, phone, is_admin, created_at, password_hash
    FROM users
    where id = $1
     `;
    const { rows } = await pool.query(query,[id]);
    return rows[0];
}

export async function updateUser({password_hash, phone}){
    const query = `
    UPDATE users
    set password_hash = $1, phone = $2
    returning id, email, is_admin, 

    `;
    const values = [password_hash, phone];
    const { rows } = await pool.query(query, values);
    return rows[0];


}
