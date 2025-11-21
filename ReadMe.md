# Socket.io Chat App

A simple real-time chat application featuring live messaging, online user status, and typing indicators. 

## Project Structure

```
socketio-chat/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── socket/
│   │   └── App.jsx
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── socket/
│   ├── utils/
│   ├── server.js
│   └── package.json
└── README.md
```

## Features
- Global chat room
- Username authentication
- Online/offline user tracking
- Typing indicator
- System notifications

## Getting Started

### Prerequisites
- Node.js v18+

### Install & Run

1. **Server**
   ```
   cd server
   npm install
   npm run dev
   ```
2. **Client**
   ```
   cd client
   npm install
   npm start
   ```

3. **Visit** [http://localhost:3000](http://localhost:3000)

## Screenshots

_Add screenshots or GIFs demonstrating chat functionality here._

## Licensing and Contribution

MIT. Contributions welcome!
