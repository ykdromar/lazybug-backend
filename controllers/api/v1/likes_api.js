const Comment=require('../../../models/comment');
const Post=require('../../../models/post');
const Like=require('../../../models/like');
const jwt=require('jsonwebtoken');
const env=require('../../../config/environment');

module.exports.toggleLike= async function(req,res){
try{

	//likes/toggle/?id=abcd&type=Post
	let likeable;
	let deleted=false;
	if(req.query.type=='Post'){
		likeable=await Post.findById(req.query.id).populate('likes');
	}else{
		likeable=await Comment.findById(req.query.id).populate('likes');
	}
	//check like if like already existing
	let existingLike=await Like.findOne({
		likeable:req.query.id,
		onModel:req.query.type,
		user:req.body.user_id,
	});
	//if a like exists then delete it
	if(existingLike){
		likeable.likes.pull(existingLike._id);
		likeable.save();
		existingLike.remove();
		deleted=true;

	}else{
		let newLike=await Like.create({
			user:req.body.user_id,
			onModel:req.query.type,
			likeable:req.query.id,
		});
		likeable.likes.push(newLike._id);
		likeable.save();
	}
	return res.status(200).json({
		message:"Like Done",
		success:true,
		data:{
			deleted:deleted,
			likes:likeable.likes,
		
		}
	});

}catch(error){
	
	return res.status(500).json({
success:false,
		message:"Internal Server error"});
}
} 