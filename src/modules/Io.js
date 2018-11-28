import io from "socket.io";

if (typeof io === 'undefined') {
  throw new Error('Socket.io required');
}

export default io;
