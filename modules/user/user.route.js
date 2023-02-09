import { Router } from "express";
import {userModel} from '../../DB/models/user.model.js'
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import {  myMulter, validationType } from "../../services/multer.js";
import { getInfo,updatePassword,profilePic,coverPic} from "./controller/user.controller.js";
import { updatePasswordSchema } from "./user.validation.js";

const router=Router();


router.get('/getInfo',auth(),getInfo)
router.patch("/updatePassword",auth(),validation(updatePasswordSchema),updatePassword)
router.get('/profilePic',auth(),myMulter(validationType.image,"user/profile").single("image"),profilePic)
router.get('/coverPic',auth(),myMulter(validationType.image,"user/profile").array('image',5),coverPic)



export default router;