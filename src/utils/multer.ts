// multer.ts in utils
import multer from "multer";
// import fs from "fs";
// import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "docs/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
    // cb(null, file.originalname);
  },
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const dir = path.join(__dirname, "../docs");
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
const upload = multer({ storage: storage });

export default upload;
