# espresso-chat

A real-time chat application built with MERN stack, TypeScript, and Socket.io.

## Project Structure

- `client/` - React frontend (Vite + TypeScript)
- `server/` - Express backend (Node + TypeScript + Socket.io)
- `shared/` - Shared types and constants

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
```bash
   npm install
```

### Development

Run both client and server:
```bash
npm run dev
```

Or run separately:
```bash
npm run dev:client  # Frontend only
npm run dev:server  # Backend only
```

### Environment Variables

Create a `.env` file in the `server/` directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chat-app
NODE_ENV=development
```

## Team

Built by 12o-clockCommit aka [pink-fairy-armadillos]

```bash
chat-app/
├── client/
├── server/
├── shared/
├── .gitignore
├── package.json
└── README.md
```