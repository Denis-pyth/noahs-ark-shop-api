import express from 'express';
import { 
    registerControl, 
    loginControl, 
    verifyEmailControl,
    forgotPasswordControl,
    resetPasswordControl,
    resendOTPControl,
    logoutControl
} from '../controllers/auth.controller.js';


const router = express.Router();

router.post('/register', registerControl);
router.post('/login', loginControl);
router.post('/verify-email', verifyEmailControl);
router.post('/forgot-password', forgotPasswordControl);
router.post('/reset-password', resetPasswordControl);
router.post('/otp/resend', resendOTPControl);
router.post('/logout', logoutControl);

export default router;