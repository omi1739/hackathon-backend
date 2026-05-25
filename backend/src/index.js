const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const authRoutes = require("./routes/auth");
const workspaceRoutes = require("./routes/workspaces");
const projectRoutes = require("./routes/projects");
const taskRoutes = require("./routes/tasks");
const campaignRoutes = require("./routes/campaigns");
const assetRoutes = require("./routes/assets");
const commentRoutes = require("./routes/comments");
const inviteRoutes = require("./routes/invites");
const userRoutes = require("./routes/users");
const notificationRoutes = require("./routes/notifications");
const messageRoutes = require("./routes/messages");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "http://localhost:3000", methods: ["GET", "POST"] },
});

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-workspace", (workspaceId) => {
    socket.join(`workspace:${workspaceId}`);
  });

  socket.on("leave-workspace", (workspaceId) => {
    socket.leave(`workspace:${workspaceId}`);
  });

  socket.on("send-message", (data) => {
    io.to(`workspace:${data.workspaceId}`).emit("new-message", data);
  });

  socket.on("task-updated", (data) => {
    io.to(`workspace:${data.workspaceId}`).emit("task-changed", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
