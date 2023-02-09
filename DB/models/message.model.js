import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  receiverId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  text: {
    type: String,
    required: true,
  }


},{
timestamps:true
});

export const messageModel=mongoose.model("message",messageSchema)