const socketMiddleware = require('../middlewares/socket-middleware');

function listMachines(req, res, next) {
    require('dotenv').config({ path: '.edge.env'}); 
    const machineList = socketMiddleware.listSocket();

    res.status(200).json({
        'master':`${process.env.NAME}`,
        'machines':machineList
    });  
}

/*
 * {
 *     "machineName",
 *     "options",
 *     "imageSrc",
 *     "command"
 * }
 */
function runImage(req, res, next) {    
    // have to handle edge server case
    socketMiddleware.runDockerImage(req.body.machineName, req.body.options, req.body.imageSrc, req.body.command);

    res.status(200).json({'deploy_request':'success'});
}

/*
 * {
 *     "machineName",
 *     "containerID"
 * }
 */
function stopImage(req, res, next) {    
    // have to handle edge server case
    socketMiddleware.stopDockerImage(req.body.machineName, req.body.containerID);

    res.status(200).json({'stop_request':'success'});
}

/*
 * {
 *     "machineName"
 * }
 */
function stopAll(req, res, next) {    
    // have to handle edge server case
    socketMiddleware.stopAllImage(req.body.machineName);

    res.status(200).json({'stop_all_request':'success'});
}


/*
 * {
 *     "machineName"
 * }
 */
async function getDockerStatus(req, res, next) {
    const socket = await socketMiddleware.getSocketByName(req.query.machineName);

    socket.emit('status', async function(data) {
        res.status(200).send(data);
    });
}

module.exports = {
    listMachines: listMachines,
    runImage: runImage,
    stopImage: stopImage,
    stopAll: stopAll,
    getDockerStatus: getDockerStatus
}
