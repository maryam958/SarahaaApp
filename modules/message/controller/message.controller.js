import { messageModel } from "../../../DB/models/message.model.js";
import { userModel } from "../../../DB/models/user.model.js";

export const addMessage = async (req, res) => {
  try {
    let { receiverId } = req.params;
    let { text } = req.body;
    let foundedUser = await userModel.findById(receiverId);
    if (foundedUser) {
      let message = new messageModel({ text, receiverId });
      let addedMessage = await message.save();
      res.json({ message: "added", addedMessage });
    } else {
      res.json({ message: "ReceiverId is in-correct" });
    }
  } catch (error) {
    res.json({ error });

  }
};
