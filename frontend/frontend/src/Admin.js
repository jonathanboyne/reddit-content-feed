import React, { useState, useEffect } from 'react';
import './Admin.css';

function Admin() {
  const [subreddits, setSubreddits] = useState([]);
  const [newSubreddit, setNewSubreddit] = useState('');
  const [message, setMessage] = useState('');

  // Fetch current subreddits
  useEffect(() => {
    fetchSubreddits();
  }, []);

  const fetchSubreddits = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/subreddits');
      const data = await response.json();
      setSubreddits(data.subreddits);
    } catch (error) {
      console.error('Error fetching subreddits:', error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    
    if (!newSubreddit.trim()) {
      setMessage('Please enter a subreddit name');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/subreddits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subreddit: newSubreddit })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✓ ${data.message}`);
        setNewSubreddit('');
        fetchSubreddits();
      } else {
        setMessage(`✗ ${data.error}`);
      }
    } catch (error) {
      setMessage('✗ Error adding subreddit');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const handleRemove = async (subreddit) => {
    try {
      const response = await fetch(`http://localhost:3000/api/subreddits/${subreddit}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✓ ${data.message}`);
        fetchSubreddits();
      } else {
        setMessage(`✗ ${data.error}`);
      }
    } catch (error) {
      setMessage('✗ Error removing subreddit');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="admin-panel">
      <h2>Manage Subreddits</h2>
      
      {message && <div className="message">{message}</div>}
      
      <form onSubmit={handleAdd} className="add-form">
        <input
          type="text"
          value={newSubreddit}
          onChange={(e) => setNewSubreddit(e.target.value)}
          placeholder="Enter subreddit name (e.g., gaming)"
          className="subreddit-input"
        />
        <button type="submit" className="add-button">Add Subreddit</button>
      </form>

      <div className="subreddit-list">
        <h3>Current Subreddits ({subreddits.length})</h3>
        {subreddits.map(sub => (
          <div key={sub} className="subreddit-item">
            <span>r/{sub}</span>
            <button 
              onClick={() => handleRemove(sub)} 
              className="remove-button"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;