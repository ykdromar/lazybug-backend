const Comment=require('../../../models/comment');
const Post=require('../../../models/post');

const jwt=require('jsonwebtoken');
const env=require('../../../config/environment');

module.exports.createComment=async function(req,res){

try{

Post.findById(req.body.post_id,function(err,post){
	if(post){
		Comment.create({
			content:req.body.content,
			post:req.body.post_id,
			user:req.body.user_id,
		},
		async function(err,comment){
			if(err){
				return res.status(500).json({
		success:false,
		data:{},
		message:err,
	});

			}
			let newComment=await comment.populate('user');
			post.comments.push(comment._id);
			post.save();
			
			return  res.status(200).json({
		success:true,
		data:{
			comment:newComment
		},
		message:"comment added successfully",
	});
		}
		);
	}else{
		return res.status(404).json({
		success:false,
		data:{},
		message:"Post not found",
	});
	}
});

}catch(error){
	return res.status(500).json({
		success:false,
		data:{},
		message:error,
	});
}
}