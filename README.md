# 🚀 Hackathon Backend

A comprehensive, production-ready Node.js backend API built for collaborative project management and team communication.

---

##  Features

-  **Authentication & Authorization** - Secure user authentication with JWT tokens
-  **User Management** - Complete user profile and workspace management
-  **Project Management** - Create, manage, and organize projects
-  **Task Tracking** - Assign and track tasks with status updates
-  **Real-time Communication** - Messaging and notifications system
-  **Comments & Collaboration** - Comment on projects and tasks
-  **Asset Management** - Handle image and file uploads
-  **Campaign Management** - Manage marketing campaigns
-  **Swagger Documentation** - Auto-generated API documentation
-  **Docker Support** - Containerized deployment ready

---

##  Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT
- **File Upload:** Multer
- **Documentation:** Swagger/OpenAPI
- **Deployment:** Docker & Render

---

##  Prerequisites

Before you begin, ensure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Docker** (optional, for containerized setup)

---

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hackathon-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```
DATABASE_URL=postgresql://user:password@localhost:5432/hackathon_db
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

### 4. Setup Database

```bash
npx prisma migrate dev
```

### 5. Start the Development Server

```bash
npm start
```

The server will start at `http://localhost:5000`

---

##  Project Structure

```
hackathon-backend/
├── src/
│   ├── index.js                 # Application entry point
│   ├── config/                  # Configuration files
│   │   ├── prisma.js           # Prisma client setup
│   │   └── swagger.js          # Swagger documentation
│   ├── controllers/             # Business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   ├── assetController.js
│   │   └── ...
│   ├── routes/                  # API route definitions
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── ...
│   └── middleware/              # Custom middleware
│       ├── auth.js             # Authentication middleware
│       └── upload.js           # File upload handling
├── prisma/
│   └── schema.prisma           # Database schema
├── uploads/                     # Uploaded files storage
├── docker-compose.yml          # Docker configuration
├── render.yaml                 # Render deployment config
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users` - List all users

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Additional Endpoints

- Messages, Notifications, Comments, Campaigns, Assets, Invites, Workspaces

---

##  API Documentation

Full API documentation is available via Swagger:

🔗 **[API Docs](https://hackathon-backend-pxvg.onrender.com/api-docs/)**

---

##  Docker Deployment

### Build and Run with Docker

```bash
docker-compose up -d
```

### View Logs

```bash
docker-compose logs -f
```

---

##  License

This project is licensed under the MIT License.

---

##  Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

---

##  Support

For support, please open an issue in the repository or contact the development team.

---

