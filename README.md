# AI Chat Space (MERN + Google Gemini API)

A full-stack, state-of-the-art AI Chat Application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and the Google Gemini API. It features dynamic user sessions, password hashing, responsive dashboard grids, dark/light themes, and persistent conversational history.

---

## Features

- **Authentication System**: Dynamic signup, login, logout, password hashing (`bcryptjs`), and JWT-protected router checks.
- **User Profiles**: Live settings page to view profile creation metadata, modify credentials, and update passwords.
- **Gemini Chat Integration**: Real-time multi-turn conversation with Google Gemini API, including bouncing dots loading indicator, auto-scroll ref trackers, and dynamic conversation title generator.
- **Persistent History**: View and load previous chat conversations via a responsive sidebar, with capabilities to delete individual conversations or clear all chat records.
- **Premium CSS Aesthetics**: Glassmorphic UI overlays, HSL contrast tokens for instant Light/Dark mode transitions, custom scrollbars, and interactive cards.
- **Deployment Ready**: Standard rewrites for Vite client deployments (Vercel) and environment variable guidelines.

---

## Project Structure

```text
/ai-chat-app
  /client               - React + Vite Single Page Application
    /src
      /components       - Reusable modules (Navbar, Sidebar, ChatArea, MessageBubble, etc.)
      /pages            - Application routes (Login, Register, Dashboard, Profile)
      /context          - Context Providers (AuthContext, ChatContext, ThemeContext)
      /services         - API configurations (Axios client with JWT Interceptor)
      - App.jsx         - Routing rules mapping
      - index.css       - Design system styles (HSL variables & layout grids)
  /server               - Node.js + Express.js API Endpoint Server
    /config             - Database connection (Mongoose)
    /controllers        - Controller handlers (Auth operations & Chat operations)
    /models             - Database schemas (User schema & Chat/Message schemas)
    /routes             - Routing files mapping HTTP endpoints to controllers
    /middleware         - JWT protections & Global JSON error captures
    /utils              - Google Gemini SDK configuration (multi-turn messaging & title generator)
    - server.js         - Express listener entry point
```

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v16+ recommended).
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection URI.
- A [Google Gemini API Key](https://ai.google.dev/).

### Step 1: Install All Dependencies
Run the installation scripts from the root directory to automatically pull packages for the workspace, client, and server folders:
```bash
npm run install-all
```

### Step 2: Configure Environment Variables

#### Server Config (`server/.env`):
Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-chat-app
JWT_SECRET=your_super_secret_jwt_sign_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

#### Client Config (`client/.env`):
Create a `.env` file in the `/client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running Locally

To run the client and server concurrently in development mode, execute:
```bash
npm run dev
```
This boots:
- The React App at `http://localhost:5173`
- The Express Server at `http://localhost:5000`

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create user profile and get JWT token.
- `POST /api/auth/login` - Verify user and return session JWT token.
- `GET /api/auth/profile` - Fetch authenticated user details (Protected).
- `PUT /api/auth/profile` - Modify profile details/password (Protected).

### Conversations & Messaging (Protected)
- `POST /api/chat/send` - Send prompt to Gemini API, saving the turn and returning conversation records.
- `GET /api/chat/history` - Fetch all conversations sorted by latest update (excluding messages for speed).
- `GET /api/chat/:id` - Fetch complete message history for a single conversation.
- `DELETE /api/chat/:id` - Remove a specific conversation.
- `DELETE /api/chat` - Wipe user's entire chat history database.

---

## Security Highlights

- **Bcrypt Protection**: Plain-text passwords are never stored. Salted and hashed on pre-save hooks.
- **JWT Verification**: Private routes reject calls missing the `Authorization: Bearer <JWT>` header.
- **CORS Config**: Access strictly limited to authorized client origins.
- **Input Sanitization**: Client validation prevents blank submissions, validating email formats and password lengths before API calls.
