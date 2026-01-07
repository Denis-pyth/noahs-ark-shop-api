import { promoteToAdmin } from "../service/admin.service.js";

export async function makeAdmin(req,res) {
   try{
    const { userId } = req.params;
     const updatedUser = await promoteToAdmin(userId);
    res.status(200).json({
        message : 'user promoted to admin',
        user : updatedUser
    });
   } catch(err){
    res.status(400).json({error: err.message});
   }
   
};