const socketMiddleware = require('./../src/middlewares/socket-middleware');
const socketIO = require("socket.io");

function openSocket(port) {
    const socketServer = socketIO.listen(port);
    console.log(`socket listening on port ${port}`);

    socketServer.on('connection', (socket) => {
        // send first healthcheck msg
        socketMiddleware.healthcheck(socket);

        setInterval(_ => socketMiddleware.healthcheck(socket), 60000);

        socket.on('health_check', (robotName) => {
            socketMiddleware.manageSocketStatus(socket, robotName);
        })

        socket.on('disconnect', () => {
            socketMiddleware.deleteSocket(socket.id);
        });

        socket.on('status', () => {
            
        });
    });
}

module.exports = {
    openSocket:openSocket
}