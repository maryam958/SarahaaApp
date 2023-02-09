import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender:{
    type:String,
    default:"Male",
    enums:['Female','Male']
  },

  confirmEmail:{
    type:Boolean,
    default:false

  },
  profilePic:String,
  coverPics:Array,
  lastSeen:Date,
  birthDate:Date,
  OTPCode:String
},{
timestamps:true
});

export const userModel=mongoose.model("user",userSchema)