import multer from 'multer'

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB — applies to any file type
});

export default upload;