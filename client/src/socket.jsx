import { io } from "socket.io-client"

const socket = io("http://localhost:9999", {
  withCredentials: true,
  transports: ['websocket'],
});

export default socket;