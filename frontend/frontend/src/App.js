import React, { useState, useEffect } from 'react';
import './App.css';
import Admin from './Admin';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('feed');

  const fetchPosts = () => {
    setLoading(true);
    fetch('http://localhost:3000/api/posts')
      .then(response => response.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Reddit Content Feed</h1>
        <nav className="nav-buttons">
          <button 
            onClick={() => setView('feed')} 
            className={view === 'feed' ? 'active' : ''}
          >
            Feed
          </button>
          <button 
            onClick={() => setView('admin')} 
            className={view === 'admin' ? 'active' : ''}
          >
            Admin
          </button>
        </nav>
      </header>
      
      {view === 'feed' ? (
        <div className="posts-container">
          {loading ? (
            <h2>Loading posts...</h2>
          ) : (
            <>
              <div className="feed-header">
                <h2>{posts.length} Posts</h2>
                <button onClick={fetchPosts} className="refresh-button">
                  Refresh
                </button>
              </div>
              {posts.map(post => (
                <div key={post.id} className="post-card">
                  <h2>{post.title}</h2>
                  <div className="post-meta">
                    <span>r/{post.subreddit}</span>
                    <span>by u/{post.author}</span>
                    <span>⬆️ {post.upvotes}</span>
                    <span>{post.created}</span>
                  </div>
                  <a href={post.url} target="_blank" rel="noopener noreferrer">
                    View on Reddit →
                  </a>
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <Admin />
      )}
    </div>
  );
}

export default App;