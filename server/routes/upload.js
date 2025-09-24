const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/File');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Use memory storage to avoid temp file issues
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// ✅ Upload route
router.post('/', verifyToken, upload.single('file'), async (req, res) => {
  try {
    console.log('🔐 Authenticated user ID:', req.user.id);
    console.log('📦 Incoming file:', req.file);

    const file = req.file;
    const userId = req.user.id;

    if (!file) {
      console.log('⚠️ No file received');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${uuidv4()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    console.log('🚀 Uploading to S3 with params:', params);

    const uploadResult = await s3.upload(params).promise();
    console.log('✅ S3 upload result:', uploadResult);

    const newFile = new File({
      filename: file.originalname,
      url: uploadResult.Location,
      size: file.size,
      type: file.mimetype,
      user: userId,
    });

    await newFile.save();
    console.log('📁 File metadata saved to MongoDB');

    res.status(200).json({ message: 'File uploaded successfully', file: newFile });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// 🧾 List all files for the authenticated user (with optional search)
router.get('/', verifyToken, async (req, res) => {
  try {
    const searchQuery = req.query.q || '';
    const regex = new RegExp(searchQuery, 'i'); // case-insensitive match

    const files = await File.find({
      user: req.user.id,
      filename: { $regex: regex },
    }).sort({ createdAt: -1 });

    res.status(200).json({ files });
  } catch (err) {
    console.error('❌ Listing error:', err.message);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// 🧹 Delete a file by ID
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'File not found or unauthorized' });
    }

    const key = file.url.split('/').pop(); // Extract S3 key from URL

    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    }).promise();

    await file.deleteOne();
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('❌ Deletion error:', err.message);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
