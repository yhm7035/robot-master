// have to add mutex
const socketStatus = {};
const socketDic = {};

function healthcheck(socket) {
    if(socketStatus[socket.id]!=undefined) {
        socketStatus[socket.id].status++;

        if(socketStatus[socket.id].status > 2) {
            // delete unhealthy robot
            deleteSocket(socket.id);
            return 1;
        }
    }
    
    socket.emit('health_check', 'syn');
}

function manageSocketStatus(socket, data) {
    // register robot's name and socket
    // have to do dupulication check
    if(socketStatus[socket.id]==undefined) {
        socketStatus[socket.id] = {
            'name':data.name,
            'status':0,
            'base':data.base
        };
        socketDic[data.name] = socket;

        console.log(socketStatus[socket.id]);
        console.log(`${data.name} is registered`);
    }

    socketStatus[socket.id].status = 0;
}

function listSocket() {
    const socketList = {'docker':[], 'kube':[]};

    if(Object.keys(socketStatus).length > 0) {
        for(var key in socketStatus) {
            if(`${socketStatus[key].base}`=='docker') {
                socketList.docker.push(`${socketStatus[key].name}`);
            }
            else if(`${socketStatus[key].base}`=='kube') {
                socketList.kube.push(`${socketStatus[key].name}`);
            }
        }
    }

    return socketList;
}

function deleteSocket(socketID) {
    const robotName = socketStatus[socketID].name;

    delete socketDic[robotName];
    delete socketStatus[socketID];

    console.log(`${robotName} is unregistered`);
}

function runDockerImage(machineName, options, imageSrc, command) {
    if(socketDic[machineName] == undefined) {
        // because of machine failure
    } else {
        socketDic[machineName].emit('run', {'options':`${options}`,'imageSrc':`${imageSrc}`,'command':`${command}`});
    }
}

function stopDockerImage(machineName, containerID) {
    if(socketDic[machineName] == undefined) {
        // because of machine failure
    } else {
        socketDic[machineName].emit('stop', {'containerID':`${containerID}`});
    }
}

function stopAllImage(machineName) {
    if(socketDic[machineName] == undefined) {
        // because of machine failure
    } else {
        socketDic[machineName].emit('stopAll', 'request');
    }
}

async function getSocketByName(machineName) {
    if(socketDic[machineName] == undefined) {
        // because of machine failure
    } else {
        return socketDic[machineName];
    }
}

module.exports = {
    healthcheck: healthcheck,
    manageSocketStatus: manageSocketStatus,
    listSocket: listSocket,
    runDockerImage: runDockerImage,
    deleteSocket: deleteSocket,
    stopDockerImage:stopDockerImage,
    stopAllImage:stopAllImage,
    getSocketByName: getSocketByName
}