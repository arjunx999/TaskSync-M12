import { io } from "socket.io-client"

const socket = io("https://tasksync-m12.onrender.com", {
  withCredentials: true,
  transports: ['websocket'],
});

export default socket;