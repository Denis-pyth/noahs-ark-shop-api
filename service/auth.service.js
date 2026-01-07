import bcrypt, { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, registerUser } from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();


export async function register({email, password, phone}) {
    const password_hash = bcrypt.hashSync(password, 10);

    return await registerUser({
        email,
        password_hash,
        phone
    });
}

export async function login({email, password}) {
    const user = await findUserByEmail(email);

    if(!user) {
        throw new Error('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if(!isMatch){
        throw new Error('Invalid credentials');
    }
     
    const token = jwt.sign(
        {userId : user.id, isAdmin : user.is_admin},
    
    process.env.JWT_SECRET,
    {expiresIn : '1d'});

    delete user.password_hash;
 
    return { user, token };

   
}