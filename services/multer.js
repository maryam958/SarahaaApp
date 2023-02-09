import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const _dirname = path.dirname(fileURLToPath(import.meta.url));

export const validationType = {
  image: ["image/png", "image/jpg", "image/jpeg"],
  pdf: "application/pdf",
};

export const HM=(err, req, res, next)=>{
  if (err) {
    res.json({ message: "multer error", err });
  } else {
    next();
  }
}


export function myMulter(acceptType, customPath) {
  if (!customPath) {
    customPath = "general";
  }

  const fullPath = path.join(_dirname,`../uploads/${customPath}`);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath,{recursive:true});
  }

  
  //make disc storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${customPath}`);
    },
    filename: function (req, file, cb) {
      cb(null, nanoid() + "_" + file.originalname);
    },
  });

  //check the type of the file by filter
  function fileFilter(req, file, cb) {
    if (acceptType.includes(file.mimetype)) {
      //Accepted
      cb(null, true);
    } else {
      req.imageError = true;
      cb('Invalid', false);
    }
  }

  //take disc storage with path and myMulter() will be middleware checking images uploaded or not
  const uploads = multer({
  
    dest: fullPath,
    fileFilter,
      storage,
  });
  return uploads;
}
