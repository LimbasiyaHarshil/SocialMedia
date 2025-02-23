const io = require('socket.io')(8800, {
    cors: {
        origin: "http://localhost:3000"
    }
})

let activeUsers = []

io.on('connection', (socket) => {
    // add new users
    socket.on('new-user-add', (newUserId) => {
        // if user is not addes previously
        if (!activeUsers.some((user) => user.userId === newUserId)) {
            activeUsers.push({
                userId: newUserId,
                socketId: socket.id
            })
        }
        console.log('Connected Users', activeUsers);
        io.emit('get-users', activeUsers)
    })

    // send Message
    socket.on('send-message', (data) => {
        const { receiverId } = data;
        const user = activeUsers.find((user) => user.userId === receiverId);
        console.log('Sending from socket to :', receiverId);
        console.log('Data:', data);
        if (user) {
            io.to(user.socketId).emit('receive-message', data);
        }
    })

    socket.on('disconnect', () => {
        // remove disconnected user
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log('User disconnected', activeUsers);
        io.emit('get-users', activeUsers)
    })
});