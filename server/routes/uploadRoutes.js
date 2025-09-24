const express = require('express');
const upload = require('../middleware/multerConfig');
const auth = require('../middleware/authMiddleware');
const { uploadFile, getFiles, downloadFile } = require('../controllers/uploadControllers');

const router = express.Router();

router.post('/upload', auth, upload.single('file'), uploadFile);
router.get('/files', auth, getFiles);
router.get('/download/:key', auth, downloadFile);

module.exports = router;
