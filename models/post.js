const mongoose =require('mongoose');

const postSchema=new mongoose.Schema({
	content:{
		type:String,
		required:true
	},
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User',
	},
	// include the array of ids of comments for fast access of the comments of a post

	comments:[
{
	type:mongoose.Schema.Types.ObjectId,
	ref:'Comment',
}


	],
	likes:[

	{
		type:mongoose.Schema.ObjectId,
		ref:'Like',
	}

	],


},{
	timestamps:true,
}

);

const Post =mongoose.model('Post',postSchema);
module.exports=Post;