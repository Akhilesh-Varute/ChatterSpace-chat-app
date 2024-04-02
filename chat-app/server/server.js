import express from 'express';
import { createServer } from 'http';
import socketIo from 'socket.io';
import cors from "cors";

const app = express();
const server = createServer(app);
const io = socketIo(server);

app.use(cors())

let clients = [];

io.on('connection', (socket) => {
  console.log(`A new client has connected: ${socket.id}`);
  
  clients.push({ id: socket.id });
  socket.broadcast.emit('clients', clients);

  socket.on('message', (data) => {
    socket.to(data.to).emit('message', data);
  });

  socket.on('join', (room) => {
    socket.join(room);
    socket.broadcast.to(room).emit('joined', {
      id: socket.id,
    })
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
