import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';
import { toast } from 'react-toastify';
import './Upload.css';

function Upload() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const token = localStorage.getItem('token');

  const fetchUserFiles = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/upload', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const incoming = Array.isArray(res.data) ? res.data : res.data.files;
      setFiles(incoming);
    } catch (err) {
      toast.error('Error fetching files');
      console.error('Fetch error:', err.response?.data || err.message);
    }
  }, [token]);

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
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });

      setFile(null);
      setProgress(0);

      setTimeout(async () => {
        try {
          await fetchUserFiles();
          toast.success('File uploaded successfully');
        } catch {
          toast.error('Upload succeeded, but failed to fetch files');
        }
      }, 500);
    } catch (err) {
      toast.error('Upload failed');
      setProgress(0);
      console.error('Upload error:', err.response?.data || err.message);
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
      fetchUserFiles();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(files, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-files.json';
    a.click();
  };

  const getIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('audio')) return '🎵';
    if (type.includes('video')) return '🎬';
    if (type.includes('zip') || type.includes('rar')) return '🗜️';
    if (type.includes('text') || type.includes('plain')) return '📑';
    return '📁';
  };

  useEffect(() => {
    fetchUserFiles();
  }, [fetchUserFiles]);

  return (
    <div className="upload-wrapper">
      <div className="top-bar">
        <h1 className="app-title">Cloud Storage App</h1>
        <LogoutButton />
      </div>

      <div className="upload-content">
        <div className="file-list-panel">
          <h2>Your Files</h2>
          {files.length === 0 ? (
            <p>No files uploaded yet.</p>
          ) : (
            <ul className="file-list">
              {files.map((f) => {
                const filename = f.file?.filename || f.filename || 'Unnamed';
                const uploadedDate =
                  f.uploadedAt && !isNaN(Date.parse(f.uploadedAt))
                    ? new Date(f.uploadedAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : 'Unknown';

                console.log('File:', filename, 'UploadedAt:', f.uploadedAt);

                return (
                  <li key={f._id}>
                    <strong>{getIcon(f.type)} {filename}</strong> ({(f.size / 1024).toFixed(1)} KB, {f.type})
                    <br />
                    <small>Uploaded on: {uploadedDate}</small>
                    <br />
                    <button className="download-btn" onClick={() => handleDownload(f.url)}>Download</button>
                    <button className="delete-btn" onClick={() => handleDelete(f._id)}>Delete</button>
                  </li>
                );
              })}
            </ul>
          )}
          {files.length > 0 && (
            <button className="export-btn" onClick={handleExport}>Export Metadata</button>
          )}
        </div>

        <div className="upload-panel">
          <h2>Upload Center</h2>
          <p>Upload your files securely to the cloud.</p>

          <input
            key={file ? file.name : 'empty'}
            type="file"
            name="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button className="upload-btn" onClick={handleUpload}>Upload</button>

          {progress > 0 && progress < 100 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}>
                {progress}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;
