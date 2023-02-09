import { Router } from "express";
import { addMessage } from "./controller/message.controller.js";

const router=Router();


router.get('/',(req,res)=>{
    res.json({message:"Hi message"})
})


router.post('/addMessage/:receiverId',addMessage)

export default router;