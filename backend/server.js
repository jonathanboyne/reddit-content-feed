const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Store subreddits in memory (starts with defaults)
let subreddits = ['music', 'nba', 'technology'];

// Function to fetch posts from Reddit JSON API
async function fetchRedditPosts() {
  const allPosts = [];
  
  for (const subreddit of subreddits) {
    try {
      const response = await axios.get(`https://old.reddit.com/r/${subreddit}.json?limit=5`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.5',
        }
      });
      
      const data = response.data;
      
      const posts = data.data.children.map(child => ({
        id: child.data.id,
        title: child.data.title,
        subreddit: subreddit,
        author: child.data.author,
        upvotes: child.data.ups,
        url: `https://www.reddit.com${child.data.permalink}`,
        created: new Date(child.data.created_utc * 1000).toLocaleString()
      }));
      
      allPosts.push(...posts);
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`Error fetching r/${subreddit}:`, error.message);
    }
  }
  
  return allPosts;
}

// Root route
app.get('/', (req, res) => {
  res.send('Reddit Content Feed API - Server is running!');
});

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await fetchRedditPosts();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get list of subreddits
app.get('/api/subreddits', (req, res) => {
  res.json({ subreddits });
});

// Add a new subreddit
app.post('/api/subreddits', (req, res) => {
  const { subreddit } = req.body;
  
  if (!subreddit) {
    return res.status(400).json({ error: 'Subreddit name required' });
  }
  
  // Remove 'r/' if user includes it
  const cleanName = subreddit.replace(/^r\//, '').trim().toLowerCase();
  
  if (subreddits.includes(cleanName)) {
    return res.status(400).json({ error: 'Subreddit already exists' });
  }
  
  subreddits.push(cleanName);
  res.json({ subreddits, message: `Added r/${cleanName}` });
});

// Remove a subreddit
app.delete('/api/subreddits/:name', (req, res) => {
  const { name } = req.params;
  const cleanName = name.toLowerCase();
  
  const index = subreddits.indexOf(cleanName);
  if (index === -1) {
    return res.status(404).json({ error: 'Subreddit not found' });
  }
  
  subreddits.splice(index, 1);
  res.json({ subreddits, message: `Removed r/${cleanName}` });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Fetching from subreddits: ${subreddits.join(', ')}`);
});