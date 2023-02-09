import { messageModel } from "../../../DB/models/message.model.js";
import { userModel } from "../../../DB/models/user.model.js";
import bcryptjs from "bcryptjs";

export const getInfo = async (req, res) => {
  let userMessages = await messageModel.find({ receiverId: req.user._id });
  res.json({ message: "user", userMessages });
};

export const updatePassword = async (req, res) => {
  let { currentPassword, newPassword, newCPassword } = req.body;
  if (newPassword == newCPassword) {
    let user = await userModel.findById(req.user._id);
    let matched = await bcryptjs.compare(currentPassword, user.password);
    if (matched) {
      let hashedPass = await bcryptjs.hash(
        newPassword,
        parseInt(process.env.saltRound)
      );
      let updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        { password: hashedPass },
        { new: true }
      );
      res.json({ message: "Updated", updatedUser });
    } else {
      res.json({ message: "currentPassword Invalid" });
    }
  } else {
    res.json({ message: "newPassword must equal newCPassword" });
  }
};

export const profilePic = async (req, res) => {
  console.log(req.file);

  if (!req.file) {
    res.json({ message: "Please upload image" });
  } else {
    let uploadedPic = await userModel.updateOne(
      { _id: req.user._id },
      { profilePic: req.file.path }
    );
    res.json({ message: "Done", uploadedPic });
  }
};

export const coverPic = async (req, res) => {
  console.log(req.files);
  if (!req.files) {
    res.json({ message: "Please upload images" });
  } else {
    let imgUrls = [];
    req.files.forEach((file) => {
      imgUrls.push(file.path);
    });
    let coverPics = await userModel.updateOne(
      { _id: req.user._id },
      { coverPics: imgUrls },
      { new: true }
    );
    res.json({ message: "Done", coverPics });
  }
};
