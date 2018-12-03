import io from 'socket.io-client';

if (typeof io === 'undefined') {
  throw new Error('Socket.io required');
}

export default io;
