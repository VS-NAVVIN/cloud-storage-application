const s3 = require('../config/s3');
const FileMeta = require('../models/FileMeta');

exports.uploadFile = async (req, res) => {
  const file = req.file;
  const userId = req.user.id;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${userId}/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const s3Response = await s3.upload(params).promise();

  const newFile = new FileMeta({
    filename: file.originalname,
    s3Key: s3Response.Key,
    owner: userId,
  });

  await newFile.save();
  res.json({ message: 'File uploaded', file: newFile });
};

exports.getFiles = async (req, res) => {
  const files = await FileMeta.find({ owner: req.user.id });
  res.json(files);
};

exports.downloadFile = async (req, res) => {
  const file = await FileMeta.findOne({ s3Key: req.params.key, owner: req.user.id });
  if (!file) return res.status(404).json({ message: 'File not found' });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.s3Key,
  };

  const url = s3.getSignedUrl('getObject', params);
  res.json({ url });
};
