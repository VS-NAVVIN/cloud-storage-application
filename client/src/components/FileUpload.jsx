import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './FileUpload.css';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const fetchFiles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/upload', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data.files);
    } catch (err) {
      toast.error('Error fetching files');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('File uploaded successfully');
      setFile(null);
      await fetchFiles();
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/upload/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('File deleted');
      await fetchFiles();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="upload-container">
      <h2>Upload Your File</h2>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>

      <h3>Your Files</h3>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul className="file-list">
          {files.map((f) => (
            <li key={f._id}>
              <strong>{f.filename}</strong> ({(f.size / 1024).toFixed(1)} KB)
              <br />
              <button onClick={() => handleDownload(f.url)}>Download</button>
              <button onClick={() => handleDelete(f._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileUpload;
