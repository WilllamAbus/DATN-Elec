const Post = require("../../../../model/post/post");


const checkPostTitleExists = async (title) => {
  const post = await Post.findOne({ title });
  return post !== null;
};



const validateTags = (tags) => {
  if (!Array.isArray(tags)) return false; 
  return tags.every(tag => typeof tag === 'string' && tag.trim().length > 0); 
};

module.exports = {
  checkPostTitleExists,
  validateTags
};
