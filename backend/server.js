require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth'); // Import auth routes
const farmerRoutes = require('./routes/farmerRoutes'); // Import farmer routes
const farmerDetailsRoutes = require('./routes/farmerDetails'); // Import farmer details routes
const productRoutes = require('./routes/productRoutes'); // Import updated product routes
const buyerRoutes = require('./routes/buyerRoutes');
const buyerDetailsRoutes = require('./routes/buyerDetails'); // Import Buyer Details routes
const productsRoute = require('./routes/products');
const bidsRoute = require('./routes/bids');
const buyersRoute = require('./routes/buyers');
const availableProductRoutes = require('./routes/availableProducts'); // Updated path to the new file
const chatRoute = require('./routes/chat'); // Chat route
const path = require('path');
const mime = require('mime');
//const helmet = require('helmet');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', (req, res, next) => {
  res.type(mime.getType(req.path));
  next();
}, express.static(path.join(__dirname, 'uploads')));
// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://agroProj:kannan2030@kannan.qij5fmf.mongodb.net/?appName=Kannan';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoute); // Authentication routes
app.use('/api/farmer', farmerRoutes); // Farmer-specific routes
app.use('/api/farmer', farmerDetailsRoutes); // Farmer details routes
app.use('/api/products', productRoutes); // Product routes (Updated)
app.use('/api/buyer', buyerRoutes);
app.use('/api/buyer', buyerDetailsRoutes); // Add Buyer Details routes
app.use('/api/products', productsRoute);
app.use('/api/bids', bidsRoute);
app.use('/api/buyers', buyersRoute);
app.use('/api/availableProducts', availableProductRoutes); // New route for available products
app.use('/api/chat', chatRoute); // Chat route
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'", 'data:', 'blob:', 'http:', 'https:'],
//         scriptSrc: ["'self'", 'http:', 'https:'],
//         styleSrc: ["'self'", 'http:', 'https:', "'unsafe-inline'"],
//         imgSrc: ["'self'", 'data:', 'http:', 'https:'],
//         mediaSrc: ["'self'", 'http:', 'https:'], // Add this for video sources
//       },
//     },
//   })
// );
// Welcome route
app.get('/api/welcome', (req, res) => {
  res.json({ message: 'Welcome to AgroBidding' });
});


// WebSocket setup
const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Create WebSocket server on the same HTTP server
const wss = new WebSocket.Server({ server });


// Broadcast helper
function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Export broadcast for use in routes
app.locals.broadcast = broadcast;

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      // Chat message handling
      if (data.type === 'chat' && data.senderId && data.receiverId && data.message) {
        // Save chat message to DB
        const ChatMessage = require('./models/ChatMessage');
        const chatMsg = new ChatMessage({
          senderId: data.senderId,
          receiverId: data.receiverId,
          message: data.message,
        });
        await chatMsg.save();
        // Broadcast only to relevant clients (for demo, broadcast to all)
        broadcast({
          type: 'chat',
          senderId: data.senderId,
          receiverId: data.receiverId,
          message: data.message,
          timestamp: chatMsg.timestamp,
        });
      } else {
        // Other message types (fallback: broadcast)
        broadcast({ type: 'broadcast', payload: data });
      }
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  ws.send(JSON.stringify({ type: 'welcome', message: 'WebSocket connection established' }));
});

server.listen(PORT, () => console.log(`Server running (HTTP+WebSocket) on port ${PORT}`));
