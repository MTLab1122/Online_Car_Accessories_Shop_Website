import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration with secure random filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`);
  }
});

// File filter for images (JPEG, PNG, WebP) and 3D models (GLB, GLTF)
const fileFilter = (req, file, cb) => {
  const allowedImageMimes = ['image/jpeg', 'image/png', 'image/webp'];
  const allowedModelMimes = ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.glb', '.gltf'];

  if (!allowedExtensions.includes(ext)) {
    return cb(new Error(`File format ${ext} is not allowed. Only JPG, PNG, WEBP, and GLB/GLTF files are accepted.`));
  }

  if (allowedImageMimes.includes(file.mimetype) || allowedModelMimes.includes(file.mimetype) || ext === '.glb' || ext === '.gltf') {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported MIME type: ${file.mimetype}`));
  }
};

const maxSize = parseInt(process.env.UPLOAD_MAX_SIZE || '10485760', 10); // 10MB default

export const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter
});

