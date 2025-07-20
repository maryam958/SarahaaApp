import jwt from 'jsonwebtoken';
import { userModel } from '../DB/models/user.model.js';


export const auth=()=>{
    return async(req,res,next)=>{
        let {authorization}=req.headers
        if(authorization && authorization.startsWith('Bearer')){
            let token =authorization.split(" ")[1];
            let verified=jwt.verify(token,process.env.JWTKEY);
            if (verified){
                let user=await userModel.findById(verified.id)
                if(user){
                    req.user=user;
                    next();
                }else{
                res.json({message:"User Not Found"})

                }
            }
            else{
                res.json({message:"Invalid token"})
            }
        }else{
            res.json({message:"Invalid token or not send"})

        }
    }
}