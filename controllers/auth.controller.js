import { login, register } from "../service/auth.service.js";

export async function registerControl(req, res) {
    try{
        const { email, phone, password } = req.body;

        const data = await register({email, phone, password});

        res.status(201).json({
            message: "user successfully created",
            data
        })
    } catch (err) {
        res.status(500).json({error: err.message});
    }
    
}

export async function loginControl(req, res) {
    try{
        const { email, password } = req.body;

        const user = await login({email, password});

        res.status(200).json({
            message : "login successful ",
            user
        })
    } catch (err) {
        res.status(500).json({error: err.message});
       
    }
     
}



