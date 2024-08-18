const express= require('express');
const passport=require('passport');
const router=express.Router();
const likesAPI=require("../../../controllers/api/v1/likes_api");

router.use('/toggle',passport.authenticate('jwt',{session:false}),likesAPI.toggleLike);

module.exports=router;