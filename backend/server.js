 const express = require('express');
const app = express();
const PORT = 3000;

// Basic route - when someone visits your server, send a message
app.get('/', (req, res) => {
  res.send('Hello! Your Reddit Content Feed backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
