import { userModel } from "../../../DB/models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../services/sendEmail.js";
import { nanoid } from 'nanoid'

export const signUp = async (req, res) => {
  const { userName, email, password, cPassword } = req.body;
  if (password == cPassword) {
    const foundedUser = await userModel.findOne({ email });
    if (foundedUser) {
      res.json({ message: "you are already registered" });
    } else {
      let hashed = await bcryptjs.hash(
        password,
        parseInt(process.env.saltRound)
      );
      let user = new userModel({ userName, email, password: hashed });
      let savedUser = await user.save();
      let token = jwt.sign({ id: savedUser._id }, process.env.JWTEMAILKEY, {
        expiresIn: 60,
      });
      let refreshToken = jwt.sign(
        { id: savedUser._id },
        process.env.JWTEMAILKEY,
        { expiresIn: 60 * 60 }
      );
      console.log(req.protocol);
      let URL = `${req.protocol}://`;
      let message = `<a href="http://localhost:3000/api/v1/auth/confirmEmail/${token}">Please click here to verify your email </a>
      <br>
      <br>
      <a href="http://localhost:3000/api/v1/auth/refreshToken/${refreshToken}">Click here to get new one</a>`;
      sendEmail(email, message);
      res.json({ message: "added successfully", savedUser });
    }
  } else {
    res.json({ message: "password should match cPassword" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const foundedUser = await userModel.findOne({ email });
  if (foundedUser) {
    let matched = await bcryptjs.compare(password, foundedUser.password);
    if (matched) {
      if (foundedUser.confirmEmail) {
        let token = jwt.sign(
          { isLogin: true, id: foundedUser._id },
          process.env.JWTKEY,
          { expiresIn: 60 * 60 }
        );
        res.json({ message: "Welcome", foundedUser, token });
      } else {
        res.json({ message: "Please Confirm your email first" });
      }
    } else {
      res.json({ message: "Password in-correct" });
    }
  } else {
    res.json({ message: "you have to register first or confirm the email" });
  }
};

export const confirmEmail = async (req, res) => {
  let { token } = req.params;
  let decoded = jwt.verify(token, process.env.JWTEMAILKEY);
  if (decoded) {
    console.log(decoded);
    let user = await userModel.findOne({
      _id: decoded.id,
      confirmEmail: false,
    });
    if (user) {
      let updatedUser = await userModel.findByIdAndUpdate(
        decoded.id,
        { confirmEmail: true },
        { new: true }
      );
      res.json({ message: "Updated", updatedUser });
    } else {
      res.json({ message: "You are already Confirmed or Invalid Token" });
    }
  } else {
    res.json({ message: "Invalid Token" });
  }
};

export const refreshToken = async (req, res) => {
  let { token } = req.params;
  let decoded = jwt.verify(token, process.env.JWTEMAILKEY);
  if (!decoded || !decoded.id) {
    res.json({ message: "Invalid token or id" });
  } else {
    let user = await userModel.findById(decoded.id);
    if (!user) {
      res.json({ message: "User didn't register" });
    } else {
      if (user.confirmEmail) {
        res.json({ message: "Already confirmed" });
      } else {
        // Create Refreshed token
        let token = jwt.sign({ id: user._id }, process.env.JWTEMAILKEY);

        let message = `<a href="http://localhost:3000/api/v1/auth/confirmEmail/${token}">This is the second email </a>`;
        sendEmail(user.email, message);
        res.json({ message: "Done, please check your email" });
      }
    }
  }
};

export const sendCode = async (req, res) => {
  let { email } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) {
    res.json({ message: "User didn't register yet" });
  } else {
    // let OTPCode = Math.floor(Math.random() * (1999 - 1940 + 1) + 1940);
    let OTPCode=nanoid()
    console.log(OTPCode);
    await userModel.findByIdAndUpdate(user._id, { OTPCode });
    let message = `your OTPCode is ${OTPCode}`;
    sendEmail(user.email, message);
    res.json({ message: "Done, please check your email" });
  }
};


export const forgetPassword = async (req, res) => {
  try {
    let { OTPCode, email, password } = req.body;
    if (!OTPCode) {
      res.json({ message: "Code is not valid" });
    } else {
      let user = await userModel.findOne({ email, OTPCode });
      if (!user) {
        res.json({ message: "Email or code is not valid" });
      } else {
        const hashedPass = await bcryptjs.hash(
          password,
          parseInt(process.env.saltRound)
        );
        let updated = await userModel.findByIdAndUpdate(
          user._id,
          { OTPCode: null, password: hashedPass },
          { new: true }
        );
        res.json({ message: "Success", updated });
      }
    }
  } catch (error) {
    res.json({ message: "Error", error });
  }
};
