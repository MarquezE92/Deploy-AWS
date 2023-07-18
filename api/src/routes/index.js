
const { Router } = require('express'); 
const router = Router();   
const { routePostInfo } = require('./postInfo');   
const { routeGetAllInfo } = require('./getAllInfo');


router.post("/info", routePostInfo);     
router.get("/info", routeGetAllInfo);



module.exports = router; 