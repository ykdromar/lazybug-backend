const express= require('express');
const passport=require('passport');
const router=express.Router();
const CommentsAPI=require("../../../controllers/api/v1/comments_api");

router.post('/',passport.authenticate('jwt',{session:false}),CommentsAPI.createComment);
module.exports=router;