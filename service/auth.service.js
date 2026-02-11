import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { findUserByEmail, registerUser, updateUserPassword, verifyUserEmail } from '../models/user.model.js';
import { generateOTP, storeOTP, verifyOTP } from '../utils/otp.js';
import { sendOTPEmail } from '../utils/email.js';
import { storeSession } from '../utils/sessionutil.js';
import dotenv from 'dotenv';

dotenv.config();

export async function register({email, password, phone, deviceId}) {  
    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }

    const password_hash = bcrypt.hashSync(password, 10);

    const user = await registerUser({
        email,
        password_hash,
        phone
    });

    // Generate OTP for email verification
    const otp = generateOTP();
    await storeOTP({
    userId: user.id,
    deviceId,
    otp,
    type: 'verify_email',
    expiryMinutes: 10
    });


    //Send OTP via email
    try{
    await sendOTPEmail({ email, otp, type: 'verify_email' });
    }catch(error){
         console.error('Email send failed:', error);
    }
    return {
        user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            role: user.role,
            email_verified: user.email_verified
        },
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
    };
}

export async function login({email, password, deviceId}) {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

      if (!deviceId) {
         throw new Error('Device ID required');
    }

    
     if (!user.email_verified) {
        throw new Error('Please verify your email first');
     }
     
    const jti = uuidv4();
    
    await storeSession({
        userId: user.id,
        deviceId,
        jti,
        ttlSeconds: 24 * 60 * 60
    });


    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role,
            jti
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    delete user.password_hash;

    return { user, token };
}

export async function verifyEmail({email, otp, deviceId}) {
    const verification = await verifyOTP({
  userId: user.id,
  deviceId,
  otp,
  type: 'verify_email',
  expiryMinutes: 10
});


    if (!verification.valid) {
        throw new Error(verification.message);
    }

    const user = await verifyUserEmail(email);
    return user;
}


export async function requestPasswordReset({email, deviceId}) {
    const user = await findUserByEmail(email);

    if (!user) {
        // Don't reveal if user exists for security
        return { message: 'If user exists, OTP has been sent' };
    }

    const otp = generateOTP();
    await storeOTP({
    userId: user.id,
    deviceId,
    otp,
    type: 'reset_password',
    expiryMinutes: 15
    });


    //  Send OTP via email
    try{
     await sendOTPEmail({ email, otp, type: 'reset_password' });
    }catch(error){
         console.error('Email send failed:', error);
    }
    return {
        message: 'OTP sent to email',
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
    };
}

export async function resetPassword({email, otp, newPassword, deviceId}) {
    // Verify OTP
    const verification = await verifyOTP({
    userId: user.id,
    deviceId,
    otp,
    type: 'reset_password',
    expiryMinutes: 10
    });


    if (!verification.valid) {
        throw new Error(verification.message);
    }

    // Get user
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }

    // Update password
    const password_hash = bcrypt.hashSync(newPassword, 10);
    const updatedUser = await updateUserPassword(user.id, password_hash);

    return updatedUser;
}

export async function resendOTP({email, type, deviceId}) {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error('User not found');
    }

    // Check type specific conditions
    if (type === 'verify_email' && user.email_verified) {
        throw new Error('Email already verified');
    }

    const otp = generateOTP();
    const expiryMinutes = type === 'reset_password' ? 15 : 10;
    await storeOTP({
    userId: user.id,
    deviceId,
    otp,
    type,
    expiryMinutes: 10
    });


    //  Send OTP via email
    try{
    await sendOTPEmail({ email, otp, type });
    } catch(error){
        console.error('Email send failed:', error);
    }
    return {
        message: 'OTP sent successfully',
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
    };
}