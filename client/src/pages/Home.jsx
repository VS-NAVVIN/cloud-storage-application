import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  // Optional: redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/upload'); // You can comment this if you want to stay on homepage
  }, []);

  return (
    <div className="home-page">
      <div className="home-left">
        <h1 className="app-title">Cloud Storage App</h1>
        <p className="tagline">Store your data securely. Access it anywhere.</p>
      </div>

      <div className="home-right">
        <Link to="/login">
          <button className="home-btn">Login</button>
        </Link>
        <Link to="/signup">
          <button className="home-btn">Signup</button>
        </Link>
        {/* Removed "Go to Uploads" button */}
      </div>
    </div>
  );
}

export default Home;
