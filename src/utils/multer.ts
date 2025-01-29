// multer.ts in utils
import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "docs/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//     // cb(null, file.originalname);
//   },
// });

const storage=multer.memoryStorage();

const upload = multer({ storage: storage });

export default upload;


