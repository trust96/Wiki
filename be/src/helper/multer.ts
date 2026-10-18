import multer, { diskStorage } from "multer";

const multerUpload = multer({
  storage: diskStorage({}),
});

export default multerUpload;
