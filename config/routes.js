const lgController = require('./../src/controllers/lg-controller');
const router = require("express").Router();

router.get('/lg/listMachines', lgController.listMachines);
router.get('/lg/listDocker', lgController.getDockerStatus);
router.post('/lg/runImage', lgController.runImage);

module.exports = router