const express = require('express');
const app = express();
const PORT = 3000;

// Mock Reddit data - fake posts that look like real ones
const mockPosts = [
  {
    id: '1',
    title: 'Amazing concert announced for next month!',
    subreddit: 'music',
    author: 'musiclover99',
    upvotes: 523,
    created: '2 hours ago',
    url: 'https://reddit.com/r/music/comments/example1'
  },
  {
    id: '2',
    title: 'Lakers defeat Celtics in overtime thriller',
    subreddit: 'nba',
    author: 'hoopsfan',
    upvotes: 1847,
    created: '5 hours ago',
    url: 'https://reddit.com/r/nba/comments/example2'
  },
  {
    id: '3',
    title: 'New indie band recommendation - they\'re incredible',
    subreddit: 'music',
    author: 'indievibes',
    upvotes: 234,
    created: '1 day ago',
    url: 'https://reddit.com/r/music/comments/example3'
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Reddit Content Feed API - Server is running!');
});

// API endpoint to get posts
app.get('/api/posts', (req, res) => {
  res.json(mockPosts);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});