var mongoose = require("mongoose");

//save a reference to the Schema constructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	//title of the article will be a string and is required
	title: {
		type: String,
		required: true
	},
	//link to the article will be a string and is required
	link: {
		type: String,
		required: true
	},
	summary: {
		type: String,
	},
	//connects to the comment model so that the article will have the comments associated with it
	comment: {
		type: Schema.Types.ObjectId,
		ref: "Comment"
	}
});
//uses mongoose's model method to create a model from the above schema
var Article = mongoose.model("Article", ArticleSchema);
//export the Article model
module.exports = Article;