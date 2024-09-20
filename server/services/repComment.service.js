const modelRepComment = require('../model/repComment.model');

const repCommentService = {
    createRepComment: async (data) => {
        try {
            const savedRepComment = await modelRepComment.create(data);
            return savedRepComment;
        } catch (error) {
            throw new Error('Error creating reply comment');
        }
    },

    findRepCommentsByCommentId: async (id_comment) => {
        try {
            const repComments = await modelRepComment.find({ id_comment });
            return repComments;
        } catch (error) {
            throw new Error('Error fetching reply comments');
        }
    },
    deleteRepCommentById : async (id) => {
        return await modelRepComment.findByIdAndDelete(id);
    },
};

module.exports = repCommentService;