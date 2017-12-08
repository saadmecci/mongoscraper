var mongoose = require("mongoose");

//save a reference to the Schema constructor
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	//content of the comment will be a string and is required
	comment: {
		type: String,
		required: true
	}
});
//uses mongoose's model method to create a model from the above schema
var Comment = mongoose.model("Comment", CommentSchema);
//export the Comment model
module.exports = Comment;