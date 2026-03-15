import multer from "multer";

// Store files in memory so we can push the buffer directly to S3
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;

