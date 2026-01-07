import express from 'express';
import { loginControl, registerControl } from '../controllers/auth.controller.js';

const router = express.Router();
//Register
router.post('/register', registerControl);

//login
router.post('/login', loginControl);

export default router;