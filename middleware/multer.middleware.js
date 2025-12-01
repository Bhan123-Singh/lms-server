import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
   destination: (_req, _file, cb) => {
    cb(null, "/tmp");
}});;

const upload = multer({
  storage, // no uploads/ folder
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".webp" &&
      ext !== ".png" &&
      ext !== ".mp4"
    ) {
      cb(new Error(`Unsupported file type! ${ext}`), false);
      return;
    }
    cb(null, true);
  },
});

export default upload;
