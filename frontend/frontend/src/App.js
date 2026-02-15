import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from backend when component loads
  useEffect(() => {
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
  }, []);

  if (loading) {
    return <div className="App"><h2>Loading posts...</h2></div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Reddit Content Feed</h1>
      </header>
      
      <div className="posts-container">
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
      </div>
    </div>
  );
}

export default App;