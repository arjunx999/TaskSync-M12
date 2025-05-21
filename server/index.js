import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import directMessageRoutes from "./routes/directMessageRoutes.js";
import groupMessageRoutes from "./routes/groupMessageRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import { connectDB } from "./config/db.js";
import { DirectMessage } from "./models/direct_message.js";
import { GroupMessage } from "./models/group_message.js";
import path from "path";
import { fileURLToPath } from "url"

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

connectDB();

app.use(cors());
app.use(express.json());

app.get("/demo", (req, res) => {
  res.send("hello hello");
});

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/directMessages", directMessageRoutes);
app.use("/groupMessages", groupMessageRoutes);
app.use("/auth", authRoutes);
app.use("/groups", groupRoutes);

const onlineUsers = new Map();

io.on("connection", (socket) => {
  // console.log("new client connected ", socket.id);

  // Assign users a socket id when they connect
  socket.on("user-connected", (userId) => {
    onlineUsers.set(userId, socket.id);
    // console.log("User Connected:", userId);
  });

  // Handle Disconnection
  socket.on("disconnect", () => {
    // console.log("client disconnected", socket.id);
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        // console.log("User Disconnected:", userId);
        break;
      }
    }
  });

  // DIRECT MESSAGE
  socket.on("send-message", async ({ senderId, receiverId, content }) => {
    try {
      const newMessage = new DirectMessage({
        sender: senderId,
        receiver: receiverId,
        content,
      });
      await newMessage.save();

      // Emit if receiver is online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", newMessage);
      }
    } catch (error) {
      console.error("Error in sending message:", error.message);
    }
  });

  // GROUP MESSAGE
  socket.on("join-group", ({ groupId }) => {
    socket.join(groupId);
    console.log(`User joined group: ${groupId}`);
  });

  // Send Message
  socket.on("send-group-message", async ({ senderId, groupId, content, attachment }) => {
    try {
      const newGroupMessage = new GroupMessage({
        group: groupId,
        sender: senderId,
        content,
        attachment,
      });
      await newGroupMessage.save();

      // Send to all sockets in the group room
      io.to(groupId).emit("receive-group-message", newGroupMessage);
    } catch (error) {
      console.error("Error in sending group message:", error.message);
    }
  });
});

const PORT = process.env.PORT || 9999;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
