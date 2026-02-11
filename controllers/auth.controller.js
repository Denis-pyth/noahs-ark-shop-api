import { 
    login as loginService, 
    register as registerService,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    resendOTP
} from "../service/auth.service.js";
import { revokeSession } from '../utils/sessionutil.js';


export async function registerControl(req, res) {
    try {
        const { email, phone, password } = req.body;
        const deviceId = req.headers['x-device-id'];

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const data = await registerService({ email, phone, password, deviceId });

        res.status(201).json({
            message: "User successfully created. Please verify your email.",
            user: data.user,
            otp: data.otp // Only in development
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function loginControl(req, res) {
    try {
        const { email, password } = req.body;
        

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const deviceId = req.headers['x-device-id'];
        
        if(!deviceId){
            return res.status(400).json({error:'Device ID required!'});
        }

        const { user, token } = await loginService({ email, password, deviceId });

        res.status(200).json({
            message: "Login successful",
            token,
            user
        });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}

export async function verifyEmailControl(req, res) {
    try {
        const { email, otp } = req.body;
        const deviceId = req.headers['x-device-id'];

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }
        
        if(!deviceId){
            return res.status(400).json({error:'Device ID required!'});
        }


        const user = await verifyEmail({ email, deviceId, otp});

        res.status(200).json({
            message: "Email verified successfully",
            user
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function forgotPasswordControl(req, res) {
    try {
        const { email } = req.body;
        const deviceId = req.headers['x-device-id'];

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        if(!deviceId){
            return res.status(400).json({error:'Device ID required!'});
        }


        const result = await requestPasswordReset({ email, deviceId });

        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function resetPasswordControl(req, res) {
    try {
        const { email, otp, newPassword } = req.body;
        const deviceId = req.headers['x-device-id'];

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ 
                error: 'Email, OTP, and new password are required' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters' 
            });
        }
        
        if(!deviceId){
            return res.status(400).json({error:'Device ID required!'});
        }


        const user = await resetPassword({ email, deviceId, otp, newPassword });

        res.status(200).json({
            message: "Password reset successfully",
            user
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function resendOTPControl(req, res) {
    try {
         const { email, type } = req.body;
         const deviceId = req.headers['x-device-id'];

        if (!email || !type) {
            return res.status(400).json({ error: 'Email and type are required' });
        }

        if (!['verify_email', 'reset_password'].includes(type)) {
            return res.status(400).json({ 
                error: 'Invalid OTP type. Must be verify_email or reset_password' 
            });
        }

        if(!deviceId){
            return res.status(400).json({error:'Device ID required!'});
        }


        const result = await resendOTP({ email, deviceId, type });


        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


export async function logoutControl(req, res){
    try {
        const {userId, jti} = req.auth;
        const deviceId = req.headers['x-device-id'];

        if(!deviceId){
            return res.status(400).json({error:'Device ID required!'});
        }

        await revokeSession({ userId, deviceId});

        res.json({ message: ' Logged out successfully'});
    } catch(err) {
        res.status(500).json({ error: err.message});
    }
}

